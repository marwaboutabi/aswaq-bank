package com.aswaqbank.repository;

import com.aswaqbank.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    Optional<Delivery> findByOrderId(Long orderId);
    Optional<Delivery> findByOrderIdAndOrder_Supplier_Id(Long orderId, Long supplierId);
    List<Delivery> findByOrder_Supplier_IdOrderByOrder_OrderDateDesc(Long supplierId);
}