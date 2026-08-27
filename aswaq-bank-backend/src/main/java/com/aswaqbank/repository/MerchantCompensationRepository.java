package com.aswaqbank.repository;

import com.aswaqbank.entity.LoyaltyReward;
import com.aswaqbank.entity.Merchant;
import com.aswaqbank.entity.MerchantCompensation;
import com.aswaqbank.entity.CompensationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MerchantCompensationRepository
extends JpaRepository<MerchantCompensation, Long> {

List<MerchantCompensation> findByReward(LoyaltyReward reward);

List<MerchantCompensation> findByStatus(
    CompensationStatus status
);

List<MerchantCompensation> findByFromMerchantOrderByCreatedAtDesc(
    Merchant merchant
);

List<MerchantCompensation> findByToMerchantOrderByCreatedAtDesc(
    Merchant merchant
);

List<MerchantCompensation>
findByFromMerchantOrToMerchantOrderByCreatedAtDesc(
    Merchant fromMerchant,
    Merchant toMerchant
);

boolean existsByRewardAndFromMerchantAndToMerchant(
    LoyaltyReward reward,
    Merchant fromMerchant,
    Merchant toMerchant
);

}