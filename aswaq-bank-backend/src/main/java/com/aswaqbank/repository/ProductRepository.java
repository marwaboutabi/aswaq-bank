package com.aswaqbank.repository;
import com.aswaqbank.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByMerchantId(Long merchantId);
    Optional<Product> findTopByCodeStartingWithOrderByCodeDesc(String prefix);
    Optional<Product> findBySupplierProductIdAndMerchantId(Long supplierProductId, Long merchantId);
}