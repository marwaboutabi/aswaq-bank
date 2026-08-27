package com.aswaqbank.service;

import com.aswaqbank.dto.ClientTicketResponse;
import com.aswaqbank.dto.MerchantTicketResponse;
import com.aswaqbank.dto.SaleCreationResponse;
import com.aswaqbank.dto.SaleItemRequest;
import com.aswaqbank.entity.Sale;
import com.aswaqbank.entity.User;

import java.util.List;

public interface SaleService {

    SaleCreationResponse createSale(String merchantEmail, User client, List<SaleItemRequest> items, String voucherCode);

    Sale attachClientToSale(Long saleId, User client);

    Sale confirmSale(String merchantEmail, Long saleId);

    Sale cancelSale(String merchantEmail, Long saleId);

    // ✅ Signature exacte attendue par l'implémentation
    List<MerchantTicketResponse> getMerchantSales(String merchantEmail);

    List<ClientTicketResponse> getClientSales(String clientEmail);

    Sale getSaleById(Long saleId);
}