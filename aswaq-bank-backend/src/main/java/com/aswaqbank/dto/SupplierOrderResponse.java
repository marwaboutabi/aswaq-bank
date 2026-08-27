package com.aswaqbank.dto;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
public class SupplierOrderResponse {
    private Long id;
    private String reference;
    private Long supplierId;
    private String supplierName;
    private String merchantName;
    private String merchantPhone;
    private String merchantAddress;
    private String status;
    private LocalDateTime orderDate;
    private LocalDate deliveryDate;
    private String notes;
    private Double totalAmount;
    private List<SupplierOrderItemResponse> items;
    private String paymentStatus;
    private LocalDateTime paidAt;
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }
    public String getMerchantName() { return merchantName; }
    public void setMerchantName(String merchantName) { this.merchantName = merchantName; }
    public String getMerchantPhone() { return merchantPhone; }
    public void setMerchantPhone(String merchantPhone) { this.merchantPhone = merchantPhone; }
    public String getMerchantAddress() { return merchantAddress; }
    public void setMerchantAddress(String merchantAddress) { this.merchantAddress = merchantAddress; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
    public LocalDate getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public List<SupplierOrderItemResponse> getItems() { return items; }
    public void setItems(List<SupplierOrderItemResponse> items) { this.items = items; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
}