package com.aswaqbank.dto;

public class RegisterRequest {

    private String nom;
    private String prenom;
    private String email;
    private String motDePasse;
    private String cardPin;
    private String telephone;
    private String role;

    private MerchantRequest merchant;
    private SupplierRequest supplier;

    public RegisterRequest() {
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public String getCardPin() {
        return cardPin;
    }

    public void setCardPin(String cardPin) {
        this.cardPin = cardPin;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public MerchantRequest getMerchant() {
        return merchant;
    }

    public void setMerchant(MerchantRequest merchant) {
        this.merchant = merchant;
    }

    public SupplierRequest getSupplier() {
        return supplier;
    }

    public void setSupplier(SupplierRequest supplier) {
        this.supplier = supplier;
    }
}