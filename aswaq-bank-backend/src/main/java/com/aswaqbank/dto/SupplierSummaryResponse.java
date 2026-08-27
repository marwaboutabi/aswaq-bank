package com.aswaqbank.dto;

public class SupplierSummaryResponse {
    private Long id;
    private String companyName;
    private String activitySector;
    private String city;
    private String address;
    private String telephone;
    private String email;

    public SupplierSummaryResponse() {}

    public SupplierSummaryResponse(Long id, String companyName, String activitySector, String city,
                                    String address, String telephone, String email) {
        this.id = id;
        this.companyName = companyName;
        this.activitySector = activitySector;
        this.city = city;
        this.address = address;
        this.telephone = telephone;
        this.email = email;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getActivitySector() { return activitySector; }
    public void setActivitySector(String activitySector) { this.activitySector = activitySector; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}