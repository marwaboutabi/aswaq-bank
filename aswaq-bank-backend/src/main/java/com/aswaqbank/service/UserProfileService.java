package com.aswaqbank.service;

import com.aswaqbank.dto.UpdateProfileRequest;
import com.aswaqbank.dto.UserProfileResponse;
import com.aswaqbank.entity.Merchant;
import com.aswaqbank.entity.Supplier;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.MerchantRepository;
import com.aswaqbank.repository.SupplierRepository;
import com.aswaqbank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class UserProfileService {

    private final UserRepository userRepository;
    private final MerchantRepository merchantRepository;
    private final SupplierRepository supplierRepository;
    private final OtpService otpService;

    @Autowired
    public UserProfileService(UserRepository userRepository,
                               MerchantRepository merchantRepository,
                               SupplierRepository supplierRepository,
                               OtpService otpService) {
        this.userRepository = userRepository;
        this.merchantRepository = merchantRepository;
        this.supplierRepository = supplierRepository;
        this.otpService = otpService;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    public UserProfileResponse getProfile() {
        return toResponse(getCurrentUser());
    }

    @Transactional
    public UserProfileResponse updateProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();

        if (request.getNom() != null) user.setNom(request.getNom());
        if (request.getPrenom() != null) user.setPrenom(request.getPrenom());
        if (request.getTelephone() != null) user.setTelephone(request.getTelephone());
        userRepository.save(user);

        if ("MERCHANT".equalsIgnoreCase(user.getRole()) && user.getMerchant() != null) {
            Merchant merchant = user.getMerchant();
            if (request.getCompanyName() != null) merchant.setCompanyName(request.getCompanyName());
            if (request.getActivitySector() != null) merchant.setActivitySector(request.getActivitySector());
            if (request.getAddress() != null) merchant.setAddress(request.getAddress());
            if (request.getCity() != null) merchant.setCity(request.getCity());
            merchantRepository.save(merchant);
        }

        if ("FOURNISSEUR".equalsIgnoreCase(user.getRole()) && user.getSupplier() != null) {
            Supplier supplier = user.getSupplier();
            if (request.getCompanyName() != null) supplier.setCompanyName(request.getCompanyName());
            if (request.getActivitySector() != null) supplier.setActivitySector(request.getActivitySector());
            if (request.getAddress() != null) supplier.setAddress(request.getAddress());
            if (request.getCity() != null) supplier.setCity(request.getCity());
            if (request.getIce() != null) supplier.setIce(request.getIce());
            if (request.getRegistreCommerce() != null) supplier.setRegistreCommerce(request.getRegistreCommerce());
            supplierRepository.save(supplier);
        }

        return toResponse(user);
    }

    // ---- Changement d'email sécurisé par OTP (inchangé) ------------------

    public Map<String, String> requestEmailChange(String newEmail) {
        User user = getCurrentUser();

        if (newEmail == null || newEmail.isBlank()) {
            throw new RuntimeException("Email invalide");
        }
        if (newEmail.equalsIgnoreCase(user.getEmail())) {
            throw new RuntimeException("Cet email est déjà le vôtre");
        }
        if (userRepository.existsByEmail(newEmail)) {
            throw new RuntimeException("Cet email est déjà utilisé par un autre compte");
        }

        otpService.generateAndSendOtp(newEmail);
        return Map.of("message", "Code envoyé à " + newEmail);
    }

    @Transactional
    public Map<String, Object> confirmEmailChange(String newEmail, String code) {
        User user = getCurrentUser();

        boolean valid = otpService.verifyOtp(newEmail, code);
        if (!valid) {
            return Map.of("success", false, "message", "Code invalide ou expiré");
        }
        if (userRepository.existsByEmail(newEmail)) {
            return Map.of("success", false, "message", "Cet email est déjà utilisé");
        }

        user.setEmail(newEmail);
        userRepository.save(user);

        return Map.of("success", true, "message", "Email mis à jour. Veuillez vous reconnecter.");
    }

    private UserProfileResponse toResponse(User user) {
        Merchant merchant = user.getMerchant();
        Supplier supplier = user.getSupplier();
        return new UserProfileResponse(
                user.getId(), user.getNom(), user.getPrenom(), user.getEmail(),
                user.getTelephone(), user.getRole(),
                merchant != null ? merchant.getCompanyName() : (supplier != null ? supplier.getCompanyName() : null),
                merchant != null ? merchant.getActivitySector() : (supplier != null ? supplier.getActivitySector() : null),
                merchant != null ? merchant.getAddress() : (supplier != null ? supplier.getAddress() : null),
                merchant != null ? merchant.getCity() : (supplier != null ? supplier.getCity() : null),
                supplier != null ? supplier.getIce() : null,
                supplier != null ? supplier.getRegistreCommerce() : null
        );
    }
}