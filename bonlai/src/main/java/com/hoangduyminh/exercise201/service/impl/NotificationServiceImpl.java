package com.hoangduyminh.exercise201.service.impl;

import com.hoangduyminh.exercise201.dto.NotificationDTO;
import com.hoangduyminh.exercise201.entity.Notification;
import com.hoangduyminh.exercise201.exception.ResourceNotFoundException;
import com.hoangduyminh.exercise201.repository.NotificationRepository;
import com.hoangduyminh.exercise201.service.NotificationService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation của NotificationService để quản lý thông báo
 * Sử dụng Notification entity có sẵn, không thay đổi cấu trúc
 */
@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    @Transactional
    public NotificationDTO createNotification(NotificationDTO notificationDTO) {
        Notification notification = new Notification();
        notification.setId(UUID.randomUUID());
        updateNotificationFromDTO(notification, notificationDTO);

        Notification savedNotification = notificationRepository.save(notification);
        return convertToDTO(savedNotification);
    }

    @Override
    @Transactional
    public NotificationDTO updateNotification(UUID id, NotificationDTO notificationDTO) {
        Notification existingNotification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thông báo", "id", id));

        updateNotificationFromDTO(existingNotification, notificationDTO);
        Notification updatedNotification = notificationRepository.save(existingNotification);
        return convertToDTO(updatedNotification);
    }

    @Override
    @Transactional
    public void deleteNotification(UUID id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thông báo", "id", id));

        notificationRepository.delete(notification);
    }

    @Override
    public NotificationDTO getNotificationById(UUID id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thông báo", "id", id));
        return convertToDTO(notification);
    }

    @Override
    public List<NotificationDTO> getNotificationsByRecipient(UUID recipientId) {
        return notificationRepository.findByRecipient(recipientId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationDTO> getUnreadNotifications(UUID recipientId) {
        return notificationRepository.findUnreadByRecipient(recipientId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public NotificationDTO markAsRead(UUID id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thông báo", "id", id));

        notificationRepository.markAsRead(id);
        return convertToDTO(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(UUID recipientId) {
        notificationRepository.markAllAsRead(recipientId);
    }

    @Override
    public Long countUnreadNotifications(UUID recipientId) {
        return notificationRepository.countUnreadByRecipient(recipientId);
    }

    /**
     * Cập nhật thông tin Notification từ DTO
     * Chỉ cập nhật các trường được phép
     */
    private void updateNotificationFromDTO(Notification notification, NotificationDTO dto) {
        notification.setTitle(dto.getTitle());
        notification.setContent(dto.getContent());
        notification.setSeen(dto.getSeen());
        notification.setCreatedAt(dto.getCreatedAt());
        notification.setReceiveTime(dto.getReceiveTime());
        notification.setNotificationExpiryDate(dto.getNotificationExpiryDate());
    }

    /**
     * Convert Notification entity sang DTO
     */
    private NotificationDTO convertToDTO(Notification notification) {
        if (notification == null)
            return null;

        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setTitle(notification.getTitle());
        dto.setContent(notification.getContent());
        dto.setSeen(notification.getSeen());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setReceiveTime(notification.getReceiveTime());
        dto.setNotificationExpiryDate(notification.getNotificationExpiryDate());
        return dto;
    }
}