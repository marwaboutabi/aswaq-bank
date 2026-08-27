package com.aswaqbank.service.impl;

import com.aswaqbank.dto.ManualSupplierRequest;
import com.aswaqbank.dto.ManualSupplierResponse;
import com.aswaqbank.entity.ManualSupplier;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.ManualSupplierRepository;
import com.aswaqbank.repository.UserRepository;
import com.aswaqbank.service.ManualSupplierService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ManualSupplierServiceImpl implements ManualSupplierService {

    private final ManualSupplierRepository manualSupplierRepository;
    private final UserRepository userRepository;

    public ManualSupplierServiceImpl(ManualSupplierRepository manualSupplierRepository,
                                      UserRepository userRepository) {
        this.manualSupplierRepository = manualSupplierRepository;
        this.userRepository = userRepository;
    }

    private User getMerchant(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    @Override
    public List<ManualSupplierResponse> getMyManualSuppliers(String merchantEmail) {
        User merchant = getMerchant(merchantEmail);
        return manualSupplierRepository.findByMerchantIdOrderByCreatedAtDesc(merchant.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public ManualSupplierResponse create(String merchantEmail, ManualSupplierRequest request) {
        if (request.getCompanyName() == null || request.getCompanyName().isBlank()
                || request.getTelephone() == null || request.getTelephone().isBlank()) {
            throw new RuntimeException("Nom de l'entreprise et téléphone requis");
        }
        User merchant = getMerchant(merchantEmail);
        ManualSupplier ms = new ManualSupplier();
        ms.setMerchant(merchant);
        ms.setCompanyName(request.getCompanyName());
        ms.setCategory(request.getCategory());
        ms.setVille(request.getVille());
        ms.setTelephone(request.getTelephone());
        ms.setEmail(request.getEmail());
        return toResponse(manualSupplierRepository.save(ms));
    }

    @Override
    public void delete(String merchantEmail, Long id) {
        User merchant = getMerchant(merchantEmail);
        ManualSupplier ms = manualSupplierRepository.findByIdAndMerchantId(id, merchant.getId())
                .orElseThrow(() -> new RuntimeException("Fournisseur manuel introuvable"));
        manualSupplierRepository.delete(ms);
    }

    private ManualSupplierResponse toResponse(ManualSupplier ms) {
        return new ManualSupplierResponse(ms.getId(), ms.getCompanyName(), ms.getCategory(),
                ms.getVille(), ms.getTelephone(), ms.getEmail(), ms.getCreatedAt());
    }
}