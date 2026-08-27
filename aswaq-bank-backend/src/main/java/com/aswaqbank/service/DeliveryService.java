package com.aswaqbank.service;

import com.aswaqbank.dto.DeliveryResponse;
import com.aswaqbank.dto.DeliveryUpdateRequest;
import java.util.List;

public interface DeliveryService {
    List<DeliveryResponse> getSupplierDeliveries(String supplierEmail);
    DeliveryResponse updateDeliveryInfo(String supplierEmail, Long orderId, DeliveryUpdateRequest request);
}