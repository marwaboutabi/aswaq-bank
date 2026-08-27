package com.aswaqbank.controller;

import com.aswaqbank.dto.CardCreationResponse;
import com.aswaqbank.dto.RegisterRequest;
import com.aswaqbank.dto.RegisterResponse;
import com.aswaqbank.entity.AccountStatus;
import com.aswaqbank.entity.BankAccount;
import com.aswaqbank.entity.Merchant;
import com.aswaqbank.entity.Supplier;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.BankAccountRepository;
import com.aswaqbank.repository.MerchantRepository;
import com.aswaqbank.repository.SupplierRepository;
import com.aswaqbank.repository.UserRepository;
import com.aswaqbank.security.JwtService;
import com.aswaqbank.service.BankCardService;
import com.aswaqbank.service.OtpService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpService otpService;
    private final BankAccountRepository bankAccountRepository;
    private final BankCardService bankCardService;
    private final MerchantRepository merchantRepository;
    private final SupplierRepository supplierRepository;


    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            OtpService otpService,
            BankAccountRepository bankAccountRepository,
            BankCardService bankCardService,
            MerchantRepository merchantRepository,
            SupplierRepository supplierRepository
    ) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.otpService = otpService;
        this.bankAccountRepository = bankAccountRepository;
        this.bankCardService = bankCardService;
        this.merchantRepository = merchantRepository;
        this.supplierRepository = supplierRepository;
    }



    @PostMapping("/register")
    public RegisterResponse register(
            @RequestBody RegisterRequest request
    ) {


        if(userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }



        User user = new User();

        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setEmail(request.getEmail());
        user.setTelephone(request.getTelephone());

        // Garde-fou : ne jamais insérer un rôle null.
        // Valeur SANS préfixe "ROLE_" (ajouté automatiquement par le builder Spring Security .roles(...))
        String role = request.getRole();

        if (role == null || role.isBlank()) {
            role = "CLIENT";
        }

        role = role.toUpperCase();
        user.setRole(role);
        user.setMotDePasse(
                passwordEncoder.encode(
                        request.getMotDePasse()
                )
        );


        User savedUser = userRepository.save(user);



        // Création du compte bancaire
        BankAccount account = new BankAccount();

        account.setAccountNumber(
                "MA" + generateDigits(18)
        );

        account.setRib(
                generateDigits(24)
        );

        account.setBalance(
                java.math.BigDecimal.ZERO
        );

        account.setCurrency("MAD");

        account.setStatus(
                AccountStatus.ACTIVE
        );

        account.setCreatedAt(
                LocalDateTime.now()
        );

        account.setUser(savedUser);


        BankAccount savedAccount =
                bankAccountRepository.save(account);



        CardCreationResponse cardResponse =
                bankCardService.createCard(savedAccount);



        // ============================================================
        // CREATION DU PROFIL SELON LE ROLE
        // ============================================================

        if ("COMMERCANT".equalsIgnoreCase(savedUser.getRole())) {

            System.out.println("===== CREATION MERCHANT =====");

            if (request.getMerchant() == null) {
                throw new RuntimeException(
                        "Les informations du commerçant sont obligatoires."
                );
            }

            Merchant merchant = new Merchant();

            merchant.setCompanyName(
                    request.getMerchant().getCompanyName()
            );

            merchant.setIce(
                    request.getMerchant().getIce()
            );

            merchant.setRegistreCommerce(
                    request.getMerchant().getRegistreCommerce()
            );

            merchant.setActivitySector(
                    request.getMerchant().getActivitySector()
            );

            merchant.setAddress(
                    request.getMerchant().getAddress()
            );

            merchant.setCity(
                    request.getMerchant().getCity()
            );

            merchant.setUser(savedUser);

            Merchant savedMerchant =
                    merchantRepository.save(merchant);

            System.out.println(
                    ">>> MERCHANT CREE ID = "
                            + savedMerchant.getId()
            );
        }


        // ============================================================
        // CREATION DU PROFIL FOURNISSEUR
        // ============================================================

        if ("FOURNISSEUR".equalsIgnoreCase(savedUser.getRole())) {

            System.out.println("===== CREATION SUPPLIER =====");

            if (request.getSupplier() == null) {
                throw new RuntimeException(
                        "Les informations du fournisseur sont obligatoires."
                );
            }

            Supplier supplier = new Supplier();

            supplier.setCompanyName(
                    request.getSupplier().getCompanyName()
            );

            supplier.setIce(
                    request.getSupplier().getIce()
            );

            supplier.setRegistreCommerce(
                    request.getSupplier().getRegistreCommerce()
            );

            supplier.setActivitySector(
                    request.getSupplier().getActivitySector()
            );

            supplier.setAddress(
                    request.getSupplier().getAddress()
            );

            supplier.setCity(
                    request.getSupplier().getCity()
            );

            supplier.setUser(savedUser);

            Supplier savedSupplier =
                    supplierRepository.save(supplier);

            System.out.println(
                    ">>> SUPPLIER CREE ID = "
                            + savedSupplier.getId()
            );
        }



        return new RegisterResponse(
                savedUser.getId(),
                cardResponse.getGeneratedPin()
        );
    }





    @PostMapping("/login")
    public Map<String,String> login(
            @RequestBody Map<String,String> request
    ){


        User user = userRepository
                .findByEmail(request.get("email"))
                .orElseThrow(
                        () -> new RuntimeException(
                                "Utilisateur introuvable"
                        )
                );


        if(!passwordEncoder.matches(
                request.get("password"),
                user.getMotDePasse()
        )){

            throw new RuntimeException(
                    "Mot de passe incorrect"
            );
        }


        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        // Utilisation de HashMap au lieu de Map.of() : Map.of() lève une
        // NullPointerException si une des valeurs (ex: role) est null.
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole() != null ? user.getRole() : "CLIENT");

        return response;
    }




    @PostMapping("/send-otp")
    public Map<String,String> sendOtp(
            @RequestBody Map<String,String> request
    ){

        otpService.generateAndSendOtp(
                request.get("email")
        );


        return Map.of(
                "message",
                "Code envoyé"
        );
    }





    @PostMapping("/verify-otp")
    public Map<String,Object> verifyOtp(
            @RequestBody Map<String,String> request
    ){

        boolean valid =
                otpService.verifyOtp(
                        request.get("email"),
                        request.get("code")
                );


        return Map.of(
                "valid",
                valid
        );
    }





    @GetMapping("/check-email")
    public Map<String,Boolean> checkEmail(
            @RequestParam String email
    ){

        boolean exists =
                userRepository.existsByEmail(email);


        return Map.of(
                "exists",
                exists
        );
    }





    private String generateDigits(int length) {

        StringBuilder sb =
                new StringBuilder();


        for(int i = 0; i < length; i++) {

            sb.append(
                    (int)(Math.random() * 10)
            );
        }


        return sb.toString();
    }

}