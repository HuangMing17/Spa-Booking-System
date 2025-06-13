package com.hoangduyminh.exercise201.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho Firebase authentication response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FirebaseAuthResponse {
    
    private boolean success;
    private String message;
    private String jwtToken;
    private String tokenType = "Bearer";
}