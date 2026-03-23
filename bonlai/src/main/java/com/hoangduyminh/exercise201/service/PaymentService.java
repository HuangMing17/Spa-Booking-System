package com.hoangduyminh.exercise201.service;

import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {
    String createPaymentUrl(String orderId, double amount, String ipAddress);
    boolean validateIPN(HttpServletRequest request);
}
