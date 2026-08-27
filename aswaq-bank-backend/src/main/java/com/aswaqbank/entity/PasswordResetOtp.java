package com.aswaqbank.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_otp")
public class PasswordResetOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(name = "otp_code", nullable = false)
    private String otpCode;

    @Column(name = "otp_expiry_date", nullable = false)
    private LocalDateTime otpExpiryDate;

    @Column(name = "otp_used", nullable = false)
    private boolean otpUsed = false;

    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_expiry_date")
    private LocalDateTime resetTokenExpiryDate;

    @Column(name = "reset_token_used", nullable = false)
    private boolean resetTokenUsed = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public PasswordResetOtp() {}

    // Getters / setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }

    public LocalDateTime getOtpExpiryDate() { return otpExpiryDate; }
    public void setOtpExpiryDate(LocalDateTime otpExpiryDate) { this.otpExpiryDate = otpExpiryDate; }

    public boolean isOtpUsed() { return otpUsed; }
    public void setOtpUsed(boolean otpUsed) { this.otpUsed = otpUsed; }

    public String getResetToken() { return resetToken; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }

    public LocalDateTime getResetTokenExpiryDate() { return resetTokenExpiryDate; }
    public void setResetTokenExpiryDate(LocalDateTime resetTokenExpiryDate) { this.resetTokenExpiryDate = resetTokenExpiryDate; }

    public boolean isResetTokenUsed() { return resetTokenUsed; }
    public void setResetTokenUsed(boolean resetTokenUsed) { this.resetTokenUsed = resetTokenUsed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}