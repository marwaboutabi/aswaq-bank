package com.aswaqbank.repository;

import com.aswaqbank.entity.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {

    Optional<PasswordResetOtp> findTopByEmailOrderByCreatedAtDesc(String email);

    Optional<PasswordResetOtp> findByResetTokenAndResetTokenUsedFalse(String resetToken);
}