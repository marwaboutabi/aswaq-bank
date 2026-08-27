package com.aswaqbank.service;

import com.aswaqbank.dto.ManualSupplierRequest;
import com.aswaqbank.dto.ManualSupplierResponse;
import java.util.List;

public interface ManualSupplierService {
    List<ManualSupplierResponse> getMyManualSuppliers(String merchantEmail);
    ManualSupplierResponse create(String merchantEmail, ManualSupplierRequest request);
    void delete(String merchantEmail, Long id);
}