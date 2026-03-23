package com.hoangduyminh.exercise201.service.impl;

import com.hoangduyminh.exercise201.config.VNPayConfig;
import com.hoangduyminh.exercise201.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final VNPayConfig vnPayConfig;

    public PaymentServiceImpl(VNPayConfig vnPayConfig) {
        this.vnPayConfig = vnPayConfig;
    }

    @Override
    public String createPaymentUrl(String orderId, double amount, String ipAddress) {
        // VNPay tính tiền theo đơn vị VNĐ * 100
        long amountInVND = (long) (amount * 100);
        
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnPayConfig.vnp_Version);
        vnp_Params.put("vnp_Command", vnPayConfig.vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnPayConfig.vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amountInVND));
        vnp_Params.put("vnp_CurrCode", "VND");
        
        // Mặc định ép chạy qua Ngân hàng giả lập NCB lúc Test
        vnp_Params.put("vnp_BankCode", "NCB"); 
        
        vnp_Params.put("vnp_TxnRef", orderId);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan tien thu hoac dat coc SPA:" + orderId);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", ipAddress);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        
        // Link VNPay tồn tại để trả tiền trong 15 phút
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // Map VNPay bắt buộc phải Sort các tham số A-Z trước khi Hash bảo mật
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                // Build query string
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        
        String queryUrl = query.toString();
        String vnp_SecureHash = vnPayConfig.hmacSHA512(vnPayConfig.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        return vnPayConfig.vnp_PayUrl + "?" + queryUrl;
    }

    @Override
    public boolean validateIPN(HttpServletRequest request) {
        Map<String, String[]> requestParams = request.getParameterMap();
        Map<String, String> fields = new HashMap<>();
        
        // Convert HTTP Parameter sang biến Map cục bộ
        for (Map.Entry<String, String[]> entry : requestParams.entrySet()) {
            String fieldName = entry.getKey();
            String[] fieldValues = entry.getValue();
            if (fieldValues != null && fieldValues.length > 0) {
                String fieldValue = fieldValues[0];
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    fields.put(fieldName, fieldValue);
                }
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        
        // Vứt bỏ mã HashType & SecureHash từ Map trước khi đi Build lại để dò xem có khớp không
        fields.remove("vnp_SecureHashType");
        fields.remove("vnp_SecureHash");
        
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    hashData.append('&');
                }
            }
        }
        
        // Mã hoá lại Map bằng Secret Key nội bộ
        String signValue = vnPayConfig.hmacSHA512(vnPayConfig.secretKey, hashData.toString());
        // Đối chứng với chuỗi ở đầu vào VNPay cung cấp
        return signValue.equals(vnp_SecureHash);
    }
}
