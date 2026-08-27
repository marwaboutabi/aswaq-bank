package com.aswaqbank.entity;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name = "supplier_orders")
public class SupplierOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String reference;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id", nullable = false)
    private User merchant;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private User supplier;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SupplierOrderStatus status;
    private LocalDate deliveryDate;
    @Column(length = 1000)
    private String notes;
    private Double totalAmount;
    @Column(name = "stock_deducted")
    private boolean stockDeducted = false;

    // Snapshot figé au moment de la création de la commande
    @Column(name = "merchant_address")
    private String merchantAddress;

    @Column(name = "merchant_phone")
    private String merchantPhone;

    @Column(name = "order_date")
    private LocalDateTime orderDate;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SupplierOrderItem> items = new ArrayList<>();
    @Column(name = "merchant_stock_added")
    private boolean merchantStockAdded = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private SupplierOrderPaymentStatus paymentStatus = SupplierOrderPaymentStatus.UNPAID;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @PrePersist
    protected void onCreate() {
        this.orderDate = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = SupplierOrderStatus.EN_ATTENTE;
        if (this.paymentStatus == null) this.paymentStatus = SupplierOrderPaymentStatus.UNPAID;
    }
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public User getMerchant() { return merchant; }
    public void setMerchant(User merchant) { this.merchant = merchant; }
    public User getSupplier() { return supplier; }
    public void setSupplier(User supplier) { this.supplier = supplier; }
    public SupplierOrderStatus getStatus() { return status; }
    public void setStatus(SupplierOrderStatus status) { this.status = status; }
    public LocalDate getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public boolean isStockDeducted() { return stockDeducted; }
    public void setStockDeducted(boolean stockDeducted) { this.stockDeducted = stockDeducted; }
    public String getMerchantAddress() { return merchantAddress; }
    public void setMerchantAddress(String merchantAddress) { this.merchantAddress = merchantAddress; }
    public String getMerchantPhone() { return merchantPhone; }
    public void setMerchantPhone(String merchantPhone) { this.merchantPhone = merchantPhone; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public List<SupplierOrderItem> getItems() { return items; }
    public void setItems(List<SupplierOrderItem> items) { this.items = items; }
    public boolean isMerchantStockAdded() { return merchantStockAdded; }
    public void setMerchantStockAdded(boolean merchantStockAdded) { this.merchantStockAdded = merchantStockAdded; }
    public SupplierOrderPaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(SupplierOrderPaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
}