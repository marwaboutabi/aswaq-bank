package com.aswaqbank.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aswaqbank.entity.LoyaltyTransaction;
import com.aswaqbank.entity.Merchant;
import com.aswaqbank.entity.User;

public interface LoyaltyTransactionRepository 
        extends JpaRepository<LoyaltyTransaction, Long> {

    List<LoyaltyTransaction> findByClientOrderByCreatedAtDesc(User client);

    // ✅ AJOUT : Récupérer l'historique des points générés chez ce commerçant
    List<LoyaltyTransaction> findByMerchantOrderByCreatedAtDesc(Merchant merchant);
}