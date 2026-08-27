package com.aswaqbank.repository;

import com.aswaqbank.entity.SavingsTransaction;
import com.aswaqbank.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavingsTransactionRepository extends JpaRepository<SavingsTransaction, Long> {

    // Historique global de l'utilisateur, toutes les épargnes confondues, du plus récent au plus ancien
    @org.springframework.data.jpa.repository.Query(
        "SELECT st FROM SavingsTransaction st WHERE st.savingsGoal.user = :user ORDER BY st.transactionDate DESC"
    )
    List<SavingsTransaction> findAllByUser(@org.springframework.data.repository.query.Param("user") User user);

    List<SavingsTransaction> findBySavingsGoalIdOrderByTransactionDateDesc(Long savingsGoalId);
}