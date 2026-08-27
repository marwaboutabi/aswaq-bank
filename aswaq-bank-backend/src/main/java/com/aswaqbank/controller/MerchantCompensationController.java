package com.aswaqbank.controller;

import com.aswaqbank.entity.MerchantCompensation;
import com.aswaqbank.service.MerchantCompensationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/merchant-compensations")
@CrossOrigin(origins = "http://localhost:3000")
public class MerchantCompensationController {

    private final MerchantCompensationService compensationService;

    public MerchantCompensationController(MerchantCompensationService compensationService) {
        this.compensationService = compensationService;
    }

    @GetMapping
    public ResponseEntity<List<MerchantCompensation>> getMyCompensations(
            Authentication authentication) {

        String email = authentication.getName();

        List<MerchantCompensation> result =
                compensationService.getMyCompensations(email);

        System.out.println("========== MY COMPENSATIONS ==========");
        System.out.println("EMAIL : " + email);
        System.out.println("RESULT : " + result);
        System.out.println("======================================");

        return ResponseEntity.ok(result);
    }

    @GetMapping("/payable")
    public ResponseEntity<List<MerchantCompensation>> getPayableCompensations(
            Authentication authentication) {

        String email = authentication.getName();

        List<MerchantCompensation> result =
                compensationService.getMyPayableCompensations(email);

        System.out.println("========== PAYABLE COMPENSATIONS ==========");
        System.out.println("EMAIL : " + email);
        System.out.println("RESULT : " + result);
        System.out.println("===========================================");

        return ResponseEntity.ok(result);
    }

    @GetMapping("/receivable")
    public ResponseEntity<List<MerchantCompensation>> getReceivableCompensations(
            Authentication authentication) {

        String email = authentication.getName();

        List<MerchantCompensation> result =
                compensationService.getMyReceivableCompensations(email);

        System.out.println("========== RECEIVABLE COMPENSATIONS ==========");
        System.out.println("EMAIL : " + email);
        System.out.println("RESULT : " + result);
        System.out.println("==============================================");

        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/settle")
    public ResponseEntity<MerchantCompensation> settleCompensation(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                compensationService.settleCompensation(id)
        );
    }
}