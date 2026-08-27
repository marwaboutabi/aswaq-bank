package com.aswaqbank.repository;

import com.aswaqbank.entity.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    Optional<BankAccount> findByAccountNumber(String accountNumber);
    Optional<BankAccount> findByRib(String rib);
    boolean existsByRib(String rib); 
    Optional<BankAccount> findByUserEmail(String email);
}