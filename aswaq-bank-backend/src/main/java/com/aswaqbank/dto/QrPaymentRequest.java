package com.aswaqbank.dto;

import java.math.BigDecimal;

public class QrPaymentRequest {

    private String receiverRib;

    private BigDecimal amount;

    private String description;

    /**
     * Vente concernée.
     *
     * null = paiement QR classique.
     */
    private Long saleId;

    /**
     * Code du bon d'achat.
     *
     * null = aucun bon utilisé.
     */
    private String voucherCode;

    public QrPaymentRequest() {
    }

    public String getReceiverRib() {
        return receiverRib;
    }

    public void setReceiverRib(String receiverRib) {
        this.receiverRib = receiverRib;
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

    public Long getSaleId() {
        return saleId;
    }

    public void setSaleId(Long saleId) {
        this.saleId = saleId;
    }

    public String getVoucherCode() {
        return voucherCode;
    }

    public void setVoucherCode(String voucherCode) {
        this.voucherCode = voucherCode;
    }
}