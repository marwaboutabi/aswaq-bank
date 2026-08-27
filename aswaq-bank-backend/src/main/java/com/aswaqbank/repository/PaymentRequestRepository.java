package com.aswaqbank.repository;

import com.aswaqbank.entity.BankAccount;
import com.aswaqbank.entity.PaymentRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRequestRepository extends JpaRepository<PaymentRequest, Long> {

    Optional<PaymentRequest> findByReference(String reference);

    List<PaymentRequest> findByMerchantAccountOrderByCreatedAtDesc(BankAccount merchantAccount);}