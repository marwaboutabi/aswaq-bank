package com.aswaqbank.repository;

import com.aswaqbank.entity.SupplierOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SupplierOrderRepository extends JpaRepository<SupplierOrder, Long> {
    List<SupplierOrder> findByMerchantIdOrderByOrderDateDesc(Long merchantId);
    List<SupplierOrder> findBySupplierIdOrderByOrderDateDesc(Long supplierId);
    Optional<SupplierOrder> findByIdAndMerchantId(Long id, Long merchantId);
    Optional<SupplierOrder> findByIdAndSupplierId(Long id, Long supplierId);
}