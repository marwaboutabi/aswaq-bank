package com.aswaqbank.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "supplier_order_items")
public class SupplierOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private SupplierOrder order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_product_id", nullable = false)
    private SupplierProduct supplierProduct;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double unitPrice;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public SupplierOrder getOrder() { return order; }
    public void setOrder(SupplierOrder order) { this.order = order; }

    public SupplierProduct getSupplierProduct() { return supplierProduct; }
    public void setSupplierProduct(SupplierProduct supplierProduct) { this.supplierProduct = supplierProduct; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }
}