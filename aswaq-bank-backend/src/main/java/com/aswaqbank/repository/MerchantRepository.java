package com.aswaqbank.repository;

import com.aswaqbank.entity.Merchant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MerchantRepository extends JpaRepository<Merchant, Long> {

    Optional<Merchant> findByUserId(Long userId);

    Optional<Merchant> findByIce(String ice);

    Optional<Merchant> findByUserEmail(String email);

    Optional<Merchant> findByRegistreCommerce(String registreCommerce);

    boolean existsByUserId(Long userId);

    boolean existsByIce(String ice);

    boolean existsByRegistreCommerce(String registreCommerce);

    // Tous les commerçants de la plateforme
    List<Merchant> findAllByOrderByCompanyNameAsc();
}