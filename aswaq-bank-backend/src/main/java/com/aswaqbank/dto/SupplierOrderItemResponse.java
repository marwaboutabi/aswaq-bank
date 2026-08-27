package com.aswaqbank.dto;

public class SupplierOrderItemResponse {
    private Long id;
    private Long supplierProductId;
    private String productName;
    private String sku;
    private Integer quantity;
    private Double unitPrice;
    private Double subtotal;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSupplierProductId() { return supplierProductId; }
    public void setSupplierProductId(Long supplierProductId) { this.supplierProductId = supplierProductId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }
    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
}