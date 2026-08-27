package com.aswaqbank.service.impl;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.aswaqbank.dto.ProductRequest;
import com.aswaqbank.dto.ProductResponse;
import com.aswaqbank.entity.Merchant;
import com.aswaqbank.entity.NotificationType;
import com.aswaqbank.entity.Product;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.MerchantRepository;
import com.aswaqbank.repository.ProductRepository;
import com.aswaqbank.service.NotificationService;
import com.aswaqbank.service.ProductService;
import org.springframework.stereotype.Service;
import com.aswaqbank.entity.SupplierProduct;
@Service
public class ProductServiceImpl implements ProductService {

    // Seuil en dessous duquel on considère le stock "faible"
    // (même valeur que dans SaleServiceImpl — ajuste les deux si tu changes le seuil)
    private static final int LOW_STOCK_THRESHOLD = 5;

    private final ProductRepository productRepository;
    private final MerchantRepository merchantRepository;
    private final NotificationService notificationService; // ← ajouté

    public ProductServiceImpl(ProductRepository productRepository,
                              MerchantRepository merchantRepository,
                              NotificationService notificationService) { // ← ajouté
        this.productRepository = productRepository;
        this.merchantRepository = merchantRepository;
        this.notificationService = notificationService; // ← ajouté
    }
    @Override
    public ProductResponse createProduct(Long userId, ProductRequest request) {

        Merchant merchant = merchantRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Commerçant introuvable"));

        Product product = new Product();

        product.setName(request.getName());
        product.setCode(generateProductCode(request.getCategory()));
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock() == null ? 0 : request.getStock());
        product.setDescription(request.getDescription());

        product.setMerchant(merchant);

        Product savedProduct = productRepository.save(product);

        ProductResponse response = new ProductResponse();
        response.setId(savedProduct.getId());
        response.setName(savedProduct.getName());
        response.setCode(savedProduct.getCode());
        response.setCategory(savedProduct.getCategory());
        response.setPrice(savedProduct.getPrice());
        response.setDescription(savedProduct.getDescription());
        response.setStock(savedProduct.getStock());
        response.setCreatedAt(savedProduct.getCreatedAt());
        return response;
    }
    @Override
    public void addStockFromSupplierDelivery(Merchant merchant, SupplierProduct supplierProduct, int quantity) {
        Optional<Product> existing = productRepository
                .findBySupplierProductIdAndMerchantId(supplierProduct.getId(), merchant.getId());

        if (existing.isPresent()) {
            Product product = existing.get();
            product.setStock(product.getStock() + quantity);
            productRepository.save(product);
        } else {
            Product product = new Product();
            product.setName(supplierProduct.getName());
            product.setCategory(supplierProduct.getCategory());
            product.setCode(generateProductCode(supplierProduct.getCategory()));
            product.setPrice(java.math.BigDecimal.valueOf(supplierProduct.getPrice()));
            product.setDescription(supplierProduct.getDescription());
            product.setStock(quantity);
            product.setMerchant(merchant);
            product.setSupplierProductId(supplierProduct.getId());
            productRepository.save(product);
        }
    }
    @Override
    public List<ProductResponse> getMerchantProducts(Long userId) {

        Merchant merchant = merchantRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Commerçant introuvable"));

        return productRepository.findByMerchantId(merchant.getId())
                .stream()
                .map(product -> {
                    ProductResponse response = new ProductResponse();

                    response.setId(product.getId());
                    response.setName(product.getName());
                    response.setCode(product.getCode());
                    response.setCategory(product.getCategory());
                    response.setPrice(product.getPrice());
                    response.setDescription(product.getDescription());
                    response.setStock(product.getStock());
                    response.setCreatedAt(product.getCreatedAt());
                    return response;
                })
                .toList();
    }

    @Override
    public ProductResponse updateProduct(Long productId, Long userId, ProductRequest request) {

        Merchant merchant = merchantRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Commerçant introuvable"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));

        if (!product.getMerchant().getId().equals(merchant.getId())) {
            throw new RuntimeException("Accès refusé");
        }

        product.setName(request.getName());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());

        product.setDescription(request.getDescription());

        Product updated = productRepository.save(product);

        // ← AJOUTÉ : notification stock bas / rupture pour le commerçant
        notifyIfLowStock(merchant, updated);

        ProductResponse response = new ProductResponse();
        response.setId(updated.getId());
        response.setName(updated.getName());
        response.setCode(updated.getCode());
        response.setCategory(updated.getCategory());
        response.setPrice(updated.getPrice());
        response.setDescription(updated.getDescription());
        response.setStock(updated.getStock());

        response.setCreatedAt(updated.getCreatedAt());
        return response;
    }

    @Override
    public void deleteProduct(Long productId, Long userId) {

        Merchant merchant = merchantRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Commerçant introuvable"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));

        if (!product.getMerchant().getId().equals(merchant.getId())) {
            throw new RuntimeException("Accès refusé");
        }

        productRepository.delete(product);
    }

    @Override
    public ProductResponse getProductById(Long productId, Long userId) {

        Merchant merchant = merchantRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Commerçant introuvable"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));

        if (!product.getMerchant().getId().equals(merchant.getId())) {
            throw new RuntimeException("Accès refusé");
        }

        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setCode(product.getCode());
        response.setCategory(product.getCategory());
        response.setPrice(product.getPrice());
        response.setDescription(product.getDescription());
        response.setCreatedAt(product.getCreatedAt());
        return response;
    }
    private String getPrefix(String category) {

        return switch (category) {
            case "Boissons" -> "BOI";
            case "Épicerie" -> "EPI";
            case "Produits laitiers" -> "LAI";
            case "Fruits & Légumes" -> "FRU";
            case "Viandes & Volailles" -> "VIA";
            case "Poissons & Fruits de mer" -> "POI";
            case "Boulangerie" -> "BOU";
            case "Pâtisserie" -> "PAT";
            case "Surgelés" -> "SUR";
            case "Conserves" -> "CON";
            case "Snacks" -> "SNK";
            case "Confiserie" -> "CNF";
            case "Hygiène" -> "HYG";
            case "Beauté & Cosmétiques" -> "BEA";
            case "Entretien de la maison" -> "ENT";
            case "Bébé" -> "BEB";
            case "Animalerie" -> "ANI";
            case "Maison & Cuisine" -> "MSC";
            case "Électronique" -> "ELE";
            case "Papeterie" -> "PAP";
            case "Jouets" -> "JOU";
            case "Vêtements" -> "VET";
            case "Chaussures" -> "CHA";
            case "Sport & Loisirs" -> "SPO";
            case "Bricolage" -> "BRI";
            case "Jardinage" -> "JAR";
            case "Automobile" -> "AUT";
            case "Santé & Parapharmacie" -> "SAN";
            default -> "PRD";
        };
    }

    private String generateProductCode(String category) {

        String prefix = getPrefix(category);

        Optional<Product> lastProduct =
                productRepository.findTopByCodeStartingWithOrderByCodeDesc(prefix);

        int nextNumber = 1;

        if (lastProduct.isPresent()) {

            String lastCode = lastProduct.get().getCode();

            String number = lastCode.substring(prefix.length());

            nextNumber = Integer.parseInt(number) + 1;
        }

        return prefix + String.format("%06d", nextNumber);
    }

    // =========================================================
    // NOTIFICATIONS (ajouté) — n'affecte aucune logique produit,
    // se contente d'informer le commerçant.
    // =========================================================

    private void notifyIfLowStock(Merchant merchant, Product product) {
        Integer stock = product.getStock();
        if (stock == null || stock > LOW_STOCK_THRESHOLD) {
            return; // stock encore confortable, rien à signaler
        }

        User recipient = merchant.getUser();
        if (recipient == null) {
            return;
        }

        Map<String, Object> details = new LinkedHashMap<>();
        details.put("productName", product.getName());
        details.put("currentStock", stock + " unités");

        if (stock <= 0) {
            notificationService.notify(
                    recipient,
                    NotificationType.STOCK,
                    "Produit en rupture de stock",
                    "Le produit \"" + product.getName() + "\" est maintenant en rupture de stock.",
                    details,
                    "Réapprovisionner", "/produits/" + product.getId()
            );
        } else {
            notificationService.notify(
                    recipient,
                    NotificationType.STOCK,
                    "Stock faible",
                    "Le produit \"" + product.getName() + "\" a un stock critique (" + stock + " unités).",
                    details,
                    "Voir le produit", "/produits/" + product.getId()
            );
        }
    }

}