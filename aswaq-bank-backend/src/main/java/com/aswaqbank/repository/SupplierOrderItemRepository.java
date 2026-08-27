package com.aswaqbank.repository;

import com.aswaqbank.entity.SupplierOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierOrderItemRepository extends JpaRepository<SupplierOrderItem, Long> {
}