package com.aswaqbank.dto;

import java.math.BigDecimal;

public class SaleCreationResponse {

    private Long saleId;
    private String paymentRequestReference;
    private BigDecimal totalAmount;

    public SaleCreationResponse() {
    }

    public SaleCreationResponse(
            Long saleId,
            String paymentRequestReference,
            BigDecimal totalAmount
    ) {
        this.saleId = saleId;
        this.paymentRequestReference = paymentRequestReference;
        this.totalAmount = totalAmount;
    }

    public Long getSaleId() {
        return saleId;
    }

    public void setSaleId(Long saleId) {
        this.saleId = saleId;
    }

    public String getPaymentRequestReference() {
        return paymentRequestReference;
    }

    public void setPaymentRequestReference(String paymentRequestReference) {
        this.paymentRequestReference = paymentRequestReference;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}