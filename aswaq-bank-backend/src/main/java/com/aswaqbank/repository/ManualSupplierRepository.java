package com.aswaqbank.repository;

import com.aswaqbank.entity.ManualSupplier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ManualSupplierRepository extends JpaRepository<ManualSupplier, Long> {
    List<ManualSupplier> findByMerchantIdOrderByCreatedAtDesc(Long merchantId);
    Optional<ManualSupplier> findByIdAndMerchantId(Long id, Long merchantId);
}