package com.aswaqbank.controller;

import com.aswaqbank.dto.SaleCreationResponse;
import com.aswaqbank.dto.SaleItemRequest;
import com.aswaqbank.entity.Sale;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.UserRepository;
import com.aswaqbank.service.SaleService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:3000")
public class SaleController {

    private final SaleService saleService;
    private final UserRepository userRepository;

    public SaleController(
            SaleService saleService,
            UserRepository userRepository
    ) {
        this.saleService = saleService;
        this.userRepository = userRepository;
    }

    // =========================================================
    // TEST
    // =========================================================

    @GetMapping("/test")
    public String test() {
        return "SALE CONTROLLER OK";
    }

    // =========================================================
    // CREER UNE VENTE
    // =========================================================

    @PostMapping
    public ResponseEntity<SaleCreationResponse> createSale(
            @RequestBody CreateSaleRequest request,
            Authentication authentication
    ) {

        String merchantEmail = authentication.getName();

        User client = null;

        // Le client reste NULL lors de la création.
        // Il sera identifié lors du paiement.
        if (request.getClientId() != null) {
            client = userRepository.findById(request.getClientId())
                    .orElseThrow(() ->
                            new RuntimeException("Client introuvable")
                    );
        }

        SaleCreationResponse response = saleService.createSale(
                merchantEmail,
                client,
                request.getItems(),
                request.getVoucherCode()
        );

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // RECUPERER UNE VENTE
    // =========================================================

    @GetMapping("/{saleId}")
    public ResponseEntity<Sale> getSale(
            @PathVariable Long saleId
    ) {
        return ResponseEntity.ok(
                saleService.getSaleById(saleId)
        );
    }

    // =========================================================
    // VENTES DU COMMERÇANT
    // =========================================================

    @GetMapping("/merchant")
    public ResponseEntity<List<?>> getMerchantSales(
            Authentication authentication
    ) {

        String merchantEmail = authentication.getName();

        return ResponseEntity.ok(
                saleService.getMerchantSales(merchantEmail)
        );
    }

    // =========================================================
    // VENTES DU CLIENT
    // =========================================================

    @GetMapping("/client")
    public ResponseEntity<List<?>> getClientSales(
            Authentication authentication
    ) {

        String clientEmail = authentication.getName();

        return ResponseEntity.ok(
                saleService.getClientSales(clientEmail)
        );
    }

    // =========================================================
    // ATTACHER UN CLIENT A UNE VENTE
    // =========================================================

    @PutMapping("/{saleId}/client")
    public ResponseEntity<Sale> attachClient(
            @PathVariable Long saleId,
            Authentication authentication
    ) {

        String clientEmail = authentication.getName();

        User client = userRepository
                .findByEmail(clientEmail)
                .orElseThrow(() ->
                        new RuntimeException("Client introuvable")
                );

        return ResponseEntity.ok(
                saleService.attachClientToSale(
                        saleId,
                        client
                )
        );
    }

    // =========================================================
    // CONFIRMER UNE VENTE
    // =========================================================

    @PutMapping("/{saleId}/confirm")
    public ResponseEntity<Sale> confirmSale(
            @PathVariable Long saleId,
            Authentication authentication
    ) {

        String merchantEmail = authentication.getName();

        return ResponseEntity.ok(
                saleService.confirmSale(
                        merchantEmail,
                        saleId
                )
        );
    }

    // =========================================================
    // ANNULER UNE VENTE
    // =========================================================

    @PutMapping("/{saleId}/cancel")
    public ResponseEntity<Sale> cancelSale(
            @PathVariable Long saleId,
            Authentication authentication
    ) {

        String merchantEmail = authentication.getName();

        return ResponseEntity.ok(
                saleService.cancelSale(
                        merchantEmail,
                        saleId
                )
        );
    }

    // =========================================================
    // DTO INTERNE POUR POST /api/sales
    // =========================================================

    public static class CreateSaleRequest {

        private Long clientId;

        private List<SaleItemRequest> items;

        private String voucherCode;

        public CreateSaleRequest() {
        }

        public Long getClientId() {
            return clientId;
        }

        public void setClientId(Long clientId) {
            this.clientId = clientId;
        }

        public List<SaleItemRequest> getItems() {
            return items;
        }

        public void setItems(List<SaleItemRequest> items) {
            this.items = items;
        }

        public String getVoucherCode() {
            return voucherCode;
        }

        public void setVoucherCode(String voucherCode) {
            this.voucherCode = voucherCode;
        }
    }
}