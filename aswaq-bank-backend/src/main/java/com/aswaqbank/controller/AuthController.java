package com.aswaqbank.controller;

import org.springframework.web.bind.annotation.*;

import com.aswaqbank.entity.User;
import com.aswaqbank.repository.UserRepository;
import com.aswaqbank.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import com.aswaqbank.service.OtpService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

	private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpService otpService;


    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            OtpService otpService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.otpService = otpService;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {

        if(userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }

        user.setMotDePasse(
                passwordEncoder.encode(user.getMotDePasse())
        );

        if(user.getRole() == null){
            String offre = user.getOffre();
            if ("commercant".equals(offre)) {
                user.setRole("COMMERCANT");
            } else if ("fournisseur".equals(offre)) {
                user.setRole("FOURNISSEUR");
            } else {
                user.setRole("CLIENT");
            }
        }

        return userRepository.save(user);
    }


    @PostMapping("/login")
    public Map<String,String> login(
            @RequestBody Map<String,String> request
    ){

        User user = userRepository
                .findByEmail(request.get("email"))
                .orElseThrow(
                    () -> new RuntimeException("Utilisateur introuvable")
                );


        if(!passwordEncoder.matches(
                request.get("password"),
                user.getMotDePasse()
        )){
            throw new RuntimeException("Mot de passe incorrect");
        }


        String token = jwtService.generateToken(
                user.getEmail()
        );


        return Map.of(
                "token", token
        );
    }
    @PostMapping("/send-otp")
    public Map<String,String> sendOtp(@RequestBody Map<String,String> request) {
        otpService.generateAndSendOtp(request.get("email"));
        return Map.of("message", "Code envoyé");
    }

    @PostMapping("/verify-otp")
    public Map<String,Object> verifyOtp(@RequestBody Map<String,String> request) {
        boolean valid = otpService.verifyOtp(request.get("email"), request.get("code"));
        return Map.of("valid", valid);
    }
    @GetMapping("/check-email")
    public Map<String,Boolean> checkEmail(@RequestParam String email) {
        boolean exists = userRepository.existsByEmail(email);
        return Map.of("exists", exists);
    }
}