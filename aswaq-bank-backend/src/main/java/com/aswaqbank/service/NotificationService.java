package com.aswaqbank.service;

import com.aswaqbank.dto.NotificationResponse;
import com.aswaqbank.entity.NotificationType;
import com.aswaqbank.entity.User;

import java.util.List;
import java.util.Map;

public interface NotificationService {

    // ---- Consultation (utilisées par le contrôleur, pour l'utilisateur connecté) ----

    List<NotificationResponse> getForCurrentUser(NotificationType typeFilter);

    long getUnreadCountForCurrentUser();

    NotificationResponse markAsRead(Long notificationId);

    void markAllAsReadForCurrentUser();

    // ---- Création (à appeler depuis les AUTRES services métier : SaleService, -----
    // ---- ProductService, TransactionService, etc. — jamais depuis le frontend) -----
    //
    // Exemple d'utilisation dans SaleServiceImpl :
    //   notificationService.notify(merchant.getUser(), NotificationType.ORDERS,
    //       "Nouvelle commande reçue",
    //       "Commande #" + sale.getReference() + " de " + client.getNom() + " - " + sale.getTotal() + " MAD.",
    //       Map.of("customer", client.getNom(), "items", items.size() + " articles", "total", sale.getTotal() + " MAD"),
    //       "Voir la commande", "/produits/" + sale.getId());

    void notify(User recipient, NotificationType type, String title, String description,
                Map<String, Object> details, String linkLabel, String linkTo);
}