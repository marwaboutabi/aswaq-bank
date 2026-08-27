package com.aswaqbank.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loyalty_rewards")
public class LoyaltyReward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ CORRECTION : Ajout de fetch = FetchType.LAZY pour éviter le chargement automatique
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id")
    private Merchant merchant;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private Integer pointsUsed;

    @Column(nullable = false)
    private BigDecimal rewardAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoyaltyRewardStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    private LocalDateTime usedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "used_sale_id")
    private Sale usedSale;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_merchant_id")
    private Merchant sourceMerchant;

    public LoyaltyReward() {
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (expiresAt == null) {
            expiresAt = createdAt.plusMonths(3);
        }
        if (status == null) {
            status = LoyaltyRewardStatus.AVAILABLE;
        }
    }

    // =====================================================
    // GETTERS / SETTERS
    // =====================================================

    public Long getId() { return id; }
    public User getClient() { return client; }
    public void setClient(User client) { this.client = client; }
    public Merchant getMerchant() { return merchant; }
    public void setMerchant(Merchant merchant) { this.merchant = merchant; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public Integer getPointsUsed() { return pointsUsed; }
    public void setPointsUsed(Integer pointsUsed) { this.pointsUsed = pointsUsed; }
    public BigDecimal getRewardAmount() { return rewardAmount; }
    public void setRewardAmount(BigDecimal rewardAmount) { this.rewardAmount = rewardAmount; }
    public LoyaltyRewardStatus getStatus() { return status; }
    public void setStatus(LoyaltyRewardStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    public LocalDateTime getUsedAt() { return usedAt; }
    public void setUsedAt(LocalDateTime usedAt) { this.usedAt = usedAt; }
    public Sale getUsedSale() { return usedSale; }
    public void setUsedSale(Sale usedSale) { this.usedSale = usedSale; }
    public Merchant getSourceMerchant() { return sourceMerchant; }
    public void setSourceMerchant(Merchant sourceMerchant) { this.sourceMerchant = sourceMerchant; }
}