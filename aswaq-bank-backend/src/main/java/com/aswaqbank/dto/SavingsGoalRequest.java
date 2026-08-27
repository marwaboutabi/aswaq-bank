package com.aswaqbank.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class SavingsGoalRequest {

    @NotBlank(message = "Le nom de l'objectif est requis")
    private String name;

    @NotNull(message = "Le montant cible est requis")
    @DecimalMin(value = "1", message = "Le montant cible doit être supérieur à 0")
    private BigDecimal targetAmount;

    // Optionnelle
    private LocalDate deadline;

    public SavingsGoalRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
}