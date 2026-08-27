package com.aswaqbank.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
@Entity
@Table(name = "merchants")
public class Merchant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName;

    @Column(unique = true)
    private String ice;

    @Column(unique = true)
    private String registreCommerce;

    private String activitySector;

    private String address;

    private String city;


    @OneToOne
    @JsonIgnore
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
     
    @OneToMany(mappedBy = "merchant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> products;

    public Merchant() {
    }


    public Long getId() {
        return id;
    }


    public String getCompanyName() {
        return companyName;
    }


    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }


    public String getIce() {
        return ice;
    }


    public void setIce(String ice) {
        this.ice = ice;
    }


    public String getRegistreCommerce() {
        return registreCommerce;
    }


    public void setRegistreCommerce(String registreCommerce) {
        this.registreCommerce = registreCommerce;
    }


    public String getActivitySector() {
        return activitySector;
    }


    public void setActivitySector(String activitySector) {
        this.activitySector = activitySector;
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


    

    public User getUser() {
        return user;
    }


    public void setUser(User user) {
        this.user = user;
    }
    
    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
}