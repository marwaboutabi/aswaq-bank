package com.aswaqbank.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ReceivedTransactionResponse {

    private Long id;
    private String senderName;
    private String reference;
    private BigDecimal amount;
    private LocalDateTime date;
    private String status;
    private String description;


    public ReceivedTransactionResponse(
            Long id,
            String senderName,
            String reference,
            BigDecimal amount,
            LocalDateTime date,
            String status,
            String description
    ) {
        this.id = id;
        this.senderName = senderName;
        this.reference = reference;
        this.amount = amount;
        this.date = date;
        this.status = status;
        this.description = description;
    }


    public Long getId() {
        return id;
    }

    public String getSenderName() {
        return senderName;
    }

    public String getReference() {
        return reference;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public String getStatus() {
        return status;
    }

    public String getDescription() {
        return description;
    }
}