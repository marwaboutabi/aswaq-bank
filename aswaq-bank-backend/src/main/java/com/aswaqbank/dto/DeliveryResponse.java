package com.aswaqbank.dto;

import java.time.LocalDate;
import java.util.List;

public class DeliveryResponse {
    private Long id;
    private Long orderId;
    private String orderReference;
    private String status; // reflète SupplierOrder.status, jamais modifié directement ici
    private String merchantName;
    private String merchantPhone;
    private String merchantAddress;
    private String transporteur;
    private String vehicule;
    private String chauffeur;
    private String trackingNumber;
    private LocalDate expeditionDate;
    private LocalDate estimatedDeliveryDate;
    private List<SupplierOrderItemResponse> items;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOrderReference() { return orderReference; }
    public void setOrderReference(String orderReference) { this.orderReference = orderReference; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getMerchantName() { return merchantName; }
    public void setMerchantName(String merchantName) { this.merchantName = merchantName; }
    public String getMerchantPhone() { return merchantPhone; }
    public void setMerchantPhone(String merchantPhone) { this.merchantPhone = merchantPhone; }
    public String getMerchantAddress() { return merchantAddress; }
    public void setMerchantAddress(String merchantAddress) { this.merchantAddress = merchantAddress; }
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
    public List<SupplierOrderItemResponse> getItems() { return items; }
    public void setItems(List<SupplierOrderItemResponse> items) { this.items = items; }
}