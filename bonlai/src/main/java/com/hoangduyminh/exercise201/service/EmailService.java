package com.hoangduyminh.exercise201.service;

import com.hoangduyminh.exercise201.dto.OrderDTO;

public interface EmailService {

    /**
     * Gửi email xác nhận đặt lịch thành công
     * 
     * @param orderDTO thông tin đơn đặt lịch
     */
    void sendBookingConfirmationEmail(OrderDTO orderDTO);

    /**
     * Gửi email thông báo cập nhật trạng thái đơn hàng
     * 
     * @param orderDTO thông tin đơn đặt lịch
     */
    void sendOrderStatusUpdateEmail(OrderDTO orderDTO);

    /**
     * Gửi email nhắc nhở lịch hẹn (trước 1 ngày)
     * 
     * @param orderDTO thông tin đơn đặt lịch
     */
    void sendAppointmentReminderEmail(OrderDTO orderDTO);
}