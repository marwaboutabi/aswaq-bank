package com.aswaqbank.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bank_accounts")
public class BankAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String accountNumber;

    @Column(nullable = false, unique = true, length = 24)
    private String rib;

    @Column(nullable = false)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(nullable = false)
    private String currency = "MAD";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus status = AccountStatus.ACTIVE;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    @OneToMany(mappedBy = "bankAccount", cascade = CascadeType.ALL)
    @JsonIgnore
    private java.util.List<BankCard> cards;

    public BankAccount() {
    }

    // ===== ID =====

    public Long getId() {
        return id;
    }

    // ===== ACCOUNT NUMBER =====

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    // ===== RIB =====

    public String getRib() {
        return rib;
    }

    public void setRib(String rib) {
        this.rib = rib;
    }

    // ===== BALANCE =====

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    // ===== CURRENCY =====

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    // ===== STATUS =====

    public AccountStatus getStatus() {
        return status;
    }

    public void setStatus(AccountStatus status) {
        this.status = status;
    }

    // ===== CREATED AT =====

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // ===== USER =====

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
    public java.util.List<BankCard> getCards() {
        return cards;
    }

    public void setCards(java.util.List<BankCard> cards) {
        this.cards = cards;
    }

}