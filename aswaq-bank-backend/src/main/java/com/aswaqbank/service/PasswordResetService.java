package com.aswaqbank.service;

import com.aswaqbank.dto.VerifyResetOtpResponse;

public interface PasswordResetService {
    void requestReset(String email);
    VerifyResetOtpResponse verifyOtp(String email, String otp);
    void resetPassword(String resetToken, String newPassword);
}