package com.hoangduyminh.exercise201.auth.dto.response;

import lombok.Data;
import java.util.UUID;

/**
 * Response DTO cho customer authentication
 */
@Data
public class CustomerAuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private String userType = "CUSTOMER";

    // Thông tin customer
    private CustomerInfo user;

    @Data
    public static class CustomerInfo {
        private UUID id;
        private String fullName;
        private String email;
        private String phone;
        private Boolean active;
    }
}