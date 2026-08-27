package com.aswaqbank.repository;

import com.aswaqbank.entity.BankCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BankCardRepository extends JpaRepository<BankCard, Long> {

    Optional<BankCard> findByCardNumber(String cardNumber);

    boolean existsByCardNumber(String cardNumber);
}