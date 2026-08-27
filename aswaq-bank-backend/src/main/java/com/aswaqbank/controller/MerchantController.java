package com.aswaqbank.controller;

import com.aswaqbank.dto.MerchantRequest;
import com.aswaqbank.dto.MerchantResponse;
import com.aswaqbank.entity.Merchant;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.UserRepository;
import com.aswaqbank.service.MerchantService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/merchant")
public class MerchantController {

    private final MerchantService merchantService;
    private final UserRepository userRepository;

    public MerchantController(
            MerchantService merchantService,
            UserRepository userRepository
    ) {
        this.merchantService = merchantService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public MerchantResponse createMerchant(
            @RequestBody MerchantRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Utilisateur introuvable")
                );
        if (!"MERCHANT".equals(user.getRole())) {
            throw new RuntimeException(
                    "Seuls les commerçants peuvent créer un profil commerçant."
            );
        }

        Merchant merchant = new Merchant();

        merchant.setCompanyName(request.getCompanyName());
        merchant.setIce(request.getIce());
        merchant.setRegistreCommerce(request.getRegistreCommerce());
        merchant.setActivitySector(request.getActivitySector());
        merchant.setAddress(request.getAddress());
        merchant.setCity(request.getCity());

        Merchant savedMerchant =
                merchantService.createMerchant(user, merchant);

        return toResponse(savedMerchant);
    }

    @GetMapping("/me")
    public MerchantResponse getMerchant(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Utilisateur introuvable")
                );

        Merchant merchant =
                merchantService.getMerchantByUser(user);

        return toResponse(merchant);
    }

    private MerchantResponse toResponse(Merchant merchant) {

        MerchantResponse response = new MerchantResponse();

        response.setId(merchant.getId());
        response.setCompanyName(merchant.getCompanyName());
        response.setIce(merchant.getIce());
        response.setRegistreCommerce(merchant.getRegistreCommerce());
        response.setActivitySector(merchant.getActivitySector());
        response.setAddress(merchant.getAddress());
        response.setCity(merchant.getCity());
        

        return response;
    }
    @GetMapping
    public List<MerchantResponse> getAllMerchants() {

        return merchantService
                .getAllMerchants()
                .stream()
                .map(this::toResponse)
                .toList();
    }
}