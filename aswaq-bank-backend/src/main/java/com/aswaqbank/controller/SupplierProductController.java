package com.aswaqbank.controller;

import com.aswaqbank.dto.SupplierProductRequest;
import com.aswaqbank.dto.SupplierProductResponse;
import com.aswaqbank.service.SupplierProductService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supplier/products")
public class SupplierProductController {

    private final SupplierProductService supplierProductService;

    public SupplierProductController(SupplierProductService supplierProductService) {
        this.supplierProductService = supplierProductService;
    }

    @GetMapping
    public List<SupplierProductResponse> getMyProducts(Authentication auth) {
        return supplierProductService.getMyProducts(auth.getName());
    }

    @PostMapping
    public SupplierProductResponse addProduct(Authentication auth, @RequestBody SupplierProductRequest request) {
        return supplierProductService.addProduct(auth.getName(), request);
    }

    @PutMapping("/{id}")
    public SupplierProductResponse updateProduct(Authentication auth, @PathVariable Long id,
                                                   @RequestBody SupplierProductRequest request) {
        return supplierProductService.updateProduct(auth.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(Authentication auth, @PathVariable Long id) {
        supplierProductService.deleteProduct(auth.getName(), id);
    }
}