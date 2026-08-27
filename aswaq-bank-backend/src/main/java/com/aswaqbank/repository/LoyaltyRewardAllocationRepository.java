package com.aswaqbank.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aswaqbank.entity.LoyaltyReward;
import com.aswaqbank.entity.LoyaltyRewardAllocation;

public interface LoyaltyRewardAllocationRepository
        extends JpaRepository<LoyaltyRewardAllocation, Long> {

    List<LoyaltyRewardAllocation> findByReward(LoyaltyReward reward);
}