package com.hoangduyminh.exercise201.service;

import com.hoangduyminh.exercise201.dto.NotificationDTO;
import java.util.List;
import java.util.UUID;

/**
 * Service interface để quản lý thông báo trong hệ thống spa
 */
public interface NotificationService {

    /**
     * Tạo thông báo mới
     * 
     * @param notificationDTO thông tin thông báo
     * @return thông báo đã tạo
     */
    NotificationDTO createNotification(NotificationDTO notificationDTO);

    /**
     * Cập nhật thông tin thông báo
     * 
     * @param id              id thông báo
     * @param notificationDTO thông tin cập nhật
     * @return thông báo sau khi cập nhật
     * @throws ResourceNotFoundException nếu không tìm thấy thông báo
     */
    NotificationDTO updateNotification(UUID id, NotificationDTO notificationDTO);

    /**
     * Xóa thông báo
     * 
     * @param id id thông báo cần xóa
     * @throws ResourceNotFoundException nếu không tìm thấy thông báo
     */
    void deleteNotification(UUID id);

    /**
     * Lấy thông tin thông báo theo id
     * 
     * @param id id thông báo
     * @return thông tin thông báo
     * @throws ResourceNotFoundException nếu không tìm thấy thông báo
     */
    NotificationDTO getNotificationById(UUID id);

    /**
     * Lấy danh sách thông báo theo người nhận
     * 
     * @param recipientId id người nhận
     * @return danh sách thông báo
     */
    List<NotificationDTO> getNotificationsByRecipient(UUID recipientId);

    /**
     * Lấy danh sách thông báo chưa đọc theo người nhận
     * 
     * @param recipientId id người nhận
     * @return danh sách thông báo chưa đọc
     */
    List<NotificationDTO> getUnreadNotifications(UUID recipientId);

    /**
     * Đánh dấu thông báo đã đọc
     * 
     * @param id id thông báo
     * @return thông báo sau khi cập nhật
     */
    NotificationDTO markAsRead(UUID id);

    /**
     * Đánh dấu tất cả thông báo đã đọc cho một người nhận
     * 
     * @param recipientId id người nhận
     */
    void markAllAsRead(UUID recipientId);

    /**
     * Lấy số lượng thông báo chưa đọc của người nhận
     * 
     * @param recipientId id người nhận
     * @return số lượng thông báo chưa đọc
     */
    Long countUnreadNotifications(UUID recipientId);
}