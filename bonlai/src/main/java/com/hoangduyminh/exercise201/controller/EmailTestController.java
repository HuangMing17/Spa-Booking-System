package com.hoangduyminh.exercise201.controller;

import com.hoangduyminh.exercise201.dto.OrderDTO;
import com.hoangduyminh.exercise201.dto.OrderItemDTO;
import com.hoangduyminh.exercise201.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Date;
import java.util.UUID;

@RestController
@RequestMapping("/api/test/email")
@RequiredArgsConstructor
public class EmailTestController {

    private final EmailService emailService;

    /**
     * Test endpoint để gửi email xác nhận đặt lịch
     */
    @PostMapping("/booking-confirmation")
    public ResponseEntity<String> testBookingConfirmationEmail(@RequestParam String email) {
        try {
            // Tạo dữ liệu test
            OrderDTO testOrder = createTestOrderDTO(email);

            // Gửi email
            emailService.sendBookingConfirmationEmail(testOrder);

            return ResponseEntity.ok("Email xác nhận đặt lịch đã được gửi đến: " + email);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Lỗi khi gửi email: " + e.getMessage());
        }
    }

    /**
     * Test endpoint để gửi email cập nhật trạng thái
     */
    @PostMapping("/status-update")
    public ResponseEntity<String> testStatusUpdateEmail(@RequestParam String email,
            @RequestParam(defaultValue = "CONFIRMED") String status) {
        try {
            // Tạo dữ liệu test
            OrderDTO testOrder = createTestOrderDTO(email);
            testOrder.setStatusName(status);

            // Gửi email
            emailService.sendOrderStatusUpdateEmail(testOrder);

            return ResponseEntity.ok("Email cập nhật trạng thái đã được gửi đến: " + email);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Lỗi khi gửi email: " + e.getMessage());
        }
    }

    /**
     * Test endpoint để gửi email nhắc nhở
     */
    @PostMapping("/reminder")
    public ResponseEntity<String> testReminderEmail(@RequestParam String email) {
        try {
            // Tạo dữ liệu test
            OrderDTO testOrder = createTestOrderDTO(email);

            // Gửi email
            emailService.sendAppointmentReminderEmail(testOrder);

            return ResponseEntity.ok("Email nhắc nhở đã được gửi đến: " + email);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Lỗi khi gửi email: " + e.getMessage());
        }
    }

    /**
     * Tạo dữ liệu OrderDTO để test
     */
    private OrderDTO createTestOrderDTO(String email) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId("TEST-" + UUID.randomUUID().toString().substring(0, 8));
        orderDTO.setCustomerName("Khách hàng test");
        orderDTO.setCustomerEmail(email);
        orderDTO.setCustomerPhone("0901234567");
        orderDTO.setAppointmentDate(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000)); // Ngày mai
        orderDTO.setStatusName("PENDING");
        orderDTO.setTotalAmount(500000.0);
        orderDTO.setDiscountAmount(50000.0);
        orderDTO.setFinalAmount(450000.0);

        // Tạo test order items
        OrderItemDTO item1 = new OrderItemDTO();
        item1.setId(UUID.randomUUID());
        item1.setProductName("Massage body thư giãn");
        item1.setVariantName("Gói 90 phút");
        item1.setQuantity(1);
        item1.setUnitPrice(300000.0);
        item1.setTotalPrice(300000.0);
        item1.setDuration(90);

        OrderItemDTO item2 = new OrderItemDTO();
        item2.setId(UUID.randomUUID());
        item2.setProductName("Chăm sóc da mặt");
        item2.setVariantName("Gói cơ bản");
        item2.setQuantity(1);
        item2.setUnitPrice(200000.0);
        item2.setTotalPrice(200000.0);
        item2.setDuration(60);

        orderDTO.setItems(Arrays.asList(item1, item2));

        return orderDTO;
    }
}