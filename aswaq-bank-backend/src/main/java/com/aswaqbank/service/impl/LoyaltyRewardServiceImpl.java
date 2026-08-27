package com.aswaqbank.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aswaqbank.entity.LoyaltyReward;
import com.aswaqbank.entity.LoyaltyRewardStatus;
import com.aswaqbank.entity.Merchant;
import com.aswaqbank.entity.User;
import com.aswaqbank.entity.Sale;

import com.aswaqbank.repository.LoyaltyRewardRepository;
import com.aswaqbank.repository.MerchantRepository;
import com.aswaqbank.repository.UserRepository;

import com.aswaqbank.service.LoyaltyRewardService;
import com.aswaqbank.service.LoyaltyService;

@Service
public class LoyaltyRewardServiceImpl implements LoyaltyRewardService {

    private final LoyaltyRewardRepository loyaltyRewardRepository;
    private final UserRepository userRepository;
    private final MerchantRepository merchantRepository;
    private final LoyaltyService loyaltyService;

    public LoyaltyRewardServiceImpl(
            LoyaltyRewardRepository loyaltyRewardRepository,
            UserRepository userRepository,
            MerchantRepository merchantRepository,
            LoyaltyService loyaltyService
    ) {
        this.loyaltyRewardRepository = loyaltyRewardRepository;
        this.userRepository = userRepository;
        this.merchantRepository = merchantRepository;
        this.loyaltyService = loyaltyService;
    }

    // =========================================================
    // CREER UN BON
    // =========================================================

    @Override
    @Transactional
    public LoyaltyReward createReward(
            User client,
            Integer pointsUsed,
            BigDecimal rewardAmount
    ) {
        if (client == null) throw new IllegalArgumentException("Client obligatoire");
        if (pointsUsed == null || pointsUsed <= 0) throw new IllegalArgumentException("Points > 0");
        if (rewardAmount == null || rewardAmount.compareTo(BigDecimal.ZERO) <= 0) throw new IllegalArgumentException("Montant > 0");

        boolean success = loyaltyService.spendPoints(client, null, pointsUsed, "Conversion points -> bon");
        if (!success) throw new IllegalStateException("Points insuffisants");

        LoyaltyReward reward = new LoyaltyReward();
        reward.setClient(client);
        reward.setPointsUsed(pointsUsed);
        reward.setRewardAmount(rewardAmount);
        reward.setStatus(LoyaltyRewardStatus.AVAILABLE);
        reward.setCode(generateUniqueCode());
        
        // ✅ MODIFICATION : Expiration après 2 mois
        reward.setExpiresAt(LocalDateTime.now().plusMonths(2));
        
        return loyaltyRewardRepository.save(reward);
    }

    // =========================================================
    // TOUS LES BONS DU CLIENT (Nettoyage des expirés)
    // =========================================================

    @Override
    @Transactional // readOnly=false pour permettre la suppression
    public List<LoyaltyReward> getClientRewards(String clientEmail) {
        User client = userRepository.findByEmail(clientEmail)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        List<LoyaltyReward> rewards = loyaltyRewardRepository.findByClientOrderByCreatedAtDesc(client);
        if (rewards == null) return new ArrayList<>();

        // ✅ SUPPRESSION DES BONS EXPIRÉS
        LocalDateTime now = LocalDateTime.now();
        rewards.removeIf(reward -> {
            if (reward.getExpiresAt() != null 
                    && reward.getExpiresAt().isBefore(now) 
                    && reward.getStatus() == LoyaltyRewardStatus.AVAILABLE) {
                loyaltyRewardRepository.delete(reward);
                return true;
            }
            return false;
        });

        return rewards;
    }

    // =========================================================
    // BONS DISPONIBLES (Nettoyage des expirés)
    // =========================================================

    @Override
    @Transactional // readOnly=false pour permettre la suppression
    public List<LoyaltyReward> getAvailableRewards(String clientEmail) {
        User client = userRepository.findByEmail(clientEmail)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        List<LoyaltyReward> rewards = loyaltyRewardRepository.findByClientAndStatus(
                client, LoyaltyRewardStatus.AVAILABLE
        );

        if (rewards == null) return new ArrayList<>();

        // ✅ SUPPRESSION DES BONS EXPIRÉS
        LocalDateTime now = LocalDateTime.now();
        rewards.removeIf(reward -> {
            if (reward.getExpiresAt() != null && reward.getExpiresAt().isBefore(now)) {
                loyaltyRewardRepository.delete(reward);
                return true;
            }
            return false;
        });

        return rewards;
    }

    // =========================================================
    // RECHERCHER UN BON
    // =========================================================

    @Override
    @Transactional // readOnly=false pour permettre la suppression si expiré
    public LoyaltyReward getByCode(String code) {
        if (code == null || code.isBlank()) throw new IllegalArgumentException("Code obligatoire");

        LoyaltyReward reward = loyaltyRewardRepository.findByCodeIgnoreCase(code.trim())
                .orElseThrow(() -> new RuntimeException("Bon d'achat introuvable"));

        // ✅ SI EXPIRÉ : SUPPRESSION ET ERREUR
        if (reward.getExpiresAt() != null && reward.getExpiresAt().isBefore(LocalDateTime.now())) {
            loyaltyRewardRepository.delete(reward);
            throw new IllegalStateException("Ce bon a expiré et a été retiré.");
        }

        return reward;
    }

    // =========================================================
    // VALIDER UN BON POUR UN CLIENT
    // =========================================================

    @Override
    @Transactional
    public LoyaltyReward validateReward(String code, User client) {
        if (client == null) throw new IllegalArgumentException("Client obligatoire");

        LoyaltyReward reward = getByCode(code);

        if (reward.getClient() == null || !reward.getClient().getId().equals(client.getId())) {
            throw new IllegalStateException("Ce bon n'appartient pas à ce client");
        }

        validateAvailability(reward);
        return reward;
    }

    // =========================================================
    // UTILISER UN BON
    // =========================================================

    @Override
    @Transactional
    public LoyaltyReward useReward(String code, User client) {
        LoyaltyReward reward = validateReward(code, client);
        reward.setStatus(LoyaltyRewardStatus.USED);
        reward.setUsedAt(LocalDateTime.now());
        return loyaltyRewardRepository.save(reward);
    }

    // =========================================================
    // UTILISER UN BON PAR UN COMMERÇANT
    // =========================================================

    @Override
    @Transactional
    public LoyaltyReward useRewardByMerchant(String code, String merchantEmail) {
        if (merchantEmail == null || merchantEmail.isBlank()) throw new IllegalArgumentException("Email commerçant obligatoire");

        LoyaltyReward reward = getByCode(code);
        validateAvailability(reward);

        Merchant merchant = merchantRepository.findByUserEmail(merchantEmail)
                .orElseThrow(() -> new RuntimeException("Commerçant introuvable"));

        reward.setMerchant(merchant);
        reward.setStatus(LoyaltyRewardStatus.USED);
        reward.setUsedAt(LocalDateTime.now());
        return loyaltyRewardRepository.save(reward);
    }

    // =========================================================
    // UTILISER UN BON POUR UNE VENTE
    // =========================================================

    @Override
    @Transactional
    public LoyaltyReward useRewardForSale(String code, User client, Merchant merchant, Sale sale) {
        if (client == null) throw new IllegalArgumentException("Client obligatoire");
        if (merchant == null) throw new IllegalArgumentException("Commerçant obligatoire");
        if (sale == null) throw new IllegalArgumentException("Vente obligatoire");

        LoyaltyReward reward = validateReward(code, client);
        reward.setMerchant(merchant);
        reward.setUsedSale(sale);
        reward.setUsedAt(LocalDateTime.now());
        reward.setStatus(LoyaltyRewardStatus.USED);
        return loyaltyRewardRepository.save(reward);
    }

    // =========================================================
    // VALIDATION DISPONIBILITE
    // =========================================================

    private void validateAvailability(LoyaltyReward reward) {
        if (reward == null) throw new RuntimeException("Bon introuvable");
        if (reward.getStatus() != LoyaltyRewardStatus.AVAILABLE) throw new IllegalStateException("Bon non disponible");

        // ✅ SUPPRESSION AU LIEU DE CHANGEMENT DE STATUT
        if (reward.getExpiresAt() != null && reward.getExpiresAt().isBefore(LocalDateTime.now())) {
            loyaltyRewardRepository.delete(reward);
            throw new IllegalStateException("Ce bon a expiré et a été retiré.");
        }
    }

    // =========================================================
    // CODE UNIQUE
    // =========================================================

    private String generateUniqueCode() {
        String code;
        do {
            code = "ASW-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (loyaltyRewardRepository.existsByCode(code));
        return code;
    }
}