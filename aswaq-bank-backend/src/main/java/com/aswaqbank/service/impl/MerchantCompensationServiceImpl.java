package com.aswaqbank.service.impl;

import com.aswaqbank.entity.BankAccount;
import com.aswaqbank.entity.CompensationStatus;
import com.aswaqbank.entity.LoyaltyReward;
import com.aswaqbank.entity.LoyaltyRewardAllocation;
import com.aswaqbank.entity.Merchant;
import com.aswaqbank.entity.MerchantCompensation;
import com.aswaqbank.entity.Transaction;
import com.aswaqbank.entity.TransactionStatus;
import com.aswaqbank.entity.TransactionType;
import com.aswaqbank.repository.BankAccountRepository;
import com.aswaqbank.repository.LoyaltyRewardAllocationRepository;
import com.aswaqbank.repository.LoyaltyRewardRepository;
import com.aswaqbank.repository.MerchantCompensationRepository;
import com.aswaqbank.repository.MerchantRepository;
import com.aswaqbank.repository.TransactionRepository;
import com.aswaqbank.service.MerchantCompensationService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class MerchantCompensationServiceImpl
        implements MerchantCompensationService {

    private final MerchantCompensationRepository
            compensationRepository;

    private final LoyaltyRewardRepository
            loyaltyRewardRepository;

    private final LoyaltyRewardAllocationRepository
            allocationRepository;

    private final MerchantRepository
            merchantRepository;

    private final BankAccountRepository
            bankAccountRepository;

    private final TransactionRepository
            transactionRepository;

    public MerchantCompensationServiceImpl(
            MerchantCompensationRepository compensationRepository,
            LoyaltyRewardRepository loyaltyRewardRepository,
            LoyaltyRewardAllocationRepository allocationRepository,
            MerchantRepository merchantRepository,
            BankAccountRepository bankAccountRepository,
            TransactionRepository transactionRepository
    ) {
        this.compensationRepository =
                compensationRepository;

        this.loyaltyRewardRepository =
                loyaltyRewardRepository;

        this.allocationRepository =
                allocationRepository;

        this.merchantRepository =
                merchantRepository;

        this.bankAccountRepository =
                bankAccountRepository;

        this.transactionRepository =
                transactionRepository;
    }

    // =========================================================
    // CRÉER LES COMPENSATIONS
    // =========================================================

    @Override
    @Transactional
    public List<MerchantCompensation> createCompensationsForReward(
            Long rewardId,
            Long usedMerchantId
    ) {

        LoyaltyReward reward =
                loyaltyRewardRepository
                        .findById(rewardId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bon introuvable"
                                )
                        );

        Merchant usedMerchant =
                merchantRepository
                        .findById(usedMerchantId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Commerçant utilisateur du bon introuvable"
                                )
                        );

        List<LoyaltyRewardAllocation> allocations =
                allocationRepository.findByReward(reward);

        List<MerchantCompensation> compensations =
                new java.util.ArrayList<>();

        for (LoyaltyRewardAllocation allocation : allocations) {

            if (allocation.getMerchant() == null) {
                continue;
            }

            if (allocation.getAmount() == null
                    || allocation.getAmount()
                    .compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            // Vérification des doublons avant création
            boolean alreadyExists =
                    compensationRepository
                            .existsByRewardAndFromMerchantAndToMerchant(
                                    reward,
                                    allocation.getMerchant(),
                                    usedMerchant
                            );

            if (alreadyExists) {
                continue;
            }

            MerchantCompensation compensation =
                    new MerchantCompensation();

            /*
             * Le commerçant à l'origine des points.
             */
            compensation.setFromMerchant(
                    allocation.getMerchant()
            );

            /*
             * Le commerçant chez lequel le bon
             * est utilisé.
             */
            compensation.setToMerchant(
                    usedMerchant
            );

            compensation.setReward(reward);

            compensation.setPoints(
                    allocation.getPoints()
            );

            compensation.setAmount(
                    allocation.getAmount()
            );

            compensation.setStatus(
                    CompensationStatus.PENDING
            );

            compensations.add(
                    compensationRepository.save(compensation)
            );
        }

        return compensations;
    }

    // =========================================================
    // RÉGLER UNE COMPENSATION
    // =========================================================

    @Override
    @Transactional
    public MerchantCompensation settleCompensation(
            Long compensationId
    ) {

        MerchantCompensation compensation =
                compensationRepository
                        .findById(compensationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Compensation introuvable"
                                )
                        );

        /*
         * Empêcher un double paiement.
         */
        if (compensation.getStatus()
                == CompensationStatus.SETTLED) {

            return compensation;
        }

        if (compensation.getStatus()
                != CompensationStatus.PENDING) {

            throw new RuntimeException(
                    "Cette compensation ne peut pas être réglée"
            );
        }

        if (compensation.getFromMerchant() == null
                || compensation.getFromMerchant().getUser() == null) {

            throw new RuntimeException(
                    "Commerçant payeur introuvable"
            );
        }

        if (compensation.getToMerchant() == null
                || compensation.getToMerchant().getUser() == null) {

            throw new RuntimeException(
                    "Commerçant bénéficiaire introuvable"
            );
        }

        BigDecimal amount =
                compensation.getAmount();

        if (amount == null
                || amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Montant de compensation invalide"
            );
        }

        // =====================================================
        // COMPTES DES DEUX COMMERÇANTS
        // =====================================================

        // Compte du payeur (Ahmad)
        BankAccount fromAccount =
                bankAccountRepository
                        .findByUserEmail(
                                compensation
                                        .getFromMerchant()
                                        .getUser()
                                        .getEmail()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Compte bancaire du commerçant payeur introuvable"
                                )
                        );

        // Compte du bénéficiaire (Amira)
        BankAccount toAccount =
                bankAccountRepository
                        .findByUserEmail(
                                compensation
                                        .getToMerchant()
                                        .getUser()
                                        .getEmail()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Compte bancaire du commerçant bénéficiaire introuvable"
                                )
                        );

        // Vérification du solde du payeur
        if (fromAccount.getBalance()
                .compareTo(amount) < 0) {

            throw new RuntimeException(
                    "Solde insuffisant du commerçant payeur"
            );
        }

        // Débit du payeur
        fromAccount.setBalance(
                fromAccount
                        .getBalance()
                        .subtract(amount)
        );

        // Crédit du bénéficiaire
        toAccount.setBalance(
                toAccount
                        .getBalance()
                        .add(amount)
        );

        bankAccountRepository.save(fromAccount);
        bankAccountRepository.save(toAccount);

        // =====================================================
        // TRANSACTION BANCAIRE
        // =====================================================

        Transaction transaction =
                new Transaction();

        transaction.setTransactionReference(
                generateReference()
        );

        transaction.setType(
                TransactionType.TRANSFER
        );

        transaction.setAmount(amount);

        transaction.setDescription(
                "Compensation fidélité - Bon "
                        + compensation
                        .getReward()
                        .getCode()
        );

        transaction.setStatus(
                TransactionStatus.SUCCESS
        );

        transaction.setTransactionDate(
                LocalDateTime.now()
        );

        transaction.setSenderAccount(
                fromAccount
        );

        transaction.setReceiverAccount(
                toAccount
        );

        transactionRepository.save(
                transaction
        );

        // =====================================================
        // FINALISER LA COMPENSATION
        // =====================================================

        compensation.setStatus(
                CompensationStatus.SETTLED
        );

        return compensationRepository.save(
                compensation
        );
    }

    // =========================================================
    // CONSULTATION DES COMPENSATIONS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<MerchantCompensation> getMyCompensations(
            String merchantEmail
    ) {

        Merchant merchant =
                merchantRepository
                        .findByUserEmail(merchantEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Commerçant introuvable"
                                )
                        );

        return compensationRepository
                .findByFromMerchantOrToMerchantOrderByCreatedAtDesc(
                        merchant,
                        merchant
                );
    }

    @Override
    @Transactional(readOnly = true)
    public List<MerchantCompensation> getMyPayableCompensations(
            String merchantEmail
    ) {

        Merchant merchant =
                merchantRepository
                        .findByUserEmail(merchantEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Commerçant introuvable"
                                )
                        );

        return compensationRepository
                .findByFromMerchantOrderByCreatedAtDesc(
                        merchant
                );
    }

    @Override
    @Transactional(readOnly = true)
    public List<MerchantCompensation> getMyReceivableCompensations(
            String merchantEmail
    ) {

        Merchant merchant =
                merchantRepository
                        .findByUserEmail(merchantEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Commerçant introuvable"
                                )
                        );

        return compensationRepository
                .findByToMerchantOrderByCreatedAtDesc(
                        merchant
                );
    }

    // =========================================================
    // RÉFÉRENCE
    // =========================================================

    private String generateReference() {

        return "LOY-"
                + LocalDateTime.now().getYear()
                + "-"
                + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();
    }
}