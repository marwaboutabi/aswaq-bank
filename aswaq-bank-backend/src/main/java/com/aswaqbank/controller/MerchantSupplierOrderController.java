package com.aswaqbank.controller;
import com.aswaqbank.dto.SupplierOrderRequest;
import com.aswaqbank.dto.SupplierOrderResponse;
import com.aswaqbank.dto.SupplierProductResponse;
import com.aswaqbank.dto.SupplierSummaryResponse;
import com.aswaqbank.service.SupplierOrderService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/merchant")
public class MerchantSupplierOrderController {
    private final SupplierOrderService supplierOrderService;
    public MerchantSupplierOrderController(SupplierOrderService supplierOrderService) {
        this.supplierOrderService = supplierOrderService;
    }
    @GetMapping("/suppliers")
    public List<SupplierSummaryResponse> getSuppliers() {
        return supplierOrderService.getAvailableSuppliers();
    }
    @GetMapping("/suppliers/{supplierId}/products")
    public List<SupplierProductResponse> getSupplierCatalog(@PathVariable Long supplierId) {
        return supplierOrderService.getSupplierCatalog(supplierId);
    }
    @PostMapping("/orders")
    public SupplierOrderResponse createOrder(Authentication auth, @RequestBody SupplierOrderRequest request) {
        return supplierOrderService.createOrder(auth.getName(), request);
    }
    @GetMapping("/orders")
    public List<SupplierOrderResponse> getMyOrders(Authentication auth) {
        return supplierOrderService.getMerchantOrders(auth.getName());
    }
    @PatchMapping("/orders/{id}/confirm-reception")
    public SupplierOrderResponse confirmReception(Authentication auth, @PathVariable Long id) {
        return supplierOrderService.confirmReception(auth.getName(), id);
    }
    @PatchMapping("/orders/{id}/pay")
    public SupplierOrderResponse payOrder(Authentication auth, @PathVariable Long id) {
        return supplierOrderService.payOrder(auth.getName(), id);
    }
}