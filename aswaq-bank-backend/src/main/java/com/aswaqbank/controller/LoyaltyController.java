package com.aswaqbank.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aswaqbank.entity.LoyaltyAccount;
import com.aswaqbank.entity.LoyaltyReward;
import com.aswaqbank.entity.LoyaltyTransaction;
import com.aswaqbank.entity.Merchant;
import com.aswaqbank.entity.MerchantCompensation;
import com.aswaqbank.entity.User;

import com.aswaqbank.repository.LoyaltyRewardRepository;
import com.aswaqbank.repository.MerchantCompensationRepository;
import com.aswaqbank.repository.MerchantRepository;
import com.aswaqbank.repository.UserRepository;

import com.aswaqbank.service.LoyaltyRewardService;
import com.aswaqbank.service.LoyaltyService;

@RestController
@RequestMapping("/api/loyalty")
public class LoyaltyController {

    private final LoyaltyService loyaltyService;
    private final UserRepository userRepository;
    private final LoyaltyRewardRepository loyaltyRewardRepository;
    private final LoyaltyRewardService loyaltyRewardService;
    private final MerchantRepository merchantRepository;
    private final MerchantCompensationRepository merchantCompensationRepository;

    public LoyaltyController(
            LoyaltyService loyaltyService,
            UserRepository userRepository,
            LoyaltyRewardRepository loyaltyRewardRepository,
            LoyaltyRewardService loyaltyRewardService,
            MerchantRepository merchantRepository,
            MerchantCompensationRepository merchantCompensationRepository
    ) {
        this.loyaltyService = loyaltyService;
        this.userRepository = userRepository;
        this.loyaltyRewardRepository = loyaltyRewardRepository;
        this.loyaltyRewardService = loyaltyRewardService;
        this.merchantRepository = merchantRepository;
        this.merchantCompensationRepository = merchantCompensationRepository;
    }

    // =========================================================
    // CLIENT : MES POINTS
    // GET /api/loyalty/my-points
    // =========================================================

    @GetMapping("/my-points")
    public LoyaltyAccount getMyPoints(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Utilisateur introuvable")
                );

        return loyaltyService.getOrCreateAccount(user);
    }

    // =========================================================
    // CLIENT : HISTORIQUE
    // GET /api/loyalty/history
    // =========================================================

    @GetMapping("/history")
    public List<LoyaltyTransaction> getHistory(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Utilisateur introuvable")
                );

        return loyaltyService.getHistory(user);
    }

    // =========================================================
    // CLIENT : CONVERTIR LES POINTS
    // POST /api/loyalty/convert
    // =========================================================

    @PostMapping("/convert")
    public LoyaltyReward convertPoints(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Utilisateur introuvable")
                );

        return loyaltyService.convertPointsToReward(user);
    }

    // =========================================================
    // CLIENT : MES BONS
    // GET /api/loyalty/rewards
    // =========================================================

    @GetMapping("/rewards")
    public List<LoyaltyReward> getMyRewards(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Utilisateur introuvable")
                );

        return loyaltyRewardRepository
                .findByClientOrderByCreatedAtDesc(user);
    }

    // =========================================================
    // COMMERÇANT : HISTORIQUE DES POINTS
    // GET /api/loyalty/merchant/history
    // =========================================================

    @GetMapping("/merchant/history")
    public List<LoyaltyTransaction> getMerchantHistory(
            Authentication authentication
    ) {

        String email = authentication.getName();

        Merchant merchant = merchantRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Commerçant introuvable")
                );

        return loyaltyService.getMerchantHistory(merchant);
    }

    // =========================================================
    // COMMERÇANT : COMPENSATIONS
    // GET /api/loyalty/merchant/compensations
    // =========================================================

    @GetMapping("/merchant/compensations")
    public List<MerchantCompensation> getMerchantCompensations(
            Authentication authentication
    ) {

        String email = authentication.getName();

        Merchant merchant = merchantRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Commerçant introuvable")
                );

        return merchantCompensationRepository
                .findByFromMerchantOrToMerchantOrderByCreatedAtDesc(
                        merchant,
                        merchant
                );
    }
}