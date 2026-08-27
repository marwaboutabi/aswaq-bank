package com.aswaqbank.controller;

import com.aswaqbank.dto.DeliveryResponse;
import com.aswaqbank.dto.DeliveryUpdateRequest;
import com.aswaqbank.service.DeliveryService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supplier/deliveries")
public class SupplierDeliveryController {

    private final DeliveryService deliveryService;

    public SupplierDeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @GetMapping
    public List<DeliveryResponse> getMine(Authentication auth) {
        return deliveryService.getSupplierDeliveries(auth.getName());
    }

    @PatchMapping("/{orderId}")
    public DeliveryResponse update(Authentication auth, @PathVariable Long orderId, @RequestBody DeliveryUpdateRequest request) {
        return deliveryService.updateDeliveryInfo(auth.getName(), orderId, request);
    }
}