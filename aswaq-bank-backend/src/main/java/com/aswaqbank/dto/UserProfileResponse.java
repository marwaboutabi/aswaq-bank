package com.aswaqbank.dto;

public class UserProfileResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String role;

    // Communs à Merchant et Supplier
    private String companyName;
    private String activitySector;
    private String address;
    private String city;

    // Uniquement si role = FOURNISSEUR
    private String ice;
    private String registreCommerce;

    public UserProfileResponse() {}

    public UserProfileResponse(Long id, String nom, String prenom, String email, String telephone, String role,
                                String companyName, String activitySector, String address, String city,
                                String ice, String registreCommerce) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.telephone = telephone;
        this.role = role;
        this.companyName = companyName;
        this.activitySector = activitySector;
        this.address = address;
        this.city = city;
        this.ice = ice;
        this.registreCommerce = registreCommerce;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getActivitySector() { return activitySector; }
    public void setActivitySector(String activitySector) { this.activitySector = activitySector; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getIce() { return ice; }
    public void setIce(String ice) { this.ice = ice; }
    public String getRegistreCommerce() { return registreCommerce; }
    public void setRegistreCommerce(String registreCommerce) { this.registreCommerce = registreCommerce; }
}