package com.aswaqbank.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class MerchantTicketResponse {

    private Long id;
    private BigDecimal totalAmount;
    private BigDecimal voucherAmount;
    private String voucherCode;
    private BigDecimal paidAmount;
    private String status;
    private LocalDateTime createdAt;
    private ClientInfo client;
    private List<ItemInfo> items;

    // Getters & Setters standards
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public BigDecimal getVoucherAmount() { return voucherAmount; }
    public void setVoucherAmount(BigDecimal voucherAmount) { this.voucherAmount = voucherAmount; }
    public String getVoucherCode() { return voucherCode; }
    public void setVoucherCode(String voucherCode) { this.voucherCode = voucherCode; }
    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public ClientInfo getClient() { return client; }
    public void setClient(ClientInfo client) { this.client = client; }
    public List<ItemInfo> getItems() { return items; }
    public void setItems(List<ItemInfo> items) { this.items = items; }

    // ==========================================
    // CLIENT INFO
    // ==========================================
    public static class ClientInfo {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;

        public ClientInfo() {}
        
        public ClientInfo(Long id, String firstName, String lastName, String email) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    // ==========================================
    // ITEM INFO (Constructeur adapté au stream)
    // ==========================================
    public static class ItemInfo {
        private Long id;
        private ProductInfo product;
        private Integer quantity;
        private BigDecimal unitPrice;

        public ItemInfo() {}

        // Constructeur utilisé dans le mapping stream de SaleServiceImpl
        public ItemInfo(Long id, Long productId, String productName, Integer quantity, BigDecimal unitPrice) {
            this.id = id;
            this.product = (productId != null && productName != null) 
                    ? new ProductInfo(productId, productName) 
                    : null;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public ProductInfo getProduct() { return product; }
        public void setProduct(ProductInfo product) { this.product = product; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    }

    // ==========================================
    // PRODUCT INFO
    // ==========================================
    public static class ProductInfo {
        private Long id;
        private String name;

        public ProductInfo() {}
        public ProductInfo(Long id, String name) {
            this.id = id;
            this.name = name;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
}