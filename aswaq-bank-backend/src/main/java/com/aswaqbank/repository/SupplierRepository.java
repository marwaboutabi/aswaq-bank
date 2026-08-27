package com.aswaqbank.repository;

import com.aswaqbank.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    boolean existsByUserId(Long userId);

    boolean existsByIce(String ice);

    boolean existsByRegistreCommerce(String registreCommerce);

    Optional<Supplier> findByUserId(Long userId);
}