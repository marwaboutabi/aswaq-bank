package com.aswaqbank.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BeneficiaireRequest {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @NotBlank(message = "Le RIB est obligatoire")
    private String rib;

    private String banque;

    private String telephone;
}