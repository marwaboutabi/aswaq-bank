package com.aswaqbank.service;

import java.math.BigDecimal;
import java.util.List;

import com.aswaqbank.entity.LoyaltyReward;
import com.aswaqbank.entity.Merchant;
import com.aswaqbank.entity.User;
import com.aswaqbank.entity.Sale;
public interface LoyaltyRewardService {

    /**
     * Générer un bon d'achat à partir des points du client.
     */
    LoyaltyReward createReward(
            User client,
            Integer pointsUsed,
            BigDecimal rewardAmount
    );

    /**
     * Récupérer tous les bons du client.
     */
    List<LoyaltyReward> getClientRewards(
            String clientEmail
    );

    /**
     * Récupérer uniquement les bons disponibles.
     */
    List<LoyaltyReward> getAvailableRewards(
            String clientEmail
    );

    /**
     * Récupérer un bon par son code.
     */
    LoyaltyReward getByCode(
            String code
    );

    /**
     * Vérifier qu'un bon peut être utilisé
     * par un client.
     */
    LoyaltyReward validateReward(
            String code,
            User client
    );

    /**
     * Utiliser un bon par un client.
     */
    LoyaltyReward useReward(
            String code,
            User client
    );

    /**
     * Utiliser un bon par un commerçant.
     */
    LoyaltyReward useRewardByMerchant(
            String code,
            String merchantEmail
    );

    /**
     * Utiliser un bon lors du paiement
     * d'une vente.
     */
    LoyaltyReward useRewardForSale(
            String code,
            User client,
            Merchant merchant,
            Sale sale
    );
}