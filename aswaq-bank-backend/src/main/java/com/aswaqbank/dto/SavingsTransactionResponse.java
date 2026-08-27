package com.aswaqbank.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SavingsTransactionResponse {

    private Long id;
    private LocalDateTime date;
    private BigDecimal amount;
    private String goalName;

    public SavingsTransactionResponse() {
    }

    public SavingsTransactionResponse(Long id, LocalDateTime date, BigDecimal amount, String goalName) {
        this.id = id;
        this.date = date;
        this.amount = amount;
        this.goalName = goalName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getGoalName() {
        return goalName;
    }

    public void setGoalName(String goalName) {
        this.goalName = goalName;
    }
}