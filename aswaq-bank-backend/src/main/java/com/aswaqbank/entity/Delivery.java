package com.aswaqbank.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private SupplierOrder order;

    private String transporteur;
    private String vehicule;
    private String chauffeur;
    private String trackingNumber;
    private LocalDate expeditionDate;
    private LocalDate estimatedDeliveryDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public SupplierOrder getOrder() { return order; }
    public void setOrder(SupplierOrder order) { this.order = order; }
    public String getTransporteur() { return transporteur; }
    public void setTransporteur(String transporteur) { this.transporteur = transporteur; }
    public String getVehicule() { return vehicule; }
    public void setVehicule(String vehicule) { this.vehicule = vehicule; }
    public String getChauffeur() { return chauffeur; }
    public void setChauffeur(String chauffeur) { this.chauffeur = chauffeur; }
    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    public LocalDate getExpeditionDate() { return expeditionDate; }
    public void setExpeditionDate(LocalDate expeditionDate) { this.expeditionDate = expeditionDate; }
    public LocalDate getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(LocalDate estimatedDeliveryDate) { this.estimatedDeliveryDate = estimatedDeliveryDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}