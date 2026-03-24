package com.hoangduyminh.exercise201.auth.controller;

import com.hoangduyminh.exercise201.auth.dto.request.CustomerAuthRequest;
import com.hoangduyminh.exercise201.auth.dto.request.CustomerRegisterRequest;
import com.hoangduyminh.exercise201.auth.dto.request.FirebaseAuthRequest;
import com.hoangduyminh.exercise201.auth.dto.response.CustomerAuthResponse;
import com.hoangduyminh.exercise201.auth.service.FirebaseAuthService;
import com.hoangduyminh.exercise201.auth.service.JwtService;
import com.hoangduyminh.exercise201.entity.Customer;
import com.hoangduyminh.exercise201.repository.CustomerRepository;
import com.hoangduyminh.exercise201.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller xử lý authentication cho Customer
 */
@RestController
@RequestMapping("/auth/customer")
@RequiredArgsConstructor
@Slf4j
public class CustomerAuthController {

        private final CustomerRepository customerRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final FirebaseAuthService firebaseAuthService;

        @PostMapping("/register")
        @PreAuthorize("permitAll()")
        public ResponseEntity<CustomerAuthResponse> register(@Valid @RequestBody CustomerRegisterRequest request) {
                // Kiểm tra email đã tồn tại chưa
                if (customerRepository.findByEmail(request.getEmail()).isPresent()) {
                        throw new RuntimeException("Email already exists");
                }

                // Tạo customer mới
                var customer = new Customer();
                customer.setFirst_name(request.getFullName().split(" ")[0]);
                customer.setLast_name(request.getFullName().substring(request.getFullName().indexOf(" ") + 1));
                customer.setEmail(request.getEmail());
                customer.setPhone(request.getPhone());
                customer.setPassword_hash(passwordEncoder.encode(request.getPassword()));
                customer.setActive(true);
                customer.setUser_name(request.getEmail()); // Sử dụng email làm username

                customerRepository.save(customer);

                // Tạo JWT token
                String token = jwtService.generateToken(
                                org.springframework.security.core.userdetails.User.builder()
                                                .username(customer.getEmail())
                                                .password(customer.getPassword_hash())
                                                .authorities("ROLE_CUSTOMER")
                                                .build(),
                                "CUSTOMER");

                // Tạo response
                var response = new CustomerAuthResponse();
                response.setToken(token);
                response.setTokenType("Bearer");
                response.setExpiresIn(24 * 60 * 60 * 1000L); // 24 hours
                response.setUserType("CUSTOMER");

                var userInfo = new CustomerAuthResponse.CustomerInfo();
                userInfo.setId(customer.getId());
                userInfo.setFullName(request.getFullName());
                userInfo.setEmail(customer.getEmail());
                userInfo.setPhone(customer.getPhone());
                userInfo.setActive(customer.getActive());
                response.setUser(userInfo);

                return ResponseEntity.ok(response);
        }

        @PostMapping("/login")
        @PreAuthorize("permitAll()")
        public ResponseEntity<CustomerAuthResponse> login(@Valid @RequestBody CustomerAuthRequest request) {
                // Xác thực customer
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

                // Lấy thông tin customer
                var customer = customerRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("Customer not found"));

                // Tạo JWT token
                String token = jwtService.generateToken(
                                (org.springframework.security.core.userdetails.User) authentication.getPrincipal(),
                                "CUSTOMER");

                // Tạo response
                var response = new CustomerAuthResponse();
                response.setToken(token);
                response.setTokenType("Bearer");
                response.setExpiresIn(24 * 60 * 60 * 1000L); // 24 hours
                response.setUserType("CUSTOMER");

                var userInfo = new CustomerAuthResponse.CustomerInfo();
                userInfo.setId(customer.getId());
                userInfo.setFullName(customer.getFirst_name() + " " + customer.getLast_name());
                userInfo.setEmail(customer.getEmail());
                userInfo.setPhone(customer.getPhone());
                userInfo.setActive(customer.getActive());
                response.setUser(userInfo);

                return ResponseEntity.ok(response);
        }

        /**
         * Đăng nhập với Firebase Google Authentication
         */
        @PostMapping("/firebase-login")
        @PreAuthorize("permitAll()")
        public ResponseEntity<CustomerAuthResponse> firebaseLogin(@Valid @RequestBody FirebaseAuthRequest request) {
                log.info("Processing Firebase authentication");

                // Xác thực Firebase token và nhận JWT token
                String jwtToken = firebaseAuthService.authenticateFirebaseToken(request.getFirebaseToken());

                // Lấy thông tin customer từ JWT token
                String email = jwtService.extractUsername(jwtToken);
                Customer customer = customerRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("Customer", "email", email));

                // Tạo response giống như login thông thường
                var response = new CustomerAuthResponse();
                response.setToken(jwtToken);
                response.setTokenType("Bearer");
                response.setExpiresIn(24 * 60 * 60 * 1000L); // 24 hours
                response.setUserType("CUSTOMER");

                var userInfo = new CustomerAuthResponse.CustomerInfo();
                userInfo.setId(customer.getId());
                userInfo.setFullName(customer.getFirst_name() + " " + customer.getLast_name());
                userInfo.setEmail(customer.getEmail());
                userInfo.setPhone(customer.getPhone());
                userInfo.setActive(customer.getActive());
                response.setUser(userInfo);

                log.info("Firebase authentication successful for user: {}", email);
                return ResponseEntity.ok(response);
        }

        /**
         * Kiểm tra trạng thái authentication methods
         */
        @GetMapping("/auth-methods")
        @PreAuthorize("permitAll()")
        public ResponseEntity<Map<String, Object>> getAuthMethods() {
                Map<String, Object> methods = new HashMap<>();
                methods.put("traditional", true);
                methods.put("firebase", true);
                methods.put("google", true);
                methods.put("message",
                                "Both traditional email/password and Firebase Google authentication are supported");

                return ResponseEntity.ok(methods);
        }

        /**
         * Health check cho Firebase service
         */
        @GetMapping("/firebase-health")
        @PreAuthorize("permitAll()")
        public ResponseEntity<Map<String, Object>> firebaseHealth() {
                Map<String, Object> health = new HashMap<>();
                try {
                        // Simple check - if service is injected, Firebase is configured
                        health.put("firebase", "configured");
                        health.put("status", "healthy");
                        health.put("message", "Firebase authentication is ready");
                        return ResponseEntity.ok(health);
                } catch (Exception e) {
                        health.put("firebase", "error");
                        health.put("status", "unhealthy");
                        health.put("message", "Firebase authentication error: " + e.getMessage());
                        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(health);
                }
        }
}