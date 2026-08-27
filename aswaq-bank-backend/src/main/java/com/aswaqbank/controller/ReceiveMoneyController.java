package com.aswaqbank.controller;
import com.aswaqbank.dto.ReceiveMoneyResponse;
import com.aswaqbank.entity.BankAccount;
import com.aswaqbank.repository.BankAccountRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/receive-money")
@CrossOrigin(origins = "http://localhost:3000")
public class ReceiveMoneyController {
    private final BankAccountRepository bankAccountRepository;

    public ReceiveMoneyController(BankAccountRepository bankAccountRepository) {
        this.bankAccountRepository = bankAccountRepository;
    }

    // Utilisé par ReceiveMoney.jsx : renvoie les infos du compte CONNECTÉ
    @GetMapping("/info")
    public ReceiveMoneyResponse getReceiveInfo(Authentication authentication) {
        String email = authentication.getName();
        BankAccount account = bankAccountRepository
                .findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Compte bancaire introuvable"));

        return new ReceiveMoneyResponse(
                account.getUser().getPrenom() + " " + account.getUser().getNom(),
                account.getRib(),
                account.getAccountNumber()
        );
    }

    // Utilisé par PayQRCode.jsx : renvoie les infos du compte correspondant au RIB scanné
    @GetMapping("/lookup")
    public ReceiveMoneyResponse lookupByRib(@RequestParam String rib) {
        BankAccount account = bankAccountRepository
                .findByRib(rib)
                .orElseThrow(() -> new RuntimeException("Compte bénéficiaire introuvable"));

        return new ReceiveMoneyResponse(
                account.getUser().getPrenom() + " " + account.getUser().getNom(),
                account.getRib(),
                account.getAccountNumber()
        );
    }
}