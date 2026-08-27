package com.aswaqbank.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id", nullable = false)
    private Merchant merchant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private User client;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private BigDecimal voucherAmount = BigDecimal.ZERO;
    @Column
    private String voucherCode;

    @Column(nullable = false)
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SaleStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(
        mappedBy = "sale",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<SaleItem> items = new ArrayList<>();

    public Sale() {
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (voucherAmount == null) {
            voucherAmount = BigDecimal.ZERO;
        }

        if (paidAmount == null) {
            paidAmount = BigDecimal.ZERO;
        }

        if (status == null) {
            status = SaleStatus.PENDING;
        }
    }

    public Long getId() {
        return id;
    }

    public Merchant getMerchant() {
        return merchant;
    }

    public void setMerchant(Merchant merchant) {
        this.merchant = merchant;
    }

    public User getClient() {
        return client;
    }

    public void setClient(User client) {
        this.client = client;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getVoucherAmount() {
        return voucherAmount;
    }

    public void setVoucherAmount(BigDecimal voucherAmount) {
        this.voucherAmount = voucherAmount;
    }

    public BigDecimal getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(BigDecimal paidAmount) {
        this.paidAmount = paidAmount;
    }

    public SaleStatus getStatus() {
        return status;
    }

    public void setStatus(SaleStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<SaleItem> getItems() {
        return items;
    }

    public void setItems(List<SaleItem> items) {
        this.items.clear();

        if (items != null) {
            for (SaleItem item : items) {
                addItem(item);
            }
        }
    }

    public void addItem(SaleItem item) {
        if (item == null) {
            return;
        }

        items.add(item);
        item.setSale(this);
    }

    public void removeItem(SaleItem item) {
        if (item == null) {
            return;
        }

        items.remove(item);
        item.setSale(null);
    }
    public String getVoucherCode() {
        return voucherCode;
    }

    public void setVoucherCode(String voucherCode) {
        this.voucherCode = voucherCode;
    }
}

