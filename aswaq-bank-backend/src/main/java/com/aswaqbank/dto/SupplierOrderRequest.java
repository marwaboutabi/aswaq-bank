package com.aswaqbank.dto;

import java.util.List;

public class SupplierOrderRequest {
    private Long supplierId;
    private String deliveryDate; // format "yyyy-MM-dd", optionnel
    private String notes;
    private List<SupplierOrderItemRequest> items;

    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
    public String getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(String deliveryDate) { this.deliveryDate = deliveryDate; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public List<SupplierOrderItemRequest> getItems() { return items; }
    public void setItems(List<SupplierOrderItemRequest> items) { this.items = items; }
}