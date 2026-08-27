package com.aswaqbank.controller;

import com.aswaqbank.dto.PaymentRequestResponse;
import com.aswaqbank.dto.TransactionResponse;
import com.aswaqbank.entity.BankAccount;
import com.aswaqbank.entity.PaymentRequest;
import com.aswaqbank.entity.Transaction;
import com.aswaqbank.repository.BankAccountRepository;
import com.aswaqbank.service.PaymentRequestService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment-requests")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentRequestController {

    private final PaymentRequestService paymentRequestService;
    private final BankAccountRepository bankAccountRepository;

    public PaymentRequestController(
            PaymentRequestService paymentRequestService,
            BankAccountRepository bankAccountRepository
    ) {
        this.paymentRequestService = paymentRequestService;
        this.bankAccountRepository = bankAccountRepository;
    }

    // =========================================================
    // QR GENERIQUE
    // =========================================================

    @PostMapping("/create")
    public PaymentRequest createPaymentRequest(
            Authentication authentication,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false) String description
    ) {
        String merchantEmail = authentication.getName();
        return paymentRequestService.createPaymentRequest(merchantEmail, amount, description);
    }

    // =========================================================
    // QR DU COMMERÇANT
    // =========================================================

    @GetMapping("/merchant")
    public List<PaymentRequest> getMerchantRequests(Authentication authentication) {
        String merchantEmail = authentication.getName();
        return paymentRequestService.getMerchantRequests(merchantEmail);
    }

    // =========================================================
    // RECHERCHE QR
    // =========================================================

    @GetMapping("/{reference}")
    public PaymentRequestResponse getByReference(@PathVariable String reference) {
        PaymentRequest request = paymentRequestService.getByReference(reference);
        BankAccount merchant = request.getMerchantAccount();

        PaymentRequestResponse response = new PaymentRequestResponse();
        response.setReference(request.getReference());
        response.setAmount(request.getAmount());
        response.setDescription(request.getDescription());
        response.setExpiresAt(request.getExpiresAt());
        response.setStatus(request.getStatus().name());
        response.setBank("Aswaq Bank");

        if (merchant != null && merchant.getUser() != null) {
            response.setMerchantName(
                    merchant.getUser().getPrenom() + " " + merchant.getUser().getNom()
            );
            response.setMerchantRib(merchant.getRib());
        }

        return response;
    }

    // =========================================================
    // PAYER UNE DEMANDE (CORRECTION SERIALIZATION 500)
    // =========================================================

    @PostMapping("/pay/{reference}")
    public TransactionResponse payPaymentRequest(
            @PathVariable String reference,
            @RequestBody(required = false) Map<String, String> body,
            Authentication authentication
    ) {
        String clientEmail = authentication.getName();

        BankAccount clientAccount = bankAccountRepository
                .findByUserEmail(clientEmail)
                .orElseThrow(() -> new RuntimeException("Compte client introuvable"));

        // Extraction sécurisée du voucherCode depuis le body JSON
        String voucherCode = null;
        if (body != null && body.containsKey("voucherCode")) {
            voucherCode = body.get("voucherCode");
        }

        // Le service effectue le paiement en BDD
        Transaction transaction = paymentRequestService.payPaymentRequest(
                reference,
                clientAccount.getAccountNumber(),
                voucherCode
        );

        // =====================================================
        // CONSTRUCTION DE LA REPONSE DTO (EVITE LE 500)
        // =====================================================
        TransactionResponse response = new TransactionResponse();
        response.setId(transaction.getId());
        response.setTransactionReference(transaction.getTransactionReference());
        response.setType(transaction.getType() != null ? transaction.getType().name() : null);
        response.setAmount(transaction.getAmount());
        response.setDescription(transaction.getDescription());
        response.setStatus(transaction.getStatus() != null ? transaction.getStatus().name() : null);
        response.setTransactionDate(transaction.getTransactionDate());
        response.setIncoming(false); // C'est un paiement sortant pour le client

        if (transaction.getReceiverAccount() != null) {
            response.setOtherAccountNumber(transaction.getReceiverAccount().getAccountNumber());

            if (transaction.getReceiverAccount().getUser() != null) {
                response.setOtherUserName(
                        transaction.getReceiverAccount().getUser().getPrenom() + " " +
                        transaction.getReceiverAccount().getUser().getNom()
                );
            }
        }

        return response;
    }

    // =========================================================
    // REGENERER QR D'UNE VENTE
    // =========================================================

    @PostMapping("/regenerate-for-sale/{saleId}")
    public PaymentRequest regenerateForSale(
            @PathVariable Long saleId,
            Authentication authentication
    ) {
        String merchantEmail = authentication.getName();
        return paymentRequestService.regenerateForSale(merchantEmail, saleId);
    }
}