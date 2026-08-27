package com.aswaqbank.controller;

import com.aswaqbank.entity.Beneficiary;
import com.aswaqbank.service.BeneficiaryService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beneficiaries")
@CrossOrigin(origins = "http://localhost:3000")
public class BeneficiaryController {

    private final BeneficiaryService service;

    public BeneficiaryController(BeneficiaryService service){
        this.service = service;
    }

    @GetMapping
    public List<Beneficiary> getBeneficiaries(Authentication authentication){
        return service.getAll(authentication.getName());
    }

    @PostMapping
    public Beneficiary addBeneficiary(
            @RequestBody Beneficiary beneficiary,
            Authentication authentication){
        return service.save(beneficiary, authentication.getName());
    }

    @PutMapping("/{id}")
    public Beneficiary updateBeneficiary(
            @PathVariable Long id,
            @RequestBody Beneficiary beneficiary,
            Authentication authentication){
        return service.update(id, beneficiary, authentication.getName());
    }

    @DeleteMapping("/{id}")
    public void deleteBeneficiary(
            @PathVariable Long id,
            Authentication authentication){
        service.delete(id, authentication.getName());
    }
}