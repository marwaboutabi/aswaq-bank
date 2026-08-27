package com.aswaqbank.repository;

import com.aswaqbank.entity.BankAccount;
import com.aswaqbank.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findBySenderAccount(BankAccount senderAccount);

    List<Transaction> findByReceiverAccount(BankAccount receiverAccount);

    List<Transaction> findBySenderAccountOrReceiverAccount(
            BankAccount senderAccount,
            BankAccount receiverAccount
    );
    List<Transaction> findBySenderAccount_User_IdOrReceiverAccount_User_IdOrderByTransactionDateDesc(
            Long senderUserId, Long receiverUserId);

}