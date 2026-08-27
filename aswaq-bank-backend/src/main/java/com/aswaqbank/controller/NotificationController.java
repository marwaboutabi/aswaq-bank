package com.aswaqbank.controller;

import com.aswaqbank.dto.NotificationResponse;
import com.aswaqbank.dto.UnreadCountResponse;
import com.aswaqbank.entity.NotificationType;
import com.aswaqbank.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")

public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            @RequestParam(required = false) String type) {
        NotificationType typeFilter = (type == null || type.isBlank()) ? null : NotificationType.fromValue(type);
        return ResponseEntity.ok(notificationService.getForCurrentUser(typeFilter));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<UnreadCountResponse> getUnreadCount() {
        return ResponseEntity.ok(new UnreadCountResponse(notificationService.getUnreadCountForCurrentUser()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        notificationService.markAllAsReadForCurrentUser();
        return ResponseEntity.noContent().build();
    }
}