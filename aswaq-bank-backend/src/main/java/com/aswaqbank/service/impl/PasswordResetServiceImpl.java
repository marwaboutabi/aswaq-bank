package com.aswaqbank.service.impl;

import com.aswaqbank.dto.VerifyResetOtpResponse;
import com.aswaqbank.entity.PasswordResetOtp;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.PasswordResetOtpRepository;
import com.aswaqbank.repository.UserRepository;
import com.aswaqbank.service.PasswordResetService;
// TODO: remplace par ton EmailService existant si tu en as un
// import com.aswaqbank.service.EmailService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetServiceImpl implements PasswordResetService {

    private static final int OTP_VALIDITY_MINUTES = 10;
    private static final int TOKEN_VALIDITY_MINUTES = 15;

    private final UserRepository userRepository;
    private final PasswordResetOtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender; // remplace par ton EmailService si tu en as un

    public PasswordResetServiceImpl(UserRepository userRepository,
                                     PasswordResetOtpRepository otpRepository,
                                     PasswordEncoder passwordEncoder,
                                     JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    @Override
    public void requestReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        // Réponse générique côté controller quoi qu'il arrive (anti-énumération)
        if (userOpt.isEmpty()) {
            return;
        }

        String otp = generateOtp();

        PasswordResetOtp entity = new PasswordResetOtp();
        entity.setEmail(email);
        entity.setOtpCode(otp);
        entity.setOtpExpiryDate(LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES));
        otpRepository.save(entity);

        sendOtpEmail(email, otp);
    }

    @Override
    public VerifyResetOtpResponse verifyOtp(String email, String otp) {
        PasswordResetOtp entity = otpRepository.findTopByEmailOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new IllegalArgumentException("Code invalide ou expiré."));

        if (entity.isOtpUsed()) {
            throw new IllegalArgumentException("Code invalide ou expiré.");
        }
        if (entity.getOtpExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Code expiré, veuillez en redemander un.");
        }
        if (!entity.getOtpCode().equals(otp)) {
            throw new IllegalArgumentException("Code invalide.");
        }

        entity.setOtpUsed(true);
        String resetToken = UUID.randomUUID().toString();
        entity.setResetToken(resetToken);
        entity.setResetTokenExpiryDate(LocalDateTime.now().plusMinutes(TOKEN_VALIDITY_MINUTES));
        otpRepository.save(entity);

        return new VerifyResetOtpResponse(resetToken);
    }

    @Override
    public void resetPassword(String resetToken, String newPassword) {
        PasswordResetOtp entity = otpRepository.findByResetTokenAndResetTokenUsedFalse(resetToken)
                .orElseThrow(() -> new IllegalArgumentException("Lien de réinitialisation invalide."));

        if (entity.getResetTokenExpiryDate() == null
                || entity.getResetTokenExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Ce lien a expiré, veuillez recommencer.");
        }

        User user = userRepository.findByEmail(entity.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable."));

        user.setMotDePasse(passwordEncoder.encode(newPassword));
        entity.setResetTokenUsed(true);
        otpRepository.save(entity);
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000); // 6 chiffres
        return String.valueOf(code);
    }

    private void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Aswaq Bank - Code de réinitialisation");
        message.setText("Votre code de vérification est : " + otp
                + "\n\nCe code expire dans " + OTP_VALIDITY_MINUTES + " minutes."
                + "\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet email.");
        mailSender.send(message);
    }
}