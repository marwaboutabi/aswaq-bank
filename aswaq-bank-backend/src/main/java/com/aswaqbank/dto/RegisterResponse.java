package com.aswaqbank.dto;

public class RegisterResponse {

    private Long userId;
    private String generatedCardPin;

    public RegisterResponse() {
    }

    public RegisterResponse(Long userId, String generatedCardPin) {
        this.userId = userId;
        this.generatedCardPin = generatedCardPin;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getGeneratedCardPin() {
        return generatedCardPin;
    }

    public void setGeneratedCardPin(String generatedCardPin) {
        this.generatedCardPin = generatedCardPin;
    }
}