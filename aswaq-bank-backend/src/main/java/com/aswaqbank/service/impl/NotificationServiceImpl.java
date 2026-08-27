package com.aswaqbank.service.impl;

import com.aswaqbank.dto.NotificationResponse;
import com.aswaqbank.entity.Notification;
import com.aswaqbank.entity.NotificationType;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.NotificationRepository;
import com.aswaqbank.repository.UserRepository;
import com.aswaqbank.service.NotificationService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository,
                                    UserRepository userRepository,
                                    ObjectMapper objectMapper) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    @Override
    public List<NotificationResponse> getForCurrentUser(NotificationType typeFilter) {
        User user = getCurrentUser();
        List<Notification> notifications = (typeFilter == null)
                ? notificationRepository.findByUserOrderByCreatedAtDesc(user)
                : notificationRepository.findByUserAndTypeOrderByCreatedAtDesc(user, typeFilter);

        List<NotificationResponse> responses = new ArrayList<>();
        for (Notification n : notifications) {
            responses.add(toResponse(n));
        }
        return responses;
    }

    @Override
    public long getUnreadCountForCurrentUser() {
        return notificationRepository.countByUserAndReadFalse(getCurrentUser());
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(Long notificationId) {
        User user = getCurrentUser();
        Notification notification = notificationRepository.findByIdAndUser(notificationId, user)
                .orElseThrow(() -> new RuntimeException("Notification introuvable"));
        notification.setRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    @Override
    @Transactional
    public void markAllAsReadForCurrentUser() {
        notificationRepository.markAllAsReadForUser(getCurrentUser());
    }

    @Override
    @Transactional
    public void notify(User recipient, NotificationType type, String title, String description,
                        Map<String, Object> details, String linkLabel, String linkTo) {
        Notification notification = new Notification();
        notification.setUser(recipient);
        notification.setType(type);
        notification.setTitle(title);
        notification.setDescription(description);
        notification.setLinkLabel(linkLabel);
        notification.setLinkTo(linkTo);
        notification.setDetailsJson(toJson(details));
        notificationRepository.save(notification);
    }

    // ---- JSON <-> Map --------------------------------------------------------------

    private String toJson(Map<String, Object> details) {
        if (details == null || details.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(details);
        } catch (Exception e) {
            throw new RuntimeException("Impossible de sérialiser les détails de la notification", e);
        }
    }

    private Map<String, Object> fromJson(String json) {
        if (json == null || json.isBlank()) {
            return new LinkedHashMap<>();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<LinkedHashMap<String, Object>>() {});
        } catch (Exception e) {
            return new LinkedHashMap<>();
        }
    }

    private NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getType().getValue(),
                n.getTitle(),
                n.getDescription(),
                n.getCreatedAt(),
                n.isRead(),
                n.getLinkLabel(),
                n.getLinkTo(),
                fromJson(n.getDetailsJson())
        );
    }
}