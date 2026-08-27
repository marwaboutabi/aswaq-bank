package com.aswaqbank.dto;

import lombok.Data;

@Data
public class BeneficiaireResponse {

    private Long id;

    private String nom;

    private String prenom;

    private String rib;

    private String banque;

    private String telephone;
}