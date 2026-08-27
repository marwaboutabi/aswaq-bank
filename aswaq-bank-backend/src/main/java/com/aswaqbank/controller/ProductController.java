package com.aswaqbank.controller;

import com.aswaqbank.dto.ProductRequest;
import com.aswaqbank.dto.ProductResponse;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.UserRepository;
import com.aswaqbank.service.ProductService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService productService;
    private final UserRepository userRepository;

    public ProductController(ProductService productService,
                             UserRepository userRepository) {
        this.productService = productService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ProductResponse createProduct(
            Authentication authentication,
            @RequestBody ProductRequest request) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        return productService.createProduct(user.getId(), request);
    }

    @GetMapping
    public List<ProductResponse> getProducts(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        return productService.getMerchantProducts(user.getId());
    }

    @GetMapping("/{id}")
    public ProductResponse getProduct(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        return productService.getProductById(id, user.getId());
    }

    @PutMapping("/{id}")
    public ProductResponse updateProduct(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody ProductRequest request) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        return productService.updateProduct(id, user.getId(), request);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        productService.deleteProduct(id, user.getId());
    }
}