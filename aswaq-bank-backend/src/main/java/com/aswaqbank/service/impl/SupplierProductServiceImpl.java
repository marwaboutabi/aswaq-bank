package com.aswaqbank.service.impl;

import com.aswaqbank.dto.SupplierProductRequest;
import com.aswaqbank.dto.SupplierProductResponse;
import com.aswaqbank.entity.SupplierProduct;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.SupplierProductRepository;
import com.aswaqbank.repository.UserRepository;
import com.aswaqbank.service.SupplierProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierProductServiceImpl implements SupplierProductService {

    private final SupplierProductRepository supplierProductRepository;
    private final UserRepository userRepository;

    public SupplierProductServiceImpl(SupplierProductRepository supplierProductRepository,
                                       UserRepository userRepository) {
        this.supplierProductRepository = supplierProductRepository;
        this.userRepository = userRepository;
    }

    private User getSupplier(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Fournisseur introuvable"));
    }

    private String generateSku(Long id) {
        return "PRD-" + String.format("%05d", id);
    }

    @Override
    public List<SupplierProductResponse> getMyProducts(String supplierEmail) {
        User supplier = getSupplier(supplierEmail);
        return supplierProductRepository.findBySupplierId(supplier.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public SupplierProductResponse addProduct(String supplierEmail, SupplierProductRequest request) {
        User supplier = getSupplier(supplierEmail);
        SupplierProduct product = new SupplierProduct();
        applyRequest(product, request);
        product.setSupplier(supplier);

        SupplierProduct saved = supplierProductRepository.save(product);
        saved.setSku(generateSku(saved.getId()));
        saved = supplierProductRepository.save(saved);

        return toResponse(saved);
    }

    @Override
    public SupplierProductResponse updateProduct(String supplierEmail, Long productId, SupplierProductRequest request) {
        User supplier = getSupplier(supplierEmail);
        SupplierProduct product = supplierProductRepository.findByIdAndSupplierId(productId, supplier.getId())
                .orElseThrow(() -> new RuntimeException("Produit introuvable ou accès refusé"));
        applyRequest(product, request);
        return toResponse(supplierProductRepository.save(product));
    }

    @Override
    public void deleteProduct(String supplierEmail, Long productId) {
        User supplier = getSupplier(supplierEmail);
        SupplierProduct product = supplierProductRepository.findByIdAndSupplierId(productId, supplier.getId())
                .orElseThrow(() -> new RuntimeException("Produit introuvable ou accès refusé"));
        supplierProductRepository.delete(product);
    }

    private void applyRequest(SupplierProduct product, SupplierProductRequest r) {
        product.setName(r.getName());
        product.setDescription(r.getDescription());
        product.setCategory(r.getCategory());
        product.setPrice(r.getPrice());
        product.setStock(r.getStock());
    }

    private SupplierProductResponse toResponse(SupplierProduct p) {
        SupplierProductResponse res = new SupplierProductResponse();
        res.setId(p.getId());
        res.setName(p.getName());
        res.setDescription(p.getDescription());
        res.setCategory(p.getCategory());
        res.setPrice(p.getPrice());
        res.setStock(p.getStock());
        res.setSku(p.getSku());
        res.setUpdatedAt(p.getUpdatedAt());
        res.setAvailability(p.getStock() == 0 ? "Rupture" : p.getStock() <= 10 ? "Stock faible" : "Disponible");
        return res;
    }
}