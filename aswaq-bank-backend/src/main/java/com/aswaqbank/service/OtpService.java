package com.aswaqbank.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final long EXPIRY_MILLIS = 5 * 60 * 1000;

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    public OtpService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void generateAndSendOtp(String email) {
        String code = String.format("%06d", new SecureRandom().nextInt(1_000_000));
        otpStore.put(email, new OtpEntry(code, Instant.now().plusMillis(EXPIRY_MILLIS)));

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("Votre code de vérification Aswaq Bank");
        message.setText("Votre code de vérification est : " + code + "\nCe code expire dans 5 minutes.");
        mailSender.send(message);
    }

    public boolean verifyOtp(String email, String code) {
        OtpEntry entry = otpStore.get(email);
        if (entry == null) {
            return false;
        }
        if (Instant.now().isAfter(entry.expiry)) {
            otpStore.remove(email);
            return false;
        }
        boolean valid = entry.code.equals(code);
        if (valid) {
            otpStore.remove(email);
        }
        return valid;
    }

    private static class OtpEntry {
        final String code;
        final Instant expiry;

        OtpEntry(String code, Instant expiry) {
            this.code = code;
            this.expiry = expiry;
        }
    }
}