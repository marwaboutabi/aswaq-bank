package com.aswaqbank.dto;

public class UpdateOrderStatusRequest {
    private String status; // EN_PREPARATION, EXPEDIEE, LIVREE, ANNULEE

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}