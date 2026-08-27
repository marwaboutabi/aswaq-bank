package com.aswaqbank.dto;

public class UpdateProfileRequest {
    private String nom;
    private String prenom;
    private String email;
    private String telephone;

    // Communs à Merchant et Supplier
    private String companyName;
    private String activitySector;
    private String address;
    private String city;

    // Uniquement pris en compte si l'utilisateur est fournisseur
    private String ice;
    private String registreCommerce;

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
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