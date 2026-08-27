package com.aswaqbank.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.aswaqbank.entity.LoyaltyReward;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.UserRepository;
import com.aswaqbank.service.LoyaltyRewardService;

@RestController
@RequestMapping("/api/loyalty/rewards")
@CrossOrigin(origins = "http://localhost:3000")
public class LoyaltyRewardController {

    private final LoyaltyRewardService loyaltyRewardService;
    private final UserRepository userRepository;

    public LoyaltyRewardController(
            LoyaltyRewardService loyaltyRewardService,
            UserRepository userRepository
    ) {
        this.loyaltyRewardService = loyaltyRewardService;
        this.userRepository = userRepository;
    }

    // =========================================================
    // 1. MES BONS
    // GET /api/loyalty/rewards/my
    // =========================================================

    @GetMapping("/my")
    public ResponseEntity<List<LoyaltyReward>> getMyRewards(
            Authentication authentication
    ) {
        String email = authentication.getName();

        return ResponseEntity.ok(
                loyaltyRewardService.getClientRewards(email)
        );
    }

    // =========================================================
    // 2. MES BONS DISPONIBLES
    // GET /api/loyalty/rewards/available
    // =========================================================

    @GetMapping("/available")
    public ResponseEntity<List<LoyaltyReward>> getAvailableRewards(
            Authentication authentication
    ) {
        String email = authentication.getName();

        return ResponseEntity.ok(
                loyaltyRewardService.getAvailableRewards(email)
        );
    }

    // =========================================================
    // 3. RECHERCHER UN BON PAR CODE
    // GET /api/loyalty/rewards/code/{code}
    // =========================================================

    @GetMapping("/code/{code}")
    public ResponseEntity<LoyaltyReward> getByCode(
            @PathVariable String code
    ) {
        return ResponseEntity.ok(
                loyaltyRewardService.getByCode(code)
        );
    }

    // =========================================================
    // 4. VALIDER MON BON
    // POST /api/loyalty/rewards/validate/{code}
    // =========================================================

    @PostMapping("/validate/{code}")
    public ResponseEntity<LoyaltyReward> validateReward(
            @PathVariable String code,
            Authentication authentication
    ) {
        User client = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                loyaltyRewardService.validateReward(
                        code,
                        client
                )
        );
    }

    // =========================================================
    // 5. UTILISER MON BON
    // POST /api/loyalty/rewards/use/{code}
    // =========================================================

    @PostMapping("/use/{code}")
    public ResponseEntity<LoyaltyReward> useReward(
            @PathVariable String code,
            Authentication authentication
    ) {
        User client = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                loyaltyRewardService.useReward(
                        code,
                        client
                )
        );
    }

    // =========================================================
    // 6. UTILISER UN BON CHEZ UN COMMERÇANT
    // POST /api/loyalty/rewards/use-by-merchant/{code}
    // =========================================================

    @PostMapping("/use-by-merchant/{code}")
    public ResponseEntity<LoyaltyReward> useRewardByMerchant(
            @PathVariable String code,
            Authentication authentication
    ) {
        String merchantEmail = authentication.getName();

        return ResponseEntity.ok(
                loyaltyRewardService.useRewardByMerchant(
                        code,
                        merchantEmail
                )
        );
    }

    // =========================================================
    // UTILITAIRE
    // Récupérer le client connecté
    // =========================================================

    private User getAuthenticatedUser(Authentication authentication) {
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Utilisateur connecté introuvable")
                );
    }
}