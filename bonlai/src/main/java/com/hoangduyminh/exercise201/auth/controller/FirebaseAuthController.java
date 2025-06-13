package com.hoangduyminh.exercise201.auth.controller;

import com.hoangduyminh.exercise201.auth.dto.request.FirebaseAuthRequest;
import com.hoangduyminh.exercise201.auth.dto.response.FirebaseAuthResponse;
import com.hoangduyminh.exercise201.auth.service.FirebaseAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * Controller xử lý Firebase Authentication
 */
@RestController
@RequestMapping("/auth/firebase")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class FirebaseAuthController {

    private final FirebaseAuthService firebaseAuthService;

    /**
     * Xác thực Firebase ID token và trả về JWT token
     * 
     * @param request chứa Firebase ID token
     * @return JWT token để sử dụng cho các API khác
     */
    @PostMapping("/verify")
    public ResponseEntity<FirebaseAuthResponse> verifyFirebaseToken(
            @Valid @RequestBody FirebaseAuthRequest request) {
        try {
            log.info("Verifying Firebase token for authentication");

            String jwtToken = firebaseAuthService.authenticateFirebaseToken(request.getFirebaseToken());

            FirebaseAuthResponse response = FirebaseAuthResponse.builder()
                    .success(true)
                    .message("Firebase authentication successful")
                    .jwtToken(jwtToken)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Firebase authentication failed: {}", e.getMessage());

            FirebaseAuthResponse response = FirebaseAuthResponse.builder()
                    .success(false)
                    .message("Firebase authentication failed: " + e.getMessage())
                    .build();

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    /**
     * Đăng ký tài khoản mới với Firebase token
     * 
     * @param request chứa Firebase ID token
     * @return JWT token cho tài khoản mới
     */
    @PostMapping("/register")
    public ResponseEntity<FirebaseAuthResponse> registerWithFirebase(
            @Valid @RequestBody FirebaseAuthRequest request) {
        try {
            log.info("Registering new account with Firebase token");

            String jwtToken = firebaseAuthService.authenticateFirebaseToken(request.getFirebaseToken());

            FirebaseAuthResponse response = FirebaseAuthResponse.builder()
                    .success(true)
                    .message("Account registration with Firebase successful")
                    .jwtToken(jwtToken)
                    .build();

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            log.error("Firebase registration failed: {}", e.getMessage());

            FirebaseAuthResponse response = FirebaseAuthResponse.builder()
                    .success(false)
                    .message("Firebase registration failed: " + e.getMessage())
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Health check endpoint để kiểm tra Firebase service
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Firebase Auth Controller is running");
    }
}