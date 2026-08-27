package com.aswaqbank.dto;

public class VerifyResetOtpResponse {
    private String resetToken;
    public VerifyResetOtpResponse(String resetToken) { this.resetToken = resetToken; }
    public String getResetToken() { return resetToken; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }
}