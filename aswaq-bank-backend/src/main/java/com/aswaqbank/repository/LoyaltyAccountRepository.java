package com.aswaqbank.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aswaqbank.entity.LoyaltyAccount;
import com.aswaqbank.entity.User;


public interface LoyaltyAccountRepository 
        extends JpaRepository<LoyaltyAccount, Long> {


    Optional<LoyaltyAccount> findByUser(User user);

}