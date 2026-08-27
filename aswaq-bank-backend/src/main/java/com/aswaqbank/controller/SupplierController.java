package com.aswaqbank.controller;

import com.aswaqbank.dto.SupplierRequest;
import com.aswaqbank.entity.Supplier;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.UserRepository;
import com.aswaqbank.service.SupplierService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/supplier")
@CrossOrigin(origins = "http://localhost:3000")
public class SupplierController {

    private final SupplierService supplierService;
    private final UserRepository userRepository;

    public SupplierController(
            SupplierService supplierService,
            UserRepository userRepository
    ) {
        this.supplierService = supplierService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public Supplier createSupplier(
            @RequestBody SupplierRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur introuvable"
                        )
                );

        if (!"FOURNISSEUR".equals(user.getRole())) {
            throw new RuntimeException(
                    "Seuls les fournisseurs peuvent créer un profil fournisseur."
            );
        }

        Supplier supplier = new Supplier();

        supplier.setCompanyName(request.getCompanyName());
        supplier.setIce(request.getIce());
        supplier.setRegistreCommerce(
                request.getRegistreCommerce()
        );
        supplier.setActivitySector(
                request.getActivitySector()
        );
        supplier.setAddress(request.getAddress());
        supplier.setCity(request.getCity());

        return supplierService.createSupplier(user, supplier);
    }

    @GetMapping("/me")
    public Supplier getMySupplier(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur introuvable"
                        )
                );

        return supplierService.getSupplierByUser(user);
    }
}