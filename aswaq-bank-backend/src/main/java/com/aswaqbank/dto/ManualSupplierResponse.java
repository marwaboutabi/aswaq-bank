package com.aswaqbank.dto;

import java.time.LocalDateTime;

public class ManualSupplierResponse {
    private Long id;
    private String companyName;
    private String category;
    private String ville;
    private String telephone;
    private String email;
    private LocalDateTime createdAt;

    public ManualSupplierResponse() {}

    public ManualSupplierResponse(Long id, String companyName, String category, String ville,
                                   String telephone, String email, LocalDateTime createdAt) {
        this.id = id; this.companyName = companyName; this.category = category;
        this.ville = ville; this.telephone = telephone; this.email = email; this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}