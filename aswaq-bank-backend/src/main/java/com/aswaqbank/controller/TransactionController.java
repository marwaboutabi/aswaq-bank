package com.aswaqbank.controller;

import java.math.BigDecimal;
import java.util.List;
import com.aswaqbank.dto.TransactionResponse;
import com.aswaqbank.dto.ReceivedTransactionResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.aswaqbank.dto.QrPaymentRequest;
import com.aswaqbank.entity.BankAccount;
import com.aswaqbank.entity.Transaction;
import com.aswaqbank.repository.BankAccountRepository;
import com.aswaqbank.service.TransactionService;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    private final TransactionService transactionService;
    private final BankAccountRepository bankAccountRepository;

    public TransactionController(TransactionService transactionService,
                                 BankAccountRepository bankAccountRepository) {
        this.transactionService = transactionService;
        this.bankAccountRepository = bankAccountRepository;
    }

    @PostMapping("/deposit")
    public Transaction deposit(
            @RequestParam String accountNumber,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false) String description) {

        return transactionService.deposit(
                accountNumber,
                amount,
                description
        );
    }

    @PostMapping("/withdraw")
    public Transaction withdraw(@RequestBody WithdrawRequest request) {

        return transactionService.withdraw(
                request.getAccountNumber(),
                request.getAmount(),
                request.getDescription()
        );
    }

    @PostMapping("/transfer")
    public Transaction transfer(@RequestBody TransferRequest request) {

        return transactionService.transfer(
                request.getSenderAccountNumber(),
                request.getBeneficiaryId(),
                request.getAmount(),
                request.getDescription(),
                request.getPin()
        );
    }
    
    
    @PostMapping("/qr-payment")
    public Transaction qrPayment(
            @RequestBody QrPaymentRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        BankAccount sender = bankAccountRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Compte introuvable"
                        )
                );

        /*
         * ============================================
         * QR PAYMENT CLASSIQUE
         * ============================================
         *
         * Si aucun saleId n'est fourni,
         * on garde exactement le comportement actuel.
         */
        if (request.getSaleId() == null) {

            return transactionService.qrPayment(
                    sender.getAccountNumber(),
                    request.getReceiverRib(),
                    request.getAmount(),
                    request.getDescription()
            );
        }

        /*
         * ============================================
         * QR PAYMENT LIÉ À UNE VENTE
         * ============================================
         *
         * Avec ou sans bon d'achat.
         */
        return transactionService.qrPayment(
                sender.getAccountNumber(),
                request.getReceiverRib(),
                request.getAmount(),
                request.getDescription(),
                request.getSaleId(),
                request.getVoucherCode()
        );
    }
 // ==========================
 // Transactions reçues
 // ==========================
 @GetMapping("/received")
 public List<ReceivedTransactionResponse> getReceivedTransactions(
         Authentication authentication) {

     String email = authentication.getName();

     BankAccount compte = bankAccountRepository
             .findByUserEmail(email)
             .orElseThrow(() ->
                     new RuntimeException("Compte introuvable"));

     return transactionService.getReceivedTransactions(
             compte.getUser().getId()
     );
 }
    @GetMapping("/{accountNumber}")
    public List<Transaction> getAccountTransactions(
            @PathVariable String accountNumber,
            Authentication authentication) {

        String email = authentication.getName();

        BankAccount compteConnecte = bankAccountRepository
                .findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        if (!compteConnecte.getAccountNumber().equals(accountNumber)) {
            throw new AccessDeniedException("Vous n'avez pas accès à ce compte");
        }

        return transactionService.getAccountTransactions(accountNumber);
    }

    // ==========================
    // NOUVEAU : Mes transactions
    // ==========================
    @GetMapping("/my")
    public List<TransactionResponse> getMyTransactions(Authentication authentication) {

        String email = authentication.getName();

        BankAccount compte = bankAccountRepository
                .findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        return transactionService.getAccountTransactionsForUser(
                compte.getAccountNumber()
        );
    }

    // ===== DTOs internes =====

    public static class WithdrawRequest {

        private String accountNumber;
        private BigDecimal amount;
        private String description;

        public String getAccountNumber() {
            return accountNumber;
        }

        public void setAccountNumber(String accountNumber) {
            this.accountNumber = accountNumber;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    public static class TransferRequest {

        private String senderAccountNumber;
        private Long beneficiaryId;
        private BigDecimal amount;
        private String description;
        private String pin;

        public String getSenderAccountNumber() {
            return senderAccountNumber;
        }

        public void setSenderAccountNumber(String senderAccountNumber) {
            this.senderAccountNumber = senderAccountNumber;
        }

        public Long getBeneficiaryId() {
            return beneficiaryId;
        }

        public void setBeneficiaryId(Long beneficiaryId) {
            this.beneficiaryId = beneficiaryId;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
        public String getPin() {
            return pin;
        }
        public void setPin(String pin) {
            this.pin = pin;
        }
        
    }
}