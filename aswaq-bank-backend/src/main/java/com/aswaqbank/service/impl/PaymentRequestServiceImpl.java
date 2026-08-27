package com.aswaqbank.service.impl;

import com.aswaqbank.entity.BankAccount;
import com.aswaqbank.entity.LoyaltyReward;
import com.aswaqbank.entity.PaymentRequest;
import com.aswaqbank.entity.PaymentRequestStatus;
import com.aswaqbank.entity.Sale;
import com.aswaqbank.entity.SaleStatus;
import com.aswaqbank.entity.Transaction;
import com.aswaqbank.repository.BankAccountRepository;
import com.aswaqbank.repository.PaymentRequestRepository;
import com.aswaqbank.repository.SaleRepository;
import com.aswaqbank.service.LoyaltyRewardService;
import com.aswaqbank.service.PaymentRequestService;
import com.aswaqbank.service.TransactionService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentRequestServiceImpl implements PaymentRequestService {

    private final PaymentRequestRepository paymentRequestRepository;
    private final BankAccountRepository bankAccountRepository;
    private final TransactionService transactionService;
    private final SaleRepository saleRepository;
    private final LoyaltyRewardService loyaltyRewardService;

    public PaymentRequestServiceImpl(
            PaymentRequestRepository paymentRequestRepository,
            BankAccountRepository bankAccountRepository,
            TransactionService transactionService,
            SaleRepository saleRepository,
            LoyaltyRewardService loyaltyRewardService
    ) {
        this.paymentRequestRepository = paymentRequestRepository;
        this.bankAccountRepository = bankAccountRepository;
        this.transactionService = transactionService;
        this.saleRepository = saleRepository;
        this.loyaltyRewardService = loyaltyRewardService;
    }

    // =========================================================
    // CREER UNE DEMANDE GENERIQUE
    // =========================================================

    @Override
    @Transactional
    public PaymentRequest createPaymentRequest(
            String merchantEmail,
            BigDecimal amount,
            String description
    ) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Le montant doit être supérieur à zéro");
        }

        BankAccount merchantAccount = bankAccountRepository
                .findByUserEmail(merchantEmail)
                .orElseThrow(() -> new RuntimeException("Compte commerçant introuvable"));

        PaymentRequest request = new PaymentRequest();
        request.setReference(generatePaymentReference());
        request.setAmount(amount);
        request.setDescription(description);
        request.setMerchantAccount(merchantAccount);
        request.setSale(null);
        request.setCreatedAt(LocalDateTime.now());
        request.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        request.setStatus(PaymentRequestStatus.PENDING);

        return paymentRequestRepository.save(request);
    }

    // =========================================================
    // CREER UNE DEMANDE POUR UNE VENTE
    // =========================================================

    @Override
    @Transactional
    public PaymentRequest createPaymentRequestForSale(
            String merchantEmail,
            Sale sale
    ) {
        if (sale == null) throw new RuntimeException("Vente introuvable");
        if (sale.getId() == null) throw new RuntimeException("La vente doit être enregistrée avant de créer le QR");
        if (sale.getTotalAmount() == null || sale.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Le montant de la vente est invalide");
        }
        if (sale.getStatus() != SaleStatus.PENDING) {
            throw new RuntimeException("La vente n'est pas en attente de paiement");
        }

        BankAccount merchantAccount = bankAccountRepository
                .findByUserEmail(merchantEmail)
                .orElseThrow(() -> new RuntimeException("Compte commerçant introuvable"));

        // Vérifier si un QR PENDING existe déjà pour cette vente
        List<PaymentRequest> existingRequests = paymentRequestRepository
                .findByMerchantAccountOrderByCreatedAtDesc(merchantAccount);

        for (PaymentRequest existing : existingRequests) {
            if (existing.getSale() != null
                    && existing.getSale().getId() != null
                    && existing.getSale().getId().equals(sale.getId())
                    && existing.getStatus() == PaymentRequestStatus.PENDING) {
                return existing;
            }
        }

        PaymentRequest request = new PaymentRequest();
        request.setReference(generatePaymentReference());
        request.setAmount(sale.getTotalAmount()); // Montant ORIGINAL toujours
        request.setDescription("Paiement vente #" + sale.getId());
        request.setMerchantAccount(merchantAccount);
        request.setSale(sale);
        request.setCreatedAt(LocalDateTime.now());
        request.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        request.setStatus(PaymentRequestStatus.PENDING);

        return paymentRequestRepository.save(request);
    }

    // =========================================================
    // DEMANDES DU COMMERÇANT
    // =========================================================

    @Override
    public List<PaymentRequest> getMerchantRequests(String merchantEmail) {
        BankAccount merchantAccount = bankAccountRepository
                .findByUserEmail(merchantEmail)
                .orElseThrow(() -> new RuntimeException("Compte commerçant introuvable"));

        return paymentRequestRepository.findByMerchantAccountOrderByCreatedAtDesc(merchantAccount);
    }

    // =========================================================
    // CHERCHER PAR REFERENCE
    // =========================================================

    @Override
    @Transactional
    public PaymentRequest getByReference(String reference) {
        if (reference == null || reference.isBlank()) {
            throw new IllegalArgumentException("Référence de paiement invalide");
        }

        PaymentRequest request = paymentRequestRepository
                .findByReference(reference)
                .orElseThrow(() -> new RuntimeException("Demande de paiement introuvable"));

        if (request.getStatus() == PaymentRequestStatus.PENDING
                && request.getExpiresAt() != null
                && request.getExpiresAt().isBefore(LocalDateTime.now())) {
            request.setStatus(PaymentRequestStatus.REJECTED);
            paymentRequestRepository.save(request);
        }

        return request;
    }

    // =========================================================
    // PAYER SANS BON
    // =========================================================

    @Override
    @Transactional
    public Transaction payPaymentRequest(String reference, String clientAccountNumber) {
        return payPaymentRequest(reference, clientAccountNumber, null);
    }

    // =========================================================
    // PAYER AVEC OU SANS BON
    // =========================================================

    @Override
    @Transactional
    public Transaction payPaymentRequest(
            String reference,
            String clientAccountNumber,
            String voucherCode
    ) {
        // 1. RECUPERER LA DEMANDE
        PaymentRequest request = paymentRequestRepository
                .findByReference(reference)
                .orElseThrow(() -> new RuntimeException("Demande de paiement introuvable"));

        // 2. VERIFIER STATUT
        if (request.getStatus() != PaymentRequestStatus.PENDING) {
            throw new RuntimeException("Cette demande n'est plus disponible");
        }

        // 3. VERIFIER EXPIRATION
        if (request.getExpiresAt() != null && request.getExpiresAt().isBefore(LocalDateTime.now())) {
            request.setStatus(PaymentRequestStatus.REJECTED);
            paymentRequestRepository.save(request);
            throw new RuntimeException("QR expiré");
        }

        // 4. COMPTE COMMERÇANT
        BankAccount merchantAccount = request.getMerchantAccount();
        if (merchantAccount == null) throw new RuntimeException("Compte commerçant introuvable");

        // 5. COMPTE CLIENT
        BankAccount clientAccount = bankAccountRepository
                .findByAccountNumber(clientAccountNumber)
                .orElseThrow(() -> new RuntimeException("Compte client introuvable"));

        // ⚠️ SÉCURITÉ : Client != Commerçant
        if (clientAccount.getId().equals(merchantAccount.getId())) {
            throw new RuntimeException("Le client ne peut pas payer son propre compte");
        }

        Transaction transaction;
        Sale sale = request.getSale();

        if (sale != null) {
            // --- PAIEMENT LIÉ À UNE VENTE ---
            
            if (sale.getId() == null) throw new RuntimeException("Vente associée invalide");

            // Recharger la vente fraîche
            sale = saleRepository.findById(sale.getId())
                    .orElseThrow(() -> new RuntimeException("Vente associée introuvable"));

            if (sale.getStatus() != SaleStatus.PENDING) {
                throw new RuntimeException("Cette vente n'est plus en attente de paiement");
            }

            // Calculer le montant après bon
            BigDecimal amountToPay = calculateAmountToPay(sale, voucherCode, clientAccount);

            // Appeler TransactionService qui gère TOUT :
            // - Débit client
            // - Crédit commerçant (total)
            // - Usage du bon
            // - Mise à jour stock
            // - Sale.status = PAID
            transaction = transactionService.qrPayment(
                    clientAccountNumber,
                    merchantAccount.getRib(),
                    amountToPay,
                    request.getDescription(),
                    sale.getId(),
                    voucherCode
            );

            // Vérification post-paiement
            Sale updatedSale = saleRepository.findById(sale.getId())
                    .orElseThrow(() -> new RuntimeException("Vente introuvable après paiement"));

            if (updatedSale.getStatus() != SaleStatus.PAID) {
                throw new RuntimeException("Le paiement a été effectué mais la vente n'a pas été finalisée");
            }

        } else {
            // --- QR GÉNÉRIQUE (PAS DE VENTE) ---
            
            if (voucherCode != null && !voucherCode.isBlank()) {
                throw new RuntimeException("Un bon de fidélité ne peut être utilisé que pour une vente");
            }

            transaction = transactionService.qrPayment(
                    clientAccountNumber,
                    merchantAccount.getRib(),
                    request.getAmount(),
                    request.getDescription()
            );
        }

        // 7. FINALISER PAYMENT REQUEST
        request.setCustomerAccount(clientAccount);
        request.setStatus(PaymentRequestStatus.COMPLETED);
        paymentRequestRepository.save(request);

        return transaction;
    }

    // =========================================================
    // CALCUL DU MONTANT A PAYER
    // =========================================================

    private BigDecimal calculateAmountToPay(
            Sale sale,
            String voucherCode,
            BankAccount clientAccount
    ) {
        if (voucherCode == null || voucherCode.isBlank()) {
            return sale.getTotalAmount();
        }

        // Valider le bon
        LoyaltyReward reward = loyaltyRewardService.validateReward(
                voucherCode, clientAccount.getUser()
        );

        if (reward == null) throw new RuntimeException("Bon de fidélité introuvable");
        if (reward.getRewardAmount() == null || reward.getRewardAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Montant du bon invalide");
        }

        BigDecimal voucherAmount = reward.getRewardAmount().min(sale.getTotalAmount());
        BigDecimal amountToPay = sale.getTotalAmount().subtract(voucherAmount);

        // ✅ CORRECTION : On autorise amountToPay == 0 (bon couvre 100%)
        if (amountToPay.compareTo(BigDecimal.ZERO) < 0) {
            amountToPay = BigDecimal.ZERO;
        }

        return amountToPay;
    }

    // =========================================================
    // REGENERER QR POUR UNE VENTE
    // =========================================================

    @Override
    @Transactional
    public PaymentRequest regenerateForSale(String merchantEmail, Long saleId) {
        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Vente introuvable"));

        if (sale.getStatus() != SaleStatus.PENDING) {
            throw new RuntimeException("Cette vente n'est plus en attente de paiement");
        }

        // ⚠️ SÉCURITÉ : Vérifier que le commerçant est propriétaire de la vente
        BankAccount merchantAccount = bankAccountRepository
                .findByUserEmail(merchantEmail)
                .orElseThrow(() -> new RuntimeException("Compte commerçant introuvable"));

        if (sale.getMerchant() == null
                || sale.getMerchant().getId() == null
                || merchantAccount.getUser() == null
                || merchantAccount.getUser().getMerchant() == null
                || !sale.getMerchant().getId().equals(merchantAccount.getUser().getMerchant().getId())) {
            throw new RuntimeException("Cette vente n'appartient pas à ce commerçant");
        }

        return createPaymentRequestForSale(merchantEmail, sale);
    }

    // =========================================================
    // GENERER REFERENCE
    // =========================================================

    private String generatePaymentReference() {
        return "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}