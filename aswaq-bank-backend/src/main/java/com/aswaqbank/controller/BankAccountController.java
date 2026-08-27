package com.aswaqbank.controller;

import com.aswaqbank.entity.BankAccount;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.BankAccountRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:3000")
public class BankAccountController {

    private final BankAccountRepository bankAccountRepository;

    public BankAccountController(BankAccountRepository bankAccountRepository) {
        this.bankAccountRepository = bankAccountRepository;
    }

    @GetMapping("/me")
    public BankAccount getMyAccount(Authentication authentication) {
        String email = authentication.getName(); // vient du JWT décodé par ton JwtAuthenticationFilter

        return bankAccountRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Compte introuvable pour cet utilisateur"));
    }
}