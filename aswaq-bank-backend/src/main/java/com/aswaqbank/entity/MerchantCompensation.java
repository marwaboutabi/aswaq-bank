package com.aswaqbank.entity;


import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.aswaqbank.entity.LoyaltyReward;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity
@Table(name="merchant_compensations")
public class MerchantCompensation {
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "reward_id", nullable = false)
	@JsonIgnore
	private LoyaltyReward reward;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name="from_merchant_id")
    @JsonIgnore
    private Merchant fromMerchant;


    @ManyToOne
    @JoinColumn(name="to_merchant_id")
    @JsonIgnore
    private Merchant toMerchant;


    private Integer points;


    private BigDecimal amount;


    @Enumerated(EnumType.STRING)
    private CompensationStatus status;


    private LocalDateTime createdAt;



    public MerchantCompensation(){
    }


    @PrePersist
    public void prePersist(){
        createdAt = LocalDateTime.now();
    }


    public Long getId(){
        return id;
    }


    public Merchant getFromMerchant(){
        return fromMerchant;
    }


    public void setFromMerchant(Merchant fromMerchant){
        this.fromMerchant = fromMerchant;
    }


    public Merchant getToMerchant(){
        return toMerchant;
    }


    public void setToMerchant(Merchant toMerchant){
        this.toMerchant = toMerchant;
    }


    public Integer getPoints(){
        return points;
    }


    public void setPoints(Integer points){
        this.points = points;
    }


    public BigDecimal getAmount(){
        return amount;
    }


    public void setAmount(BigDecimal amount){
        this.amount = amount;
    }


    public CompensationStatus getStatus(){
        return status;
    }


    public void setStatus(CompensationStatus status){
        this.status = status;
    }


    public LocalDateTime getCreatedAt(){
        return createdAt;
    }
    public LoyaltyReward getReward() {
        return reward;
    }

    public void setReward(LoyaltyReward reward) {
        this.reward = reward;
    }

}