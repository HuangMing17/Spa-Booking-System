package com.hoangduyminh.exercise201.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho Firebase authentication request
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FirebaseAuthRequest {

    @NotBlank(message = "Firebase token is required")
    private String firebaseToken;
}