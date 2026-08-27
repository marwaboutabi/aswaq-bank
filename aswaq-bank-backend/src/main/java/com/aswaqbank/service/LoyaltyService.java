package com.aswaqbank.service;
import com.aswaqbank.entity.BankAccount;
import com.aswaqbank.repository.BankAccountRepository;
import com.aswaqbank.entity.CompensationStatus;
import com.aswaqbank.entity.LoyaltyRewardAllocation;
import com.aswaqbank.entity.MerchantCompensation;
import com.aswaqbank.entity.LoyaltyAccount;
import com.aswaqbank.entity.LoyaltyReward;
import com.aswaqbank.entity.LoyaltyRewardStatus;
import com.aswaqbank.entity.LoyaltyTransaction;
import com.aswaqbank.entity.LoyaltyTransactionType;
import com.aswaqbank.entity.Merchant;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.LoyaltyAccountRepository;
import com.aswaqbank.repository.LoyaltyRewardRepository;
import com.aswaqbank.repository.LoyaltyTransactionRepository;
import com.aswaqbank.repository.LoyaltyRewardAllocationRepository;
import com.aswaqbank.repository.MerchantCompensationRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import com.aswaqbank.repository.MerchantRepository;
@Service
public class LoyaltyService {

    private final LoyaltyAccountRepository loyaltyAccountRepository;
    private final LoyaltyTransactionRepository loyaltyTransactionRepository;
    private final LoyaltyRewardRepository loyaltyRewardRepository;
    private final LoyaltyRewardAllocationRepository loyaltyRewardAllocationRepository;
    private final MerchantCompensationRepository merchantCompensationRepository;
    private final MerchantRepository merchantRepository;
    private final BankAccountRepository bankAccountRepository;
    
    public LoyaltyService(
            LoyaltyAccountRepository loyaltyAccountRepository,
            LoyaltyTransactionRepository loyaltyTransactionRepository,
            LoyaltyRewardRepository loyaltyRewardRepository,
            LoyaltyRewardAllocationRepository loyaltyRewardAllocationRepository,
            MerchantCompensationRepository merchantCompensationRepository,
            MerchantRepository merchantRepository,
            BankAccountRepository bankAccountRepository
    ) {
        this.loyaltyAccountRepository = loyaltyAccountRepository;
        this.loyaltyTransactionRepository = loyaltyTransactionRepository;
        this.loyaltyRewardRepository = loyaltyRewardRepository;
        this.loyaltyRewardAllocationRepository = loyaltyRewardAllocationRepository;
        this.merchantCompensationRepository = merchantCompensationRepository;
        this.merchantRepository = merchantRepository;
        this.bankAccountRepository = bankAccountRepository;
    }
    // =========================================================
    // RÉCUPÉRER OU CRÉER LE COMPTE FIDÉLITÉ
    // =========================================================

    public LoyaltyAccount getOrCreateAccount(User user) {
        return loyaltyAccountRepository.findByUser(user)
                .orElseGet(() -> {
                    LoyaltyAccount account = new LoyaltyAccount();
                    account.setUser(user);
                    account.setPoints(0);
                    account.setLevel("Bronze");
                    return loyaltyAccountRepository.save(account);
                });
    }

    // =========================================================
    // AJOUTER DES POINTS (10 MAD = 1 POINT)
    // =========================================================

    @Transactional
    public void earnPoints(User client, Merchant merchant, BigDecimal amount, String description) {
        if (client == null || amount == null) return;
        if (amount.compareTo(BigDecimal.ZERO) <= 0) return;

        int points = amount.divide(BigDecimal.TEN).intValue();
        if (points <= 0) return;

        LoyaltyAccount account = getOrCreateAccount(client);
        account.setPoints(account.getPoints() + points);
        updateLevel(account);
        loyaltyAccountRepository.save(account);

        LoyaltyTransaction transaction = new LoyaltyTransaction();
        transaction.setClient(client);
        transaction.setMerchant(merchant);
        transaction.setAmount(amount);
        transaction.setPoints(points);
        transaction.setRemainingPoints(points);
        transaction.setType(LoyaltyTransactionType.EARNED);
        transaction.setDescription(description != null ? description : "Points gagnés");

        loyaltyTransactionRepository.save(transaction);
    }

    // =========================================================
    // UTILISER DES POINTS
    // =========================================================

    @Transactional
    public boolean spendPoints(User client, Merchant merchant, Integer points, String description) {
        if (client == null || points == null || points <= 0) return false;

        LoyaltyAccount account = getOrCreateAccount(client);
        if (account.getPoints() < points) return false;

        account.setPoints(account.getPoints() - points);
        updateLevel(account);
        loyaltyAccountRepository.save(account);

        LoyaltyTransaction transaction = new LoyaltyTransaction();
        transaction.setClient(client);
        transaction.setMerchant(merchant);
        transaction.setPoints(-points);
        transaction.setType(LoyaltyTransactionType.SPENT);
        transaction.setDescription(description != null ? description : "Points utilisés");

        loyaltyTransactionRepository.save(transaction);
        return true;
    }

    // =========================================================
    // CONVERTIR LES POINTS EN BON D'ACHAT
    // =========================================================

    private String generateRewardCode() {
        return "ASW-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
    }

    @Transactional
    public LoyaltyReward convertPointsToReward(User client) {
        LoyaltyAccount account = getOrCreateAccount(client);

        if (account.getPoints() < 200) {
            throw new RuntimeException("Vous devez avoir au moins 200 points pour obtenir un bon.");
        }

        int pointsToConvert = 200;

        // 1. Créer le bon
        LoyaltyReward reward = new LoyaltyReward();
        reward.setClient(client);
        reward.setCode(generateRewardCode());
        reward.setPointsUsed(pointsToConvert);
        reward.setRewardAmount(new BigDecimal("20.00"));
        reward.setStatus(LoyaltyRewardStatus.AVAILABLE);
        reward.setExpiresAt(java.time.LocalDateTime.now().plusMonths(2)); // ✅ Ajout expiration
        reward = loyaltyRewardRepository.save(reward);

        // 2. Récupérer les opérations de points gagnés
        List<LoyaltyTransaction> earnedTransactions = loyaltyTransactionRepository
                .findByClientOrderByCreatedAtDesc(client)
                .stream()
                .filter(t -> t.getType() == LoyaltyTransactionType.EARNED
                        && t.getRemainingPoints() != null
                        && t.getRemainingPoints() > 0
                        && t.getMerchant() != null)
                .toList();

        int remainingToAllocate = pointsToConvert;

        // 3. Répartir les 200 points entre les commerçants
        for (LoyaltyTransaction transaction : earnedTransactions) {
            if (remainingToAllocate <= 0) break;

            int available = transaction.getRemainingPoints();
            int pointsUsed = Math.min(available, remainingToAllocate);

            BigDecimal amount = BigDecimal.valueOf(pointsUsed).multiply(new BigDecimal("0.10"));

            LoyaltyRewardAllocation allocation = new LoyaltyRewardAllocation();
            allocation.setReward(reward);
            allocation.setMerchant(transaction.getMerchant());
            allocation.setPoints(pointsUsed);
            allocation.setAmount(amount);
            loyaltyRewardAllocationRepository.save(allocation);

            transaction.setRemainingPoints(available - pointsUsed);
            loyaltyTransactionRepository.save(transaction);
            remainingToAllocate -= pointsUsed;
        }

        if (remainingToAllocate > 0) {
            throw new RuntimeException("Impossible de déterminer l'origine des points à convertir.");
        }

        // 4. Retirer les 200 points du compte client
        account.setPoints(account.getPoints() - pointsToConvert);
        loyaltyAccountRepository.save(account);

        // 5. Historique de la conversion
        LoyaltyTransaction transaction = new LoyaltyTransaction();
        transaction.setClient(client);
        transaction.setAmount(new BigDecimal("20.00"));
        transaction.setPoints(-pointsToConvert);
        transaction.setRemainingPoints(0);
        transaction.setType(LoyaltyTransactionType.SPENT);
        transaction.setDescription("Conversion de 200 points en bon de 20 DH");
        loyaltyTransactionRepository.save(transaction);

        return reward;
    }

    // =========================================================
    // UTILISER UN BON D'ACHAT (CÔTÉ COMMERÇANT)
    // =========================================================

    @Transactional
    public LoyaltyReward redeemReward(String code, User merchantUser) {

        if (code == null || code.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Le code du bon est obligatoire."
            );
        }

        if (merchantUser == null) {
            throw new IllegalStateException(
                    "Utilisateur non authentifié."
            );
        }

        if (merchantUser.getRole() == null
                || !"MERCHANT".equalsIgnoreCase(
                        merchantUser.getRole().toString()
                )) {

            throw new IllegalStateException(
                    "Seul un commerçant peut utiliser un bon d'achat."
            );
        }

        // =====================================================
        // 1. Récupérer le commerçant connecté
        // =====================================================

        Merchant usedMerchant = merchantRepository
                .findByUserId(merchantUser.getId())
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Profil commerçant introuvable."
                        )
                );

        // =====================================================
        // 2. Rechercher le bon
        // =====================================================

        String normalizedCode = code.trim().toUpperCase();

        LoyaltyReward reward = loyaltyRewardRepository
                .findByCodeIgnoreCase(normalizedCode)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Bon d'achat introuvable."
                        )
                );

        // =====================================================
        // 3. Vérifier le statut
        // =====================================================

        if (reward.getStatus() != LoyaltyRewardStatus.AVAILABLE) {
            throw new IllegalStateException(
                    "Ce bon d'achat n'est plus disponible."
            );
        }

        // =====================================================
        // 4. Vérifier l'expiration
        // =====================================================

        if (reward.getExpiresAt() != null
                && reward.getExpiresAt()
                        .isBefore(java.time.LocalDateTime.now())) {

            reward.setStatus(
                    LoyaltyRewardStatus.EXPIRED
            );

            loyaltyRewardRepository.save(reward);

            throw new IllegalStateException(
                    "Ce bon d'achat a expiré."
            );
        }

        // =====================================================
        // 5. Marquer le bon comme utilisé
        // =====================================================

        reward.setStatus(
                LoyaltyRewardStatus.USED
        );

        reward.setUsedAt(
                java.time.LocalDateTime.now()
        );

        LoyaltyReward savedReward =
                loyaltyRewardRepository.save(reward);

        // =====================================================
        // 6. CRÉER LES COMPENSATIONS
        // =====================================================

        

        return savedReward;
    }

    // =========================================================
    // CALCUL DU NIVEAU
    // =========================================================

    private void updateLevel(LoyaltyAccount account) {
        int points = account.getPoints();
        if (points >= 3000) account.setLevel("Platine");
        else if (points >= 1500) account.setLevel("Or");
        else if (points >= 500) account.setLevel("Argent");
        else account.setLevel("Bronze");
    }

    // =========================================================
    // HISTORIQUE CLIENT
    // =========================================================

    public List<LoyaltyTransaction> getHistory(User user) {
        return loyaltyTransactionRepository.findByClientOrderByCreatedAtDesc(user);
    }

    // ✅ AJOUT : HISTORIQUE COMMERÇANT
    // =========================================================

    public List<LoyaltyTransaction> getMerchantHistory(Merchant merchant) {
        if (merchant == null) {
            throw new RuntimeException("Commerçant invalide");
        }
        return loyaltyTransactionRepository.findByMerchantOrderByCreatedAtDesc(merchant);
    }

    // =========================================================
    // CRÉER LES COMPENSATIONS COMMERÇANTS
    // =========================================================

    @Transactional
    public void createMerchantCompensations(
            LoyaltyReward reward,
            Merchant usedMerchant,
            BigDecimal usedVoucherAmount
    ) {
        if (reward == null || usedMerchant == null || usedVoucherAmount == null) {
            return;
        }

        if (usedVoucherAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        List<LoyaltyRewardAllocation> allocations =
                loyaltyRewardAllocationRepository.findByReward(reward);

        if (allocations == null || allocations.isEmpty()) {
            throw new RuntimeException(
                    "Aucune allocation trouvée pour le bon " + reward.getCode()
            );
        }

        BigDecimal remainingAmount = usedVoucherAmount;

        for (LoyaltyRewardAllocation allocation : allocations) {

            if (remainingAmount.compareTo(BigDecimal.ZERO) <= 0) {
                break;
            }

            Merchant sourceMerchant = allocation.getMerchant();

            if (sourceMerchant == null) {
                continue;
            }

            BigDecimal allocationAmount = allocation.getAmount();

            if (allocationAmount == null ||
                    allocationAmount.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            /*
             * Si le bon est utilisé chez le même commerçant
             * qui a généré cette partie du bon,
             * aucune compensation inter-commerçants n'est nécessaire.
             */
            if (sourceMerchant.getId().equals(usedMerchant.getId())) {
                BigDecimal selfAmount = allocationAmount.min(remainingAmount);

                remainingAmount = remainingAmount.subtract(selfAmount);

                continue;
            }

            /*
             * Montant réellement compensable
             */
            BigDecimal compensationAmount =
                    allocationAmount.min(remainingAmount);

            /*
             * Vérifier si la compensation existe déjà
             */
            if (merchantCompensationRepository
                    .existsByRewardAndFromMerchantAndToMerchant(
                            reward,
                            sourceMerchant,
                            usedMerchant
                    )) {

                remainingAmount =
                        remainingAmount.subtract(compensationAmount);

                continue;
            }

            /*
             * Récupérer les comptes bancaires des deux commerçants
             */
            BankAccount sourceAccount =
                    bankAccountRepository.findByUserEmail(
                            sourceMerchant.getUser().getEmail()
                    ).orElseThrow(() ->
                            new RuntimeException(
                                    "Compte bancaire introuvable pour le commerçant source : "
                                            + sourceMerchant.getCompanyName()
                            )
                    );

            BankAccount destinationAccount =
                    bankAccountRepository.findByUserEmail(
                            usedMerchant.getUser().getEmail()
                    ).orElseThrow(() ->
                            new RuntimeException(
                                    "Compte bancaire introuvable pour le commerçant destinataire : "
                                            + usedMerchant.getCompanyName()
                            )
                    );

            /*
             * Vérifier le solde du commerçant source
             */
            if (sourceAccount.getBalance().compareTo(compensationAmount) < 0) {
                throw new RuntimeException(
                        "Solde insuffisant du commerçant "
                                + sourceMerchant.getCompanyName()
                                + " pour effectuer la compensation de "
                                + compensationAmount
                                + " MAD."
                );
            }

            /*
             * ================================
             * TRANSFERT DE COMPENSATION
             * ================================
             */

            sourceAccount.setBalance(
                    sourceAccount.getBalance()
                            .subtract(compensationAmount)
            );

            destinationAccount.setBalance(
                    destinationAccount.getBalance()
                            .add(compensationAmount)
            );

            bankAccountRepository.save(sourceAccount);
            bankAccountRepository.save(destinationAccount);

            /*
             * ================================
             * CRÉATION DE LA COMPENSATION
             * ================================
             */

            MerchantCompensation compensation =
                    new MerchantCompensation();

            compensation.setReward(reward);
            compensation.setFromMerchant(sourceMerchant);
            compensation.setToMerchant(usedMerchant);

            int compensationPoints =
                    compensationAmount
                            .multiply(new BigDecimal("10"))
                            .intValue();

            compensation.setPoints(compensationPoints);
            compensation.setAmount(compensationAmount);

            /*
             * La compensation est maintenant réellement effectuée
             */
            compensation.setStatus(CompensationStatus.SETTLED);

            merchantCompensationRepository.save(compensation);

            /*
             * Mettre à jour le montant restant
             */
            remainingAmount =
                    remainingAmount.subtract(compensationAmount);
        }

        /*
         * Vérifier que tout le bon a été couvert
         */
        if (remainingAmount.compareTo(BigDecimal.ZERO) > 0) {

            throw new RuntimeException(
                    "Impossible de couvrir entièrement le montant du bon "
                            + reward.getCode()
                            + ". Montant restant : "
                            + remainingAmount
                            + " MAD."
            );
        }
    }
}