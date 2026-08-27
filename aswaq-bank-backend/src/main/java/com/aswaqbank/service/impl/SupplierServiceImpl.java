package com.aswaqbank.service.impl;

import com.aswaqbank.entity.Supplier;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.SupplierRepository;
import com.aswaqbank.service.SupplierService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierServiceImpl(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Override
    @Transactional
    public Supplier createSupplier(User user, Supplier supplier) {

        if (supplierRepository.existsByUserId(user.getId())) {
            throw new RuntimeException(
                    "Ce fournisseur possède déjà un profil."
            );
        }

        if (supplier.getIce() != null &&
                !supplier.getIce().isBlank() &&
                supplierRepository.existsByIce(supplier.getIce())) {

            throw new RuntimeException(
                    "Cet ICE est déjà utilisé."
            );
        }

        if (supplier.getRegistreCommerce() != null &&
                !supplier.getRegistreCommerce().isBlank() &&
                supplierRepository.existsByRegistreCommerce(
                        supplier.getRegistreCommerce())) {

            throw new RuntimeException(
                    "Ce registre de commerce est déjà utilisé."
            );
        }

        supplier.setUser(user);

        return supplierRepository.save(supplier);
    }

    @Override
    public Supplier getSupplierByUser(User user) {

        return supplierRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Fournisseur introuvable"
                        )
                );
    }
}