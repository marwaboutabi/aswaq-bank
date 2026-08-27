package com.aswaqbank.entity;


import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="loyalty_transactions")
public class LoyaltyTransaction {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @JsonIgnore
    private User client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id")
    @JsonIgnore
    private Merchant merchant;


    private BigDecimal amount;


    private Integer points;


    @Enumerated(EnumType.STRING)
    private LoyaltyTransactionType type;


    private String description;


    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Integer remainingPoints;

    public LoyaltyTransaction(){
    }


    @PrePersist
    public void prePersist(){
    	if (remainingPoints == null && points != null) {
    	    remainingPoints = Math.max(points, 0);
    	}
        createdAt = LocalDateTime.now();
    }


    public Long getId(){
        return id;
    }


    public User getClient(){
        return client;
    }


    public void setClient(User client){
        this.client = client;
    }


    public Merchant getMerchant(){
        return merchant;
    }


    public void setMerchant(Merchant merchant){
        this.merchant = merchant;
    }


    public BigDecimal getAmount(){
        return amount;
    }


    public void setAmount(BigDecimal amount){
        this.amount = amount;
    }


    public Integer getPoints(){
        return points;
    }


    public void setPoints(Integer points){
        this.points = points;
    }


    public LoyaltyTransactionType getType(){
        return type;
    }


    public void setType(LoyaltyTransactionType type){
        this.type = type;
    }


    public String getDescription(){
        return description;
    }


    public void setDescription(String description){
        this.description = description;
    }


    public LocalDateTime getCreatedAt(){
        return createdAt;
    }
    public Integer getRemainingPoints() {
        return remainingPoints;
    }

    public void setRemainingPoints(Integer remainingPoints) {
        this.remainingPoints = remainingPoints;
    }

}