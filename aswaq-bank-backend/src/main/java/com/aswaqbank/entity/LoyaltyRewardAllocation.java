package com.aswaqbank.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "loyalty_reward_allocations")
public class LoyaltyRewardAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reward_id", nullable = false)
    private LoyaltyReward reward;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id", nullable = false)
    private Merchant merchant;

    @Column(nullable = false)
    private Integer points;

    @Column(nullable = false)
    private BigDecimal amount;

    public LoyaltyRewardAllocation() {
    }

    public Long getId() {
        return id;
    }

    public LoyaltyReward getReward() {
        return reward;
    }

    public void setReward(LoyaltyReward reward) {
        this.reward = reward;
    }

    public Merchant getMerchant() {
        return merchant;
    }

    public void setMerchant(Merchant merchant) {
        this.merchant = merchant;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}