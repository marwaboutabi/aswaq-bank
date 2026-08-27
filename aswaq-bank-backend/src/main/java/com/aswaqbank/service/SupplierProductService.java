package com.aswaqbank.service;

import com.aswaqbank.dto.SupplierProductRequest;
import com.aswaqbank.dto.SupplierProductResponse;
import java.util.List;

public interface SupplierProductService {
    List<SupplierProductResponse> getMyProducts(String supplierEmail);
    SupplierProductResponse addProduct(String supplierEmail, SupplierProductRequest request);
    SupplierProductResponse updateProduct(String supplierEmail, Long productId, SupplierProductRequest request);
    void deleteProduct(String supplierEmail, Long productId);
}