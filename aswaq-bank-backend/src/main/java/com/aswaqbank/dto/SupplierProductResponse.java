package com.aswaqbank.dto;

import java.time.LocalDateTime;

public class SupplierProductResponse {

    private Long id;
    private String name;
    private String description;
    private String category;
    private Double price;
    private Integer stock;
    private String sku;
    private LocalDateTime updatedAt;
    private String availability;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }
}