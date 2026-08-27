package com.aswaqbank.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aswaqbank.entity.LoyaltyReward;
import com.aswaqbank.entity.LoyaltyRewardStatus;
import com.aswaqbank.entity.User;

@Repository
public interface LoyaltyRewardRepository extends JpaRepository<LoyaltyReward, Long> {

    // Vérifier si un code existe déjà
    boolean existsByCode(String code);

    // Rechercher un bon par son code
    Optional<LoyaltyReward> findByCode(String code);

    // Rechercher un bon par code sans tenir compte des majuscules/minuscules
    Optional<LoyaltyReward> findByCodeIgnoreCase(String code);

    // Récupérer les bons d'un client
    List<LoyaltyReward> findByClientOrderByCreatedAtDesc(User client);

    // Récupérer les bons d'un client avec un statut précis
    List<LoyaltyReward> findByClientAndStatus(
            User client,
            LoyaltyRewardStatus status
    );
    
}