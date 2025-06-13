package com.hoangduyminh.exercise201.service.impl;

import com.hoangduyminh.exercise201.dto.OrderDTO;
import com.hoangduyminh.exercise201.dto.OrderItemDTO;
import com.hoangduyminh.exercise201.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender emailSender;
    private final TemplateEngine templateEngine;

    @Value("${spa.email.from}")
    private String emailFrom;

    @Value("${spa.email.from-name}")
    private String emailFromName;

    @Value("${spa.email.subject.booking-confirmation}")
    private String bookingConfirmationSubject;

    @Override
    public void sendBookingConfirmationEmail(OrderDTO orderDTO) {
        try {
            log.info("Sending booking confirmation email to: {}", orderDTO.getCustomerEmail());

            // Kiểm tra dữ liệu cần thiết
            if (orderDTO.getCustomerEmail() == null || orderDTO.getCustomerEmail().trim().isEmpty()) {
                log.warn("Cannot send email: customer email is null or empty for order {}", orderDTO.getId());
                return;
            }

            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailFrom, emailFromName);
            helper.setTo(orderDTO.getCustomerEmail());
            helper.setSubject(bookingConfirmationSubject);

            // Tạo context cho template
            Context context = new Context();
            context.setVariable("customerName",
                    orderDTO.getCustomerName() != null ? orderDTO.getCustomerName() : "Khách hàng");
            context.setVariable("orderId", orderDTO.getId() != null ? orderDTO.getId() : "");
            context.setVariable("appointmentDate", formatDate(orderDTO.getAppointmentDate()));
            context.setVariable("appointmentTime", formatTime(orderDTO.getAppointmentDate()));
            context.setVariable("services",
                    orderDTO.getItems() != null ? orderDTO.getItems() : new java.util.ArrayList<>());
            context.setVariable("totalAmount", formatCurrency(orderDTO.getTotalAmount()));
            context.setVariable("finalAmount", formatCurrency(orderDTO.getFinalAmount()));
            context.setVariable("discountAmount", formatCurrency(orderDTO.getDiscountAmount()));
            context.setVariable("discountAmountRaw",
                    orderDTO.getDiscountAmount() != null ? orderDTO.getDiscountAmount() : 0.0);
            context.setVariable("statusName", orderDTO.getStatusName() != null ? orderDTO.getStatusName() : "PENDING");

            // Tính tổng thời gian dịch vụ
            int totalDuration = 0;
            if (orderDTO.getItems() != null && !orderDTO.getItems().isEmpty()) {
                totalDuration = orderDTO.getItems().stream()
                        .mapToInt(item -> item.getDuration() != null ? item.getDuration() : 0)
                        .sum();
            }
            context.setVariable("totalDuration", totalDuration);

            // Log debug info
            log.debug("Email context - CustomerName: {}, OrderId: {}, Items count: {}",
                    orderDTO.getCustomerName(), orderDTO.getId(),
                    orderDTO.getItems() != null ? orderDTO.getItems().size() : 0);

            // Render template
            String htmlContent = templateEngine.process("booking-confirmation", context);
            helper.setText(htmlContent, true);

            emailSender.send(message);
            log.info("Booking confirmation email sent successfully to: {}", orderDTO.getCustomerEmail());

        } catch (Exception e) {
            log.error("Failed to send booking confirmation email to: {}", orderDTO.getCustomerEmail(), e);
            // Không throw exception để không ảnh hưởng đến flow chính
        }
    }

    @Override
    public void sendOrderStatusUpdateEmail(OrderDTO orderDTO) {
        try {
            log.info("Sending order status update email to: {}", orderDTO.getCustomerEmail());

            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailFrom, emailFromName);
            helper.setTo(orderDTO.getCustomerEmail());
            helper.setSubject("Cập nhật trạng thái lịch hẹn #" + orderDTO.getId());

            Context context = new Context();
            context.setVariable("customerName", orderDTO.getCustomerName());
            context.setVariable("orderId", orderDTO.getId());
            context.setVariable("statusName", orderDTO.getStatusName());
            context.setVariable("appointmentDate", formatDate(orderDTO.getAppointmentDate()));
            context.setVariable("appointmentTime", formatTime(orderDTO.getAppointmentDate()));

            String htmlContent = templateEngine.process("order-status-update", context);
            helper.setText(htmlContent, true);

            emailSender.send(message);
            log.info("Order status update email sent successfully to: {}", orderDTO.getCustomerEmail());

        } catch (Exception e) {
            log.error("Failed to send order status update email to: {}", orderDTO.getCustomerEmail(), e);
        }
    }

    @Override
    public void sendAppointmentReminderEmail(OrderDTO orderDTO) {
        try {
            log.info("Sending appointment reminder email to: {}", orderDTO.getCustomerEmail());

            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailFrom, emailFromName);
            helper.setTo(orderDTO.getCustomerEmail());
            helper.setSubject("Nhắc nhở lịch hẹn - SPA Bon Lai");

            Context context = new Context();
            context.setVariable("customerName", orderDTO.getCustomerName());
            context.setVariable("orderId", orderDTO.getId());
            context.setVariable("appointmentDate", formatDate(orderDTO.getAppointmentDate()));
            context.setVariable("appointmentTime", formatTime(orderDTO.getAppointmentDate()));
            context.setVariable("services", orderDTO.getItems());

            String htmlContent = templateEngine.process("appointment-reminder", context);
            helper.setText(htmlContent, true);

            emailSender.send(message);
            log.info("Appointment reminder email sent successfully to: {}", orderDTO.getCustomerEmail());

        } catch (Exception e) {
            log.error("Failed to send appointment reminder email to: {}", orderDTO.getCustomerEmail(), e);
        }
    }

    private String formatDate(java.util.Date date) {
        if (date == null)
            return "";
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy", new Locale("vi", "VN"));
        return formatter.format(date);
    }

    private String formatTime(java.util.Date date) {
        if (date == null)
            return "";
        SimpleDateFormat formatter = new SimpleDateFormat("HH:mm", new Locale("vi", "VN"));
        return formatter.format(date);
    }

    private String formatCurrency(Double amount) {
        if (amount == null)
            return "0 VNĐ";
        NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        return formatter.format(amount).replace("₫", "VNĐ");
    }
}