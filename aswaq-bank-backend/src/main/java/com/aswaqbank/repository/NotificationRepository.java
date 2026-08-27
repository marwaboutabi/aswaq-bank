package com.aswaqbank.repository;

import com.aswaqbank.entity.Notification;
import com.aswaqbank.entity.NotificationType;
import com.aswaqbank.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    List<Notification> findByUserAndTypeOrderByCreatedAtDesc(User user, NotificationType type);

    Optional<Notification> findByIdAndUser(Long id, User user);

    long countByUserAndReadFalse(User user);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.user = :user AND n.read = false")
    void markAllAsReadForUser(@Param("user") User user);
}