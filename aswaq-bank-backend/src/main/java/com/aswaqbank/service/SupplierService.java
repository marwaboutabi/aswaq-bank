package com.aswaqbank.service;

import com.aswaqbank.entity.Supplier;
import com.aswaqbank.entity.User;

public interface SupplierService {

    Supplier createSupplier(User user, Supplier supplier);

    Supplier getSupplierByUser(User user);
}