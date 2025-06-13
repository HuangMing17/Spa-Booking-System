package com.hoangduyminh.exercise201.auth.dto.response;

import lombok.Data;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO cho staff authentication
 */
@Data
public class StaffAuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private String userType = "STAFF";

    // Thông tin staff
    private StaffInfo user;

    @Data
    public static class StaffInfo {
        private UUID id;
        private String username;
        private String fullName;
        private String email;
        private String phone;
        private Boolean active;
        private List<String> roles;
    }
}