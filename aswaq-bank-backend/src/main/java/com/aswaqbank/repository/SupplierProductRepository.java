package com.aswaqbank.repository;

import com.aswaqbank.entity.SupplierProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SupplierProductRepository extends JpaRepository<SupplierProduct, Long> {
    List<SupplierProduct> findBySupplierId(Long supplierId);
    Optional<SupplierProduct> findByIdAndSupplierId(Long id, Long supplierId);
}