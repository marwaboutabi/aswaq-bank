package com.aswaqbank.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class AddMoneyRequest {

    @NotNull(message = "Le montant est requis")
    @DecimalMin(value = "1", message = "Le montant doit être supérieur à 0")
    private BigDecimal amount;

    public AddMoneyRequest() {
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}