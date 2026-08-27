package com.aswaqbank.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="loyalty_accounts")
public class LoyaltyAccount {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @OneToOne
    @JoinColumn(name="user_id", nullable=false)
    private User user;


    @Column(nullable=false)
    private Integer points = 0;


    @Column(nullable=false)
    private String level = "Bronze";


    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    public LoyaltyAccount(){
    }


    @PrePersist
    public void prePersist(){
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }


    @PreUpdate
    public void preUpdate(){
        updatedAt = LocalDateTime.now();
    }


    public Long getId() {
        return id;
    }


    public User getUser() {
        return user;
    }


    public void setUser(User user) {
        this.user = user;
    }


    public Integer getPoints() {
        return points;
    }


    public void setPoints(Integer points) {
        this.points = points;
    }


    public String getLevel() {
        return level;
    }


    public void setLevel(String level) {
        this.level = level;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

}