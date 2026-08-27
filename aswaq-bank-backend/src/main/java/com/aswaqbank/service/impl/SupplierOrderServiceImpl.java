package com.aswaqbank.service.impl;

import com.aswaqbank.dto.*;
import com.aswaqbank.entity.*;
import com.aswaqbank.repository.*;
import com.aswaqbank.service.SupplierOrderService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import com.aswaqbank.service.ProductService;
import com.aswaqbank.service.TransactionService;
import com.aswaqbank.service.NotificationService;
@Service
public class SupplierOrderServiceImpl implements SupplierOrderService {

    private final UserRepository userRepository;
    private final SupplierProductRepository supplierProductRepository;
    private final SupplierOrderRepository supplierOrderRepository;
    private final DeliveryRepository deliveryRepository;
    private final ProductService productService;
    private final MerchantRepository merchantRepository;
    private final BankAccountRepository bankAccountRepository;
    private final TransactionService transactionService;
    private final NotificationService notificationService;
    // Transitions autorisées côté FOURNISSEUR uniquement.
    // LIVREE n'est jamais atteignable via cet endpoint : seul le commerçant
    // peut confirmer la réception (voir confirmReception()).
 // Transitions autorisées côté FOURNISSEUR.
 // Le fournisseur peut confirmer lui-même la livraison (EN_LIVRAISON -> LIVREE).
 private static final Map<SupplierOrderStatus, Set<SupplierOrderStatus>> SUPPLIER_TRANSITIONS = new EnumMap<>(SupplierOrderStatus.class);
 static {
     SUPPLIER_TRANSITIONS.put(SupplierOrderStatus.EN_ATTENTE, EnumSet.of(SupplierOrderStatus.EN_PREPARATION, SupplierOrderStatus.ANNULEE));
     SUPPLIER_TRANSITIONS.put(SupplierOrderStatus.EN_PREPARATION, EnumSet.of(SupplierOrderStatus.EN_LIVRAISON));
     SUPPLIER_TRANSITIONS.put(SupplierOrderStatus.EN_LIVRAISON, EnumSet.of(SupplierOrderStatus.LIVREE));
 }

 public SupplierOrderServiceImpl(UserRepository userRepository,
         SupplierProductRepository supplierProductRepository,
         SupplierOrderRepository supplierOrderRepository,
         DeliveryRepository deliveryRepository,
         ProductService productService,
         MerchantRepository merchantRepository,
         BankAccountRepository bankAccountRepository,
         TransactionService transactionService,
         NotificationService notificationService) {
     this.userRepository = userRepository;
     this.supplierProductRepository = supplierProductRepository;
     this.supplierOrderRepository = supplierOrderRepository;
     this.deliveryRepository = deliveryRepository;
     this.productService = productService;
     this.merchantRepository = merchantRepository;
     this.bankAccountRepository = bankAccountRepository;
     this.transactionService = transactionService;
     this.notificationService = notificationService;
 }
    
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    @Override
    public List<SupplierSummaryResponse> getAvailableSuppliers() {
        return userRepository.findByRole("FOURNISSEUR").stream()
                .filter(u -> u.getSupplier() != null)
                .map(u -> new SupplierSummaryResponse(
                        u.getId(),
                        u.getSupplier().getCompanyName(),
                        u.getSupplier().getActivitySector(),
                        u.getSupplier().getCity(),
                        u.getSupplier().getAddress(),
                        u.getTelephone(),
                        u.getEmail()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<SupplierProductResponse> getSupplierCatalog(Long supplierId) {
        return supplierProductRepository.findBySupplierId(supplierId).stream()
                .map(this::toProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SupplierOrderResponse createOrder(String merchantEmail, SupplierOrderRequest request) {
        User merchant = getUserByEmail(merchantEmail);
        User supplier = userRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Fournisseur introuvable"));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("La commande doit contenir au moins un produit");
        }

        SupplierOrder order = new SupplierOrder();
        order.setMerchant(merchant);
        order.setSupplier(supplier);
        order.setNotes(request.getNotes());

        // Snapshot figé de l'adresse et du téléphone du commerçant au moment de la commande
        order.setMerchantAddress(merchant.getMerchant() != null ? merchant.getMerchant().getAddress() : null);
        order.setMerchantPhone(merchant.getTelephone());

        if (request.getDeliveryDate() != null && !request.getDeliveryDate().isBlank()) {
            order.setDeliveryDate(LocalDate.parse(request.getDeliveryDate()));
        }
        double total = 0.0;
        for (SupplierOrderItemRequest itemReq : request.getItems()) {
            SupplierProduct product = supplierProductRepository.findByIdAndSupplierId(
                            itemReq.getSupplierProductId(), supplier.getId())
                    .orElseThrow(() -> new RuntimeException(
                            "Produit introuvable chez ce fournisseur : " + itemReq.getSupplierProductId()));

            if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                throw new RuntimeException("Quantité invalide pour " + product.getName());
            }

            SupplierOrderItem item = new SupplierOrderItem();
            item.setSupplierProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(product.getPrice());
            item.setOrder(order);
            order.getItems().add(item);

            total += product.getPrice() * itemReq.getQuantity();
        }

        order.setTotalAmount(total);

        SupplierOrder saved = supplierOrderRepository.save(order);
        saved.setReference("CMD-" + String.format("%05d", saved.getId()));
        saved = supplierOrderRepository.save(saved);

        return toOrderResponse(saved);
    }

    @Override
    public List<SupplierOrderResponse> getMerchantOrders(String merchantEmail) {
        User merchant = getUserByEmail(merchantEmail);
        return supplierOrderRepository.findByMerchantIdOrderByOrderDateDesc(merchant.getId())
                .stream().map(this::toOrderResponse).collect(Collectors.toList());
    }

    @Override
    public List<SupplierOrderResponse> getSupplierOrders(String supplierEmail) {
        User supplier = getUserByEmail(supplierEmail);
        return supplierOrderRepository.findBySupplierIdOrderByOrderDateDesc(supplier.getId())
                .stream().map(this::toOrderResponse).collect(Collectors.toList());
    }

    @Override
    public SupplierOrderResponse updateOrderStatus(String supplierEmail, Long orderId, String newStatus) {
        User supplier = getUserByEmail(supplierEmail);
        SupplierOrder order = supplierOrderRepository.findByIdAndSupplierId(orderId, supplier.getId())
                .orElseThrow(() -> new RuntimeException("Commande introuvable ou accès refusé"));

        SupplierOrderStatus target;
        try {
            target = SupplierOrderStatus.valueOf(newStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Statut invalide : " + newStatus);
        }

        Set<SupplierOrderStatus> allowed = SUPPLIER_TRANSITIONS.get(order.getStatus());
        if (allowed == null || !allowed.contains(target)) {
            throw new RuntimeException("Transition non autorisée : " + order.getStatus() + " → " + target);
        }

        // Décrémente le stock une seule fois, au passage en préparation
        if (target == SupplierOrderStatus.EN_PREPARATION && !order.isStockDeducted()) {
            for (SupplierOrderItem item : order.getItems()) {
                SupplierProduct product = item.getSupplierProduct();
                if (product.getStock() < item.getQuantity()) {
                    throw new RuntimeException("Stock insuffisant pour " + product.getName());
                }
                product.setStock(product.getStock() - item.getQuantity());
                supplierProductRepository.save(product);
            }
            order.setStockDeducted(true);

            // Crée la fiche de livraison associée (une seule fois)
            if (deliveryRepository.findByOrderId(order.getId()).isEmpty()) {
                Delivery delivery = new Delivery();
                delivery.setOrder(order);
                delivery.setExpeditionDate(order.getDeliveryDate()); // date saisie par le commerçant à la commande
                deliveryRepository.save(delivery);
            }
        }

        // Ajoute le stock chez le commerçant, une seule fois, dès que la commande passe LIVREE
        if (target == SupplierOrderStatus.LIVREE) {
            addDeliveredStockToMerchant(order);
        }

        order.setStatus(target);
        SupplierOrder saved = supplierOrderRepository.save(order);
        return toOrderResponse(saved);
    }

    @Override
    public SupplierOrderResponse confirmReception(String merchantEmail, Long orderId) {
        User merchant = getUserByEmail(merchantEmail);
        SupplierOrder order = supplierOrderRepository.findByIdAndMerchantId(orderId, merchant.getId())
                .orElseThrow(() -> new RuntimeException("Commande introuvable ou accès refusé"));
        
        if (order.getStatus() != SupplierOrderStatus.EN_LIVRAISON) {
            throw new RuntimeException("La commande doit être en livraison pour confirmer la réception");
        
        }

        addDeliveredStockToMerchant(order);
        order.setStatus(SupplierOrderStatus.LIVREE);
        SupplierOrder saved = supplierOrderRepository.save(order);
        return toOrderResponse(saved);
    }

    @Override
    public SupplierOrderResponse payOrder(String merchantEmail, Long orderId) {
        User merchant = getUserByEmail(merchantEmail);
        SupplierOrder order = supplierOrderRepository.findByIdAndMerchantId(orderId, merchant.getId())
                .orElseThrow(() -> new RuntimeException("Commande introuvable ou accès refusé"));

        if (order.getStatus() != SupplierOrderStatus.LIVREE) {
            throw new RuntimeException("La commande doit être livrée avant d'être payée");
        }
        if (order.getPaymentStatus() == SupplierOrderPaymentStatus.PAID) {
            throw new RuntimeException("Cette commande est déjà payée");
        }
        if (order.getTotalAmount() == null || order.getTotalAmount() <= 0) {
            throw new RuntimeException("Montant de commande invalide");
        }

        BankAccount merchantAccount = bankAccountRepository.findByUserEmail(merchantEmail)
                .orElseThrow(() -> new RuntimeException("Compte bancaire du commerçant introuvable"));
        BankAccount supplierAccount = bankAccountRepository.findByUserEmail(order.getSupplier().getEmail())
                .orElseThrow(() -> new RuntimeException("Compte bancaire du fournisseur introuvable"));

        BigDecimal amount = BigDecimal.valueOf(order.getTotalAmount());

        // Réutilise le système de paiement existant : débit commerçant / crédit fournisseur,
        // transaction bancaire enregistrée, tout géré de façon atomique par cette méthode.
        transactionService.qrPayment(
                merchantAccount.getAccountNumber(),
                supplierAccount.getRib(),
                amount,
                "Paiement commande fournisseur " + order.getReference()
        );

        order.setPaymentStatus(SupplierOrderPaymentStatus.PAID);
        order.setPaidAt(LocalDateTime.now());
        SupplierOrder saved = supplierOrderRepository.save(order);

        notifyOrderPaid(saved, amount);

        return toOrderResponse(saved);
    }

    private void notifyOrderPaid(SupplierOrder order, BigDecimal amount) {
        Map<String, Object> merchantDetails = new LinkedHashMap<>();
        merchantDetails.put("reference", order.getReference());
        merchantDetails.put("amount", amount + " MAD");
        notificationService.notify(order.getMerchant(), NotificationType.PAYMENT, "Commande payée",
                "Votre paiement de " + amount + " MAD pour la commande " + order.getReference() + " a été effectué avec succès.",
                merchantDetails, "Voir la commande", "/fournisseurs");

        Map<String, Object> supplierDetails = new LinkedHashMap<>();
        supplierDetails.put("reference", order.getReference());
        supplierDetails.put("amount", amount + " MAD");
        notificationService.notify(order.getSupplier(), NotificationType.SUPPLIER, "Commande payée par le commerçant",
                "Le commerçant a payé la commande " + order.getReference() + " d'un montant de " + amount + " MAD.",
                supplierDetails, "Voir la commande", "/commandes-fournisseur");
    }

    private SupplierProductResponse toProductResponse(SupplierProduct p) {
        SupplierProductResponse res = new SupplierProductResponse();
        res.setId(p.getId());
        res.setName(p.getName());
        res.setDescription(p.getDescription());
        res.setCategory(p.getCategory());
        res.setPrice(p.getPrice());
        res.setStock(p.getStock());
        res.setSku(p.getSku());
        res.setUpdatedAt(p.getUpdatedAt());
        res.setAvailability(p.getStock() == 0 ? "Rupture" : p.getStock() <= 10 ? "Stock faible" : "Disponible");
        return res;
    }
    private void addDeliveredStockToMerchant(SupplierOrder order) {
        if (order.isMerchantStockAdded()) {
            return; // déjà fait, on ne le refait pas
        }

        Merchant merchant = merchantRepository.findByUserId(order.getMerchant().getId())
                .orElse(null);
        if (merchant == null) {
            return; // sécurité : pas de fiche Merchant, on n'ajoute rien
        }

        for (SupplierOrderItem item : order.getItems()) {
            productService.addStockFromSupplierDelivery(
                    merchant,
                    item.getSupplierProduct(),
                    item.getQuantity()
            );
        }

        order.setMerchantStockAdded(true);
    }
    private SupplierOrderResponse toOrderResponse(SupplierOrder o) {
        SupplierOrderResponse res = new SupplierOrderResponse();
        res.setId(o.getId());
        res.setReference(o.getReference());
        res.setSupplierId(o.getSupplier().getId());
        res.setSupplierName(o.getSupplier().getSupplier() != null ? o.getSupplier().getSupplier().getCompanyName() : o.getSupplier().getNom());
        res.setMerchantName(o.getMerchant().getNom() + " " + o.getMerchant().getPrenom());
        res.setMerchantPhone(o.getMerchantPhone());
        res.setMerchantAddress(o.getMerchantAddress());
        res.setStatus(o.getStatus().name());
        res.setOrderDate(o.getOrderDate());
        res.setDeliveryDate(o.getDeliveryDate());
        res.setNotes(o.getNotes());
        res.setTotalAmount(o.getTotalAmount());
        res.setPaymentStatus(o.getPaymentStatus() != null ? o.getPaymentStatus().name() : SupplierOrderPaymentStatus.UNPAID.name());
        res.setPaidAt(o.getPaidAt());
        res.setItems(o.getItems().stream().map(item -> {
            SupplierOrderItemResponse itemRes = new SupplierOrderItemResponse();
            itemRes.setId(item.getId());
            itemRes.setSupplierProductId(item.getSupplierProduct().getId());
            itemRes.setProductName(item.getSupplierProduct().getName());
            itemRes.setSku(item.getSupplierProduct().getSku());
            itemRes.setQuantity(item.getQuantity());
            itemRes.setUnitPrice(item.getUnitPrice());
            itemRes.setSubtotal(item.getUnitPrice() * item.getQuantity());
            return itemRes;
        }).collect(Collectors.toList()));
        return res;
        
    }
}