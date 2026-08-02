package com.aswaqbank.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String telephone;

    @Column(nullable = false)
    private String motDePasse;
    
   private String role;
   private LocalDate dateNaissance;
   private String lieuNaissance;
   private String nationalite;
   private String adresse;
   private String ville;
   private String codePostal;
   private String pays;
   private String cinNumero;
   private LocalDate cinExpiration;

   @Column(columnDefinition = "LONGTEXT")
   private String cinPhoto;

   @Column(columnDefinition = "LONGTEXT")
   private String selfie;
   private String profession;
   private String situationPro;
   private String sourceRevenus;
   private String fourchetteRevenus;
   private String objetCompte;
   private String offre;
    public User() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
    


    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public String getSituationPro() {
        return situationPro;
    }

    public void setSituationPro(String situationPro) {
        this.situationPro = situationPro;
    }

    public String getSourceRevenus() {
        return sourceRevenus;
    }

    public void setSourceRevenus(String sourceRevenus) {
        this.sourceRevenus = sourceRevenus;
    }

    public String getFourchetteRevenus() {
        return fourchetteRevenus;
    }

    public void setFourchetteRevenus(String fourchetteRevenus) {
        this.fourchetteRevenus = fourchetteRevenus;
    }

    public String getObjetCompte() {
        return objetCompte;
    }

    public void setObjetCompte(String objetCompte) {
        this.objetCompte = objetCompte;
    }
    public String getOffre() {
        return offre;
    }

    public void setOffre(String offre) {
        this.offre = offre;
    }
    public LocalDate getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public String getLieuNaissance() {
        return lieuNaissance;
    }

    public void setLieuNaissance(String lieuNaissance) {
        this.lieuNaissance = lieuNaissance;
    }

    public String getNationalite() {
        return nationalite;
    }

    public void setNationalite(String nationalite) {
        this.nationalite = nationalite;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public String getCodePostal() {
        return codePostal;
    }

    public void setCodePostal(String codePostal) {
        this.codePostal = codePostal;
    }

    public String getPays() {
        return pays;
    }

    public void setPays(String pays) {
        this.pays = pays;
    }

    public String getCinNumero() {
        return cinNumero;
    }

    public void setCinNumero(String cinNumero) {
        this.cinNumero = cinNumero;
    }

    public LocalDate getCinExpiration() {
        return cinExpiration;
    }

    public void setCinExpiration(LocalDate cinExpiration) {
        this.cinExpiration = cinExpiration;
    }

    public String getCinPhoto() {
        return cinPhoto;
    }

    public void setCinPhoto(String cinPhoto) {
        this.cinPhoto = cinPhoto;
    }

    public String getSelfie() {
        return selfie;
    }

    public void setSelfie(String selfie) {
        this.selfie = selfie;
    }
}