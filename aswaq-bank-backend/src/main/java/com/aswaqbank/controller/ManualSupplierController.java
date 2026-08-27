package com.aswaqbank.controller;

import com.aswaqbank.dto.ManualSupplierRequest;
import com.aswaqbank.dto.ManualSupplierResponse;
import com.aswaqbank.service.ManualSupplierService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/merchant/manual-suppliers")
public class ManualSupplierController {

    private final ManualSupplierService manualSupplierService;

    public ManualSupplierController(ManualSupplierService manualSupplierService) {
        this.manualSupplierService = manualSupplierService;
    }

    @GetMapping
    public List<ManualSupplierResponse> getMine(Authentication auth) {
        return manualSupplierService.getMyManualSuppliers(auth.getName());
    }

    @PostMapping
    public ManualSupplierResponse create(Authentication auth, @RequestBody ManualSupplierRequest request) {
        return manualSupplierService.create(auth.getName(), request);
    }

    @DeleteMapping("/{id}")
    public void delete(Authentication auth, @PathVariable Long id) {
        manualSupplierService.delete(auth.getName(), id);
    }
}