package com.aswaqbank.controller;

import com.aswaqbank.dto.SupplierOrderResponse;
import com.aswaqbank.dto.UpdateOrderStatusRequest;
import com.aswaqbank.service.SupplierOrderService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supplier/orders")
public class SupplierOrderController {

    private final SupplierOrderService supplierOrderService;

    public SupplierOrderController(SupplierOrderService supplierOrderService) {
        this.supplierOrderService = supplierOrderService;
    }

    @GetMapping
    public List<SupplierOrderResponse> getReceivedOrders(Authentication auth) {
        return supplierOrderService.getSupplierOrders(auth.getName());
    }

    @PatchMapping("/{id}/status")
    public SupplierOrderResponse updateStatus(Authentication auth, @PathVariable Long id,
                                               @RequestBody UpdateOrderStatusRequest request) {
        return supplierOrderService.updateOrderStatus(auth.getName(), id, request.getStatus());
    }
}