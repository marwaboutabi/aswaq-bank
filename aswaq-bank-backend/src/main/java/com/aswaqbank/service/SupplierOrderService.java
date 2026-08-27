package com.aswaqbank.service;
import com.aswaqbank.dto.*;
import java.util.List;
public interface SupplierOrderService {
    List<SupplierSummaryResponse> getAvailableSuppliers();
    List<SupplierProductResponse> getSupplierCatalog(Long supplierId);
    SupplierOrderResponse createOrder(String merchantEmail, SupplierOrderRequest request);
    List<SupplierOrderResponse> getMerchantOrders(String merchantEmail);
    List<SupplierOrderResponse> getSupplierOrders(String supplierEmail);
    SupplierOrderResponse updateOrderStatus(String supplierEmail, Long orderId, String newStatus);
    SupplierOrderResponse confirmReception(String merchantEmail, Long orderId);
    SupplierOrderResponse payOrder(String merchantEmail, Long orderId); // ← doit être présente
}