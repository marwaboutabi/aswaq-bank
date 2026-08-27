package com.aswaqbank.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity
public class Beneficiary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private String country;
    private String bank;

    @Column(length = 24)
    private String rib;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    private String alias;
    private String phone;


    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }


    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }


    public String getBank() {
        return bank;
    }

    public void setBank(String bank) {
        this.bank = bank;
    }


    public String getRib() {
        return rib;
    }

    public void setRib(String rib) {
        this.rib = rib;
    }


    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}