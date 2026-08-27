package com.aswaqbank.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
public class PaymentRequestResponse {

    private String reference;
    private BigDecimal amount;
    private String description;
    private String merchantName;
    private String merchantRib;
    private String bank;
    private String status;
    private LocalDateTime expiresAt;

    public PaymentRequestResponse() {
    }

    public PaymentRequestResponse(
            String reference,
            BigDecimal amount,
            String description,
            String merchantName,
            String merchantRib,
            String bank,
            String status
    ) {
        this.reference = reference;
        this.amount = amount;
        this.description = description;
        this.merchantName = merchantName;
        this.merchantRib = merchantRib;
        this.bank = bank;
        this.status = status;
    }

    public String getReference() {
        return reference;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getDescription() {
        return description;
    }

    public String getMerchantName() {
        return merchantName;
    }

    public String getMerchantRib() {
        return merchantRib;
    }

    public String getBank() {
        return bank;
    }

    public String getStatus() {
        return status;
    }
    public void setReference(String reference) {
        this.reference = reference;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setMerchantName(String merchantName) {
        this.merchantName = merchantName;
    }

    public void setMerchantRib(String merchantRib) {
        this.merchantRib = merchantRib;
    }

    public void setBank(String bank) {
        this.bank = bank;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
}