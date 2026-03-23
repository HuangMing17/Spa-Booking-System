package com.hoangduyminh.exercise201.controller;

import com.hoangduyminh.exercise201.dto.OrderDTO;
import com.hoangduyminh.exercise201.service.OrderService;
import com.hoangduyminh.exercise201.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;

    public PaymentController(PaymentService paymentService, OrderService orderService) {
        this.paymentService = paymentService;
        this.orderService = orderService;
    }

    /**
     * REACT FRONTEND sẽ gọi Endpoint này sau khi Đặt Lịch thành công.
     * Trả về URL Dài ngoằng của VNPay để Frontend chuyển hướng khách đến trang quẹt thẻ.
     */
    @GetMapping("/create-url/{orderId}")
    public ResponseEntity<Map<String, String>> createPaymentUrl(@PathVariable String orderId, HttpServletRequest request) {
        OrderDTO order = orderService.getOrderById(orderId);
        // Lấy địa chỉ IP của khách hàng tạo ra lệnh giao dịch VNPay
        String clientIp = request.getRemoteAddr();
        
        // Gọi tới não bộ (PaymentService) để xâu chuỗi và ký tên bảo mật SHA-512
        String paymentUrl = paymentService.createPaymentUrl(orderId, order.getFinalAmount(), clientIp);
        
        Map<String, String> result = new HashMap<>();
        result.put("url", paymentUrl);
        return ResponseEntity.ok(result);
    }

    /**
     * Endpoint tàng hình dành riêng cho Máy Chủ VNPay bắn (Webhook/IPN) về.
     * Sẽ âm thầm xác nhận tiền thật sự vào Tài Khoản Ngân Hàng chưa.
     */
    @GetMapping("/vnpay-ipn")
    public ResponseEntity<Map<String, String>> vnpayIpn(HttpServletRequest request) {
        Map<String, String> result = new HashMap<>();
        try {
            boolean isValid = paymentService.validateIPN(request);
            if (isValid) {
                String orderId = request.getParameter("vnp_TxnRef");
                String responseCode = request.getParameter("vnp_ResponseCode");
                String transactionId = request.getParameter("vnp_TransactionNo");

                OrderDTO order = orderService.getOrderById(orderId);
                if (order != null) {
                    if ("00".equals(responseCode)) {
                        orderService.updatePaymentStatus(orderId, transactionId, "PAID");
                    } else {
                        orderService.updatePaymentStatus(orderId, transactionId, "FAILED");
                    }
                    // Báo cáo thành công cho VNPay biết là Webhook đã bắt được
                    result.put("RspCode", "00");
                    result.put("Message", "Confirm Success");
                } else {
                    result.put("RspCode", "01");
                    result.put("Message", "Order Not Found");
                }

            } else {
                result.put("RspCode", "97");
                result.put("Message", "Invalid Checksum - Có kẻ xâm nhập giả mạo Ngân Hàng gọi hàm này");
            }
        } catch (Exception e) {
            result.put("RspCode", "99");
            result.put("Message", "Unknown Error");
        }
        return ResponseEntity.ok(result);
    }
}
