package com.aswaqbank.service.impl;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aswaqbank.entity.Merchant;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.MerchantRepository;
import com.aswaqbank.service.MerchantService;
@Service
public class MerchantServiceImpl implements MerchantService {

    private final MerchantRepository merchantRepository;

    public MerchantServiceImpl(MerchantRepository merchantRepository) {
        this.merchantRepository = merchantRepository;
    }

    @Override
    @Transactional
    public Merchant createMerchant(User user, Merchant merchant) {

        if (merchantRepository.existsByUserId(user.getId())) {
            throw new RuntimeException("Ce commerçant possède déjà un profil.");
        }

        if (merchant.getIce() != null &&
                merchantRepository.existsByIce(merchant.getIce())) {
            throw new RuntimeException("Cet ICE est déjà utilisé.");
        }

        if (merchant.getRegistreCommerce() != null &&
                merchantRepository.existsByRegistreCommerce(
                        merchant.getRegistreCommerce())) {
            throw new RuntimeException("Ce registre de commerce est déjà utilisé.");
        }

        merchant.setUser(user);

        return merchantRepository.save(merchant);
    }

    @Override
    public Merchant getMerchantByUser(User user) {

        return merchantRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Commerçant introuvable")
                );
    }
    @Override
    public List<Merchant> getAllMerchants() {
        return merchantRepository.findAll();
    }
}