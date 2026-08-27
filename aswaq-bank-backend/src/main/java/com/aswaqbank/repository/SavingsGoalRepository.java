package com.aswaqbank.repository;

import com.aswaqbank.entity.SavingsGoal;
import com.aswaqbank.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavingsGoalRepository extends JpaRepository<SavingsGoal, Long> {

    List<SavingsGoal> findByUserOrderByCreatedAtDesc(User user);

    Optional<SavingsGoal> findByIdAndUser(Long id, User user);
}