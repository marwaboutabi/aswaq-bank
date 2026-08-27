package com.aswaqbank.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SavingsGoalResponse {

    private Long id;
    private String name;
    private BigDecimal currentAmount;
    private BigDecimal targetAmount;
    private LocalDate deadline;
    private int percent;              // 0-100, pour la barre de progression
    private BigDecimal remaining;     // target - current
    private BigDecimal monthlyAdvice; // montant mensuel conseillé pour tenir le délai
    private boolean onTrack;          // true si le rythme d'épargne actuel suffit
    private boolean completed;

    public SavingsGoalResponse() {
    }

    public SavingsGoalResponse(Long id, String name, BigDecimal currentAmount, BigDecimal targetAmount,
                                LocalDate deadline, int percent, BigDecimal remaining, BigDecimal monthlyAdvice,
                                boolean onTrack, boolean completed) {
        this.id = id;
        this.name = name;
        this.currentAmount = currentAmount;
        this.targetAmount = targetAmount;
        this.deadline = deadline;
        this.percent = percent;
        this.remaining = remaining;
        this.monthlyAdvice = monthlyAdvice;
        this.onTrack = onTrack;
        this.completed = completed;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getCurrentAmount() {
        return currentAmount;
    }

    public void setCurrentAmount(BigDecimal currentAmount) {
        this.currentAmount = currentAmount;
    }

    public BigDecimal getTargetAmount() {
        return targetAmount;
    }

    public void setTargetAmount(BigDecimal targetAmount) {
        this.targetAmount = targetAmount;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public int getPercent() {
        return percent;
    }

    public void setPercent(int percent) {
        this.percent = percent;
    }

    public BigDecimal getRemaining() {
        return remaining;
    }

    public void setRemaining(BigDecimal remaining) {
        this.remaining = remaining;
    }

    public BigDecimal getMonthlyAdvice() {
        return monthlyAdvice;
    }

    public void setMonthlyAdvice(BigDecimal monthlyAdvice) {
        this.monthlyAdvice = monthlyAdvice;
    }

    public boolean isOnTrack() {
        return onTrack;
    }

    public void setOnTrack(boolean onTrack) {
        this.onTrack = onTrack;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}