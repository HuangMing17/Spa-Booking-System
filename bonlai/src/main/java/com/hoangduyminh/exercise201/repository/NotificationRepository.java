package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

        @Query("SELECT n FROM Notification n WHERE n.account.id = :accountId " +
                        "AND n.seen = false ORDER BY n.createdAt DESC")
        List<Notification> findByRecipient(UUID accountId);

        @Query("SELECT n FROM Notification n WHERE n.account.id = :accountId " +
                        "AND n.seen = false " +
                        "ORDER BY n.createdAt DESC")
        List<Notification> findUnreadByRecipient(UUID accountId);

        @Query("SELECT COUNT(n) FROM Notification n WHERE n.account.id = :accountId " +
                        "AND n.seen = false")
        Long countUnreadByRecipient(UUID accountId);

        @Modifying
        @Query("UPDATE Notification n SET n.seen = true " +
                        "WHERE n.id = :id")
        void markAsRead(UUID id);

        @Modifying
        @Query("UPDATE Notification n SET n.seen = true " +
                        "WHERE n.account.id = :accountId AND n.seen = false")
        void markAllAsRead(UUID accountId);

        @Query("SELECT n FROM Notification n WHERE " +
                        "n.account.id = :accountId " +
                        "ORDER BY n.createdAt DESC")
        Page<Notification> findByRecipientPaged(UUID accountId, Pageable pageable);

        @Query("SELECT n FROM Notification n WHERE " +
                        "n.notificationExpiryDate <= :now")
        List<Notification> findExpiredNotifications(Date now);
}