package com.aswaqbank.service;

import com.aswaqbank.entity.PaymentRequest;
import com.aswaqbank.entity.Sale;
import com.aswaqbank.entity.Transaction;

import java.math.BigDecimal;
import java.util.List;

public interface PaymentRequestService {

    // =========================================================
    // CREER UNE DEMANDE GENERIQUE
    // =========================================================

    PaymentRequest createPaymentRequest(
            String merchantEmail,
            BigDecimal amount,
            String description
    );

    // =========================================================
    // CREER UNE DEMANDE POUR UNE VENTE
    // =========================================================

    PaymentRequest createPaymentRequestForSale(
            String merchantEmail,
            Sale sale
    );

    // =========================================================
    // DEMANDES DU COMMERÇANT
    // =========================================================

    List<PaymentRequest> getMerchantRequests(
            String merchantEmail
    );

    // =========================================================
    // CHERCHER PAR REFERENCE
    // =========================================================

    PaymentRequest getByReference(
            String reference
    );

    // =========================================================
    // PAYER UNE DEMANDE QR
    // =========================================================

    /*
     * Ancienne version conservée pour ne pas casser
     * les éventuels appels existants.
     *
     * Aucun bon n'est utilisé.
     */
    Transaction payPaymentRequest(
            String reference,
            String clientAccountNumber
    );

    /*
     * Nouvelle version :
     * le client peut choisir un bon au moment du paiement.
     *
     * voucherCode peut être null si le client
     * ne souhaite pas utiliser de bon.
     */
    Transaction payPaymentRequest(
            String reference,
            String clientAccountNumber,
            String voucherCode
    );

    // =========================================================
    // REGENERER QR POUR UNE VENTE
    // =========================================================

    PaymentRequest regenerateForSale(
            String merchantEmail,
            Long saleId
    );
}