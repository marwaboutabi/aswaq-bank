package com.aswaqbank.repository;

import com.aswaqbank.entity.Merchant;
import com.aswaqbank.entity.Sale;
import com.aswaqbank.entity.SaleStatus;
import com.aswaqbank.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Long> {

    List<Sale> findByMerchantOrderByCreatedAtDesc(Merchant merchant);

    List<Sale> findByClientOrderByCreatedAtDesc(User client);

    List<Sale> findByMerchantAndStatusOrderByCreatedAtDesc(
            Merchant merchant,
            SaleStatus status
    );
}