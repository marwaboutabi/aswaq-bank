package com.aswaqbank.service;

import com.aswaqbank.entity.MerchantCompensation;

import java.util.List;

public interface MerchantCompensationService {

    List<MerchantCompensation> createCompensationsForReward(
            Long rewardId,
            Long usedMerchantId
    );

    MerchantCompensation settleCompensation(
            Long compensationId
    );

    List<MerchantCompensation> getMyCompensations(
            String merchantEmail
    );

    List<MerchantCompensation> getMyPayableCompensations(
            String merchantEmail
    );

    List<MerchantCompensation> getMyReceivableCompensations(
            String merchantEmail
    );
}