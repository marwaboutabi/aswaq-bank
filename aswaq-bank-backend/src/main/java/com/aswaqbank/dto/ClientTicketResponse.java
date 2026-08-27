package com.aswaqbank.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ClientTicketResponse {

    private Long id;

    private MerchantInfo merchant;

    private BigDecimal totalAmount;
    private BigDecimal voucherAmount;
    private String voucherCode;
    private BigDecimal paidAmount;

    private String status;
    private LocalDateTime createdAt;

    private List<ItemInfo> items;

    public ClientTicketResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MerchantInfo getMerchant() {
        return merchant;
    }

    public void setMerchant(MerchantInfo merchant) {
        this.merchant = merchant;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getVoucherAmount() {
        return voucherAmount;
    }

    public void setVoucherAmount(BigDecimal voucherAmount) {
        this.voucherAmount = voucherAmount;
    }

    public String getVoucherCode() {
        return voucherCode;
    }

    public void setVoucherCode(String voucherCode) {
        this.voucherCode = voucherCode;
    }

    public BigDecimal getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(BigDecimal paidAmount) {
        this.paidAmount = paidAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<ItemInfo> getItems() {
        return items;
    }

    public void setItems(List<ItemInfo> items) {
        this.items = items;
    }

    // =====================================================
    // MERCHANT INFO
    // =====================================================

    public static class MerchantInfo {

        private Long id;
        private String companyName;
        private String address;
        private String city;

        public MerchantInfo() {
        }

        public MerchantInfo(
                Long id,
                String companyName,
                String address,
                String city
        ) {
            this.id = id;
            this.companyName = companyName;
            this.address = address;
            this.city = city;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getCompanyName() {
            return companyName;
        }

        public void setCompanyName(String companyName) {
            this.companyName = companyName;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }
    }

    // =====================================================
    // ITEM INFO
    // =====================================================

    public static class ItemInfo {

        private Long id;
        private ProductInfo product;
        private Integer quantity;
        private BigDecimal unitPrice;

        public ItemInfo() {
        }

        public ItemInfo(
                Long id,
                ProductInfo product,
                Integer quantity,
                BigDecimal unitPrice
        ) {
            this.id = id;
            this.product = product;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public ProductInfo getProduct() {
            return product;
        }

        public void setProduct(ProductInfo product) {
            this.product = product;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public BigDecimal getUnitPrice() {
            return unitPrice;
        }

        public void setUnitPrice(BigDecimal unitPrice) {
            this.unitPrice = unitPrice;
        }
    }

    // =====================================================
    // PRODUCT INFO
    // =====================================================

    public static class ProductInfo {

        private Long id;
        private String name;

        public ProductInfo() {
        }

        public ProductInfo(
                Long id,
                String name
        ) {
            this.id = id;
            this.name = name;
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
    }
}