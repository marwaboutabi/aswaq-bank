package com.aswaqbank.service.impl;

import com.aswaqbank.dto.DeliveryResponse;
import com.aswaqbank.dto.DeliveryUpdateRequest;
import com.aswaqbank.dto.SupplierOrderItemResponse;
import com.aswaqbank.entity.Delivery;
import com.aswaqbank.entity.SupplierOrder;
import com.aswaqbank.entity.SupplierOrderItem;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.DeliveryRepository;
import com.aswaqbank.repository.UserRepository;
import com.aswaqbank.service.DeliveryService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeliveryServiceImpl implements DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final UserRepository userRepository;

    public DeliveryServiceImpl(DeliveryRepository deliveryRepository, UserRepository userRepository) {
        this.deliveryRepository = deliveryRepository;
        this.userRepository = userRepository;
    }

    private User getSupplier(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    @Override
    public List<DeliveryResponse> getSupplierDeliveries(String supplierEmail) {
        User supplier = getSupplier(supplierEmail);
        return deliveryRepository.findByOrder_Supplier_IdOrderByOrder_OrderDateDesc(supplier.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public DeliveryResponse updateDeliveryInfo(String supplierEmail, Long orderId, DeliveryUpdateRequest request) {
        User supplier = getSupplier(supplierEmail);
        Delivery delivery = deliveryRepository.findByOrderIdAndOrder_Supplier_Id(orderId, supplier.getId())
                .orElseThrow(() -> new RuntimeException("Livraison introuvable pour cette commande"));

        if (request.getTransporteur() != null) delivery.setTransporteur(request.getTransporteur());
        if (request.getVehicule() != null) delivery.setVehicule(request.getVehicule());
        if (request.getChauffeur() != null) delivery.setChauffeur(request.getChauffeur());
        if (request.getTrackingNumber() != null) delivery.setTrackingNumber(request.getTrackingNumber());
        // expeditionDate n'est plus modifiable ici : elle vient de la date saisie par
        // le commerçant à la commande (copiée automatiquement à la création de la livraison
        // dans SupplierOrderServiceImpl.updateOrderStatus)
        if (request.getEstimatedDeliveryDate() != null && !request.getEstimatedDeliveryDate().isBlank()) {
            delivery.setEstimatedDeliveryDate(LocalDate.parse(request.getEstimatedDeliveryDate()));
        }

        return toResponse(deliveryRepository.save(delivery));
    }

    private DeliveryResponse toResponse(Delivery d) {
        SupplierOrder order = d.getOrder();
        User merchant = order.getMerchant();

        DeliveryResponse res = new DeliveryResponse();
        res.setId(d.getId());
        res.setOrderId(order.getId());
        res.setOrderReference(order.getReference());
        res.setStatus(order.getStatus().name());
        res.setMerchantName(merchant.getNom() + " " + merchant.getPrenom());
        res.setMerchantPhone(merchant.getTelephone());

        String address = null;
        if (merchant.getMerchant() != null) {
            String a = merchant.getMerchant().getAddress();
            String c = merchant.getMerchant().getCity();
            address = (a != null ? a : "") + (a != null && c != null ? ", " : "") + (c != null ? c : "");
            if (address.isBlank()) address = null;
        }
        res.setMerchantAddress(address);

        res.setTransporteur(d.getTransporteur());
        res.setVehicule(d.getVehicule());
        res.setChauffeur(d.getChauffeur());
        res.setTrackingNumber(d.getTrackingNumber());
        res.setExpeditionDate(d.getExpeditionDate());
        res.setEstimatedDeliveryDate(d.getEstimatedDeliveryDate());

        res.setItems(order.getItems().stream().map(item -> {
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