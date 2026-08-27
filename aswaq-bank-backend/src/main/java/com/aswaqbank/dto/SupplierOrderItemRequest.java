package com.aswaqbank.dto;

public class SupplierOrderItemRequest {
    private Long supplierProductId;
    private Integer quantity;

    public Long getSupplierProductId() { return supplierProductId; }
    public void setSupplierProductId(Long supplierProductId) { this.supplierProductId = supplierProductId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}