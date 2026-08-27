package com.aswaqbank.service.impl;

import com.aswaqbank.dto.ClientTicketResponse;
import com.aswaqbank.dto.MerchantTicketResponse;
import com.aswaqbank.dto.SaleCreationResponse;
import com.aswaqbank.dto.SaleItemRequest;
import com.aswaqbank.entity.LoyaltyReward;
import com.aswaqbank.entity.LoyaltyRewardStatus;
import com.aswaqbank.entity.Merchant;
import com.aswaqbank.entity.NotificationType;
import com.aswaqbank.entity.PaymentRequest;
import com.aswaqbank.entity.Product;
import com.aswaqbank.entity.Sale;
import com.aswaqbank.entity.SaleItem;
import com.aswaqbank.entity.SaleStatus;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.LoyaltyRewardRepository;
import com.aswaqbank.repository.MerchantRepository;
import com.aswaqbank.repository.ProductRepository;
import com.aswaqbank.repository.SaleRepository;
import com.aswaqbank.repository.UserRepository;
import com.aswaqbank.service.NotificationService;
import com.aswaqbank.service.PaymentRequestService;
import com.aswaqbank.service.SaleService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SaleServiceImpl implements SaleService {

    private static final int LOW_STOCK_THRESHOLD = 5;

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final MerchantRepository merchantRepository;
    private final UserRepository userRepository;
    private final LoyaltyRewardRepository loyaltyRewardRepository;
    private final PaymentRequestService paymentRequestService;
    private final NotificationService notificationService;

    public SaleServiceImpl(
            SaleRepository saleRepository,
            ProductRepository productRepository,
            MerchantRepository merchantRepository,
            UserRepository userRepository,
            LoyaltyRewardRepository loyaltyRewardRepository,
            PaymentRequestService paymentRequestService,
            NotificationService notificationService
    ) {
        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
        this.merchantRepository = merchantRepository;
        this.userRepository = userRepository;
        this.loyaltyRewardRepository = loyaltyRewardRepository;
        this.paymentRequestService = paymentRequestService;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public SaleCreationResponse createSale(
            String merchantEmail,
            User client,
            List<SaleItemRequest> items,
            String voucherCode
    ) {
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("La vente doit contenir au moins un produit");
        }

        Merchant merchant = merchantRepository
                .findByUserEmail(merchantEmail)
                .orElseThrow(() -> new RuntimeException("Commerçant introuvable"));

        Sale sale = new Sale();
        sale.setMerchant(merchant);
        // Le client peut être null lors de la création initiale
        sale.setClient(client);
        sale.setStatus(SaleStatus.PENDING);
        sale.setPaidAmount(BigDecimal.ZERO);

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (SaleItemRequest request : items) {
            if (request == null || request.getProductId() == null) {
                throw new IllegalArgumentException("Produit invalide");
            }

            Integer quantity = request.getQuantity();
            if (quantity == null || quantity <= 0) {
                throw new IllegalArgumentException("La quantité doit être supérieure à zéro");
            }

            Product product = productRepository
                    .findById(request.getProductId())
                    .orElseThrow(() -> new RuntimeException("Produit introuvable : " + request.getProductId()));

            if (product.getMerchant() == null || !product.getMerchant().getId().equals(merchant.getId())) {
                throw new RuntimeException("Ce produit n'appartient pas à ce commerçant");
            }

            Integer stock = product.getStock();
            if (stock == null || stock < quantity) {
                throw new RuntimeException("Stock insuffisant pour le produit : " + product.getName());
            }

            if (product.getPrice() == null) {
                throw new RuntimeException("Prix invalide pour le produit : " + product.getName());
            }

            SaleItem saleItem = new SaleItem();
            saleItem.setProduct(product);
            saleItem.setQuantity(quantity);
            saleItem.setUnitPrice(product.getPrice());
            sale.addItem(saleItem);

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));
            totalAmount = totalAmount.add(itemTotal);
        }

        sale.setTotalAmount(totalAmount);

        BigDecimal voucherAmount = BigDecimal.ZERO;
        if (voucherCode != null && !voucherCode.isBlank()) {
            if (client == null) {
                throw new RuntimeException("Un client est obligatoire pour utiliser un bon");
            }

            LoyaltyReward reward = loyaltyRewardRepository
                    .findByCodeIgnoreCase(voucherCode)
                    .orElseThrow(() -> new RuntimeException("Bon d'achat introuvable"));

            if (reward.getClient() == null || !reward.getClient().getId().equals(client.getId())) {
                throw new RuntimeException("Ce bon n'appartient pas à ce client");
            }

            if (reward.getStatus() != LoyaltyRewardStatus.AVAILABLE) {
                throw new RuntimeException("Ce bon d'achat n'est plus disponible");
            }

            if (reward.getRewardAmount() == null || reward.getRewardAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Montant du bon invalide");
            }

            voucherAmount = reward.getRewardAmount().min(totalAmount);
            sale.setVoucherCode(reward.getCode());
        }

        sale.setVoucherAmount(voucherAmount);
        sale.setPaidAmount(BigDecimal.ZERO);

        Sale savedSale = saleRepository.save(sale);

        // ✅ CRÉATION DU PAYMENT REQUEST AVEC RÉFÉRENCE
        PaymentRequest paymentRequest = paymentRequestService
                .createPaymentRequestForSale(merchantEmail, savedSale);

        if (paymentRequest == null) {
            throw new RuntimeException(
                    "La demande de paiement n'a pas été créée pour la vente #"
                            + savedSale.getId()
            );
        }

        if (paymentRequest.getReference() == null
                || paymentRequest.getReference().isBlank()) {

            throw new RuntimeException(
                    "La demande de paiement a été créée sans référence pour la vente #"
                            + savedSale.getId()
            );
        }

        // ✅ LOGS DE VÉRIFICATION TEMPORAIRES
        System.out.println("=== PAYMENT REQUEST CRÉÉE ===");
        System.out.println("ID : " + paymentRequest.getId());
        System.out.println("REFERENCE : " + paymentRequest.getReference());
        System.out.println("=============================");

        return new SaleCreationResponse(
                savedSale.getId(),
                paymentRequest.getReference(),
                savedSale.getTotalAmount()
        );    }

    @Transactional
    public Sale attachClientToSale(Long saleId, User client) {
        if (saleId == null) throw new IllegalArgumentException("Identifiant de vente invalide");
        if (client == null) throw new IllegalArgumentException("Client invalide");

        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Vente introuvable"));

        if (sale.getClient() != null && !sale.getClient().getId().equals(client.getId())) {
            throw new RuntimeException("Cette vente est déjà associée à un autre client");
        }

        sale.setClient(client);
        return saleRepository.save(sale);
    }

    @Override
    @Transactional
    public Sale confirmSale(String merchantEmail, Long saleId) {
        if (saleId == null) throw new IllegalArgumentException("Identifiant de vente invalide");

        Merchant merchant = merchantRepository.findByUserEmail(merchantEmail)
                .orElseThrow(() -> new RuntimeException("Commerçant introuvable"));

        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Vente introuvable"));

        if (sale.getMerchant() == null || !sale.getMerchant().getId().equals(merchant.getId())) {
            throw new RuntimeException("Cette vente n'appartient pas à ce commerçant");
        }

        // IMPORTANT : Si déjà payé via QR, on ne fait rien (pas de double stock/bon)
        if (sale.getStatus() == SaleStatus.PAID) {
            return sale;
        }

        if (sale.getStatus() != SaleStatus.PENDING) {
            throw new RuntimeException("Cette vente ne peut plus être confirmée");
        }

        // NOTE : La gestion du STOCK et des BONS a été SUPPRIMÉE ici.
        // Elle est exclusivement gérée dans TransactionServiceImpl.qrPayment()

        sale.setStatus(SaleStatus.PAID);
        Sale confirmedSale = saleRepository.save(sale);

        notifyOrderConfirmed(merchant, confirmedSale);
        return confirmedSale;
    }

    @Override
    @Transactional
    public Sale cancelSale(String merchantEmail, Long saleId) {
        if (saleId == null) throw new IllegalArgumentException("Identifiant de vente invalide");

        Merchant merchant = merchantRepository.findByUserEmail(merchantEmail)
                .orElseThrow(() -> new RuntimeException("Commerçant introuvable"));

        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Vente introuvable"));

        if (sale.getMerchant() == null || !sale.getMerchant().getId().equals(merchant.getId())) {
            throw new RuntimeException("Cette vente n'appartient pas à ce commerçant");
        }

        if (sale.getStatus() != SaleStatus.PENDING) {
            throw new RuntimeException("Cette vente ne peut plus être annulée");
        }

        sale.setStatus(SaleStatus.CANCELLED);
        return saleRepository.save(sale);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MerchantTicketResponse> getMerchantSales(String merchantEmail) {
        Merchant merchant = merchantRepository
                .findByUserEmail(merchantEmail)
                .orElseThrow(() -> new RuntimeException("Commerçant introuvable"));

        List<Sale> sales = saleRepository.findByMerchantOrderByCreatedAtDesc(merchant);

        return sales.stream().map(sale -> {
            MerchantTicketResponse dto = new MerchantTicketResponse();
            dto.setId(sale.getId());
            dto.setTotalAmount(sale.getTotalAmount());
            dto.setVoucherAmount(sale.getVoucherAmount());
            dto.setVoucherCode(sale.getVoucherCode());
            dto.setPaidAmount(sale.getPaidAmount());
            dto.setStatus(sale.getStatus() != null ? sale.getStatus().name() : null);
            dto.setCreatedAt(sale.getCreatedAt());

            if (sale.getClient() != null) {
                dto.setClient(new MerchantTicketResponse.ClientInfo(
                        sale.getClient().getId(),
                        sale.getClient().getPrenom(),
                        sale.getClient().getNom(),
                        sale.getClient().getEmail()
                ));
            }

            List<MerchantTicketResponse.ItemInfo> items = sale.getItems().stream()
                    .map(item -> {
                        Product p = item.getProduct();
                        return new MerchantTicketResponse.ItemInfo(
                                item.getId(),
                                p != null ? p.getId() : null,
                                p != null ? p.getName() : null,
                                item.getQuantity(),
                                item.getUnitPrice()
                        );
                    })
                    .collect(Collectors.toList());

            dto.setItems(items);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientTicketResponse> getClientSales(String clientEmail) {
        User client = userRepository.findByEmail(clientEmail)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        List<Sale> sales = saleRepository.findByClientOrderByCreatedAtDesc(client);

        return sales.stream().map(sale -> {
            ClientTicketResponse response = new ClientTicketResponse();
            response.setId(sale.getId());
            response.setTotalAmount(sale.getTotalAmount());
            response.setVoucherAmount(sale.getVoucherAmount());
            response.setVoucherCode(sale.getVoucherCode());
            response.setPaidAmount(sale.getPaidAmount());
            response.setStatus(sale.getStatus() != null ? sale.getStatus().name() : null);
            response.setCreatedAt(sale.getCreatedAt());

            Merchant merchant = sale.getMerchant();
            if (merchant != null) {
                response.setMerchant(new ClientTicketResponse.MerchantInfo(
                        merchant.getId(), merchant.getCompanyName(), merchant.getAddress(), merchant.getCity()));
            }

            List<ClientTicketResponse.ItemInfo> itemInfos = sale.getItems().stream().map(item -> {
                Product product = item.getProduct();
                ClientTicketResponse.ProductInfo productInfo = null;
                if (product != null) {
                    productInfo = new ClientTicketResponse.ProductInfo(product.getId(), product.getName());
                }
                return new ClientTicketResponse.ItemInfo(item.getId(), productInfo, item.getQuantity(), item.getUnitPrice());
            }).collect(Collectors.toList());

            response.setItems(itemInfos);
            return response;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Sale getSaleById(Long saleId) {
        if (saleId == null) throw new IllegalArgumentException("Identifiant de vente invalide");
        return saleRepository.findById(saleId).orElseThrow(() -> new RuntimeException("Vente introuvable"));
    }

    private void notifyIfLowStock(Merchant merchant, Product product, int newStock) {
        if (newStock > LOW_STOCK_THRESHOLD) return;
        User recipient = merchant.getUser();
        if (recipient == null) return;

        Map<String, Object> details = new LinkedHashMap<>();
        details.put("productName", product.getName());
        details.put("currentStock", newStock + " unités");

        if (newStock <= 0) {
            notificationService.notify(recipient, NotificationType.STOCK, "Produit en rupture de stock",
                    "Le produit \"" + product.getName() + "\" est maintenant en rupture de stock.",
                    details, "Réapprovisionner", "/produits/" + product.getId());
        } else {
            notificationService.notify(recipient, NotificationType.STOCK, "Stock faible",
                    "Le produit \"" + product.getName() + "\" a un stock critique (" + newStock + " unités).",
                    details, "Voir le produit", "/produits/" + product.getId());
        }
    }

    private void notifyOrderConfirmed(Merchant merchant, Sale sale) {
        User recipient = merchant.getUser();
        if (recipient == null) return;

        String clientName = sale.getClient() != null 
                ? (sale.getClient().getPrenom() + " " + sale.getClient().getNom()) 
                : "Client";

        Map<String, Object> details = new LinkedHashMap<>();
        details.put("customer", clientName);
        details.put("items", sale.getItems().size() + " article(s)");
        details.put("total", sale.getTotalAmount() + " MAD");

        notificationService.notify(recipient, NotificationType.ORDERS, "Nouvelle commande reçue",
                "Commande #" + sale.getId() + " de " + clientName + " - " + sale.getTotalAmount() + " MAD.",
                details, "Voir la commande", "/produits/" + sale.getId());
    }
}