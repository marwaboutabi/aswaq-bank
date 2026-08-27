package com.aswaqbank.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductResponse {

    private Long id;
    private String name;
    private String code;
    private String category;
    private BigDecimal price;
    private String description;
    private LocalDateTime createdAt;
    private Integer stock;

    public ProductResponse() {
    }

    public ProductResponse(Long id,
            String name,
            String code,
            String category,
            BigDecimal price,
            String description,
            LocalDateTime createdAt) {

this.id = id;
this.name = name;
this.code = code;
this.category = category;
this.price = price;
this.description = description;
this.createdAt = createdAt;
}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}