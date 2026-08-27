package com.aswaqbank.service;

import java.math.BigDecimal;
import java.util.List;

import com.aswaqbank.dto.ReceivedTransactionResponse;
import com.aswaqbank.dto.TransactionResponse;
import com.aswaqbank.entity.Transaction;

public interface TransactionService {

    /**
     * Dépôt sur un compte
     */
    Transaction deposit(
            String accountNumber,
            BigDecimal amount,
            String description
    );

    /**
     * Retrait depuis un compte
     */
    Transaction withdraw(
            String accountNumber,
            BigDecimal amount,
            String description
    );

    /**
     * Virement vers un bénéficiaire
     */
    Transaction transfer(
            String senderAccountNumber,
            Long beneficiaryId,
            BigDecimal amount,
            String description,
            String pin
    );

    /**
     * Paiement classique via QR Code.
     *
     * Cette méthode reste inchangée.
     */
    Transaction qrPayment(
            String senderAccountNumber,
            String receiverRib,
            BigDecimal amount,
            String description
    );

    /**
     * Paiement QR lié à une vente.
     *
     * Sans bon d'achat.
     */
    Transaction qrPayment(
            String senderAccountNumber,
            String receiverRib,
            BigDecimal amount,
            String description,
            Long saleId
    );

    /**
     * Paiement QR lié à une vente
     * avec utilisation éventuelle d'un bon d'achat.
     *
     * voucherCode peut être null.
     */
    Transaction qrPayment(
            String senderAccountNumber,
            String receiverRib,
            BigDecimal amount,
            String description,
            Long saleId,
            String voucherCode
    );

    /**
     * Historique brut d'un compte
     */
    List<Transaction> getAccountTransactions(
            String accountNumber
    );

    /**
     * Historique formaté pour le frontend
     */
    List<TransactionResponse> getAccountTransactionsForUser(
            String accountNumber
    );

    /**
     * Transactions reçues
     */
    List<ReceivedTransactionResponse> getReceivedTransactions(
            Long userId
    );
}