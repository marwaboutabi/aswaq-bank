package com.aswaqbank.service;

import com.aswaqbank.dto.ProductRequest;
import com.aswaqbank.dto.ProductResponse;

import java.util.List;

public interface ProductService {

    ProductResponse createProduct(Long userId, ProductRequest request);

    List<ProductResponse> getMerchantProducts(Long userId);

    ProductResponse updateProduct(Long productId, Long userId, ProductRequest request);

    void deleteProduct(Long productId, Long userId);

    ProductResponse getProductById(Long productId, Long userId);
    void addStockFromSupplierDelivery(com.aswaqbank.entity.Merchant merchant, com.aswaqbank.entity.SupplierProduct supplierProduct, int quantity);

}