package com.hoangduyminh.exercise201.auth.controller;

import com.hoangduyminh.exercise201.auth.dto.request.StaffAuthRequest;
import com.hoangduyminh.exercise201.auth.dto.request.StaffRegisterRequest;
import com.hoangduyminh.exercise201.auth.dto.response.StaffAuthResponse;
import com.hoangduyminh.exercise201.auth.service.JwtService;
import com.hoangduyminh.exercise201.entity.Role;
import com.hoangduyminh.exercise201.entity.StaffAccount;
import com.hoangduyminh.exercise201.repository.RoleRepository;
import com.hoangduyminh.exercise201.repository.StaffAccountRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

/**
 * Controller xử lý authentication cho Staff
 */
@RestController
@RequestMapping("/auth/staff")
@RequiredArgsConstructor
public class StaffAuthController {

        private final StaffAccountRepository staffAccountRepository;
        private final RoleRepository roleRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        @PostMapping("/register")
        public ResponseEntity<StaffAuthResponse> register(@Valid @RequestBody StaffRegisterRequest request) {
                // Kiểm tra username đã tồn tại chưa
                if (staffAccountRepository.existsByUserName(request.getUsername())) {
                        throw new RuntimeException("Username already exists");
                }

                // Kiểm tra email đã tồn tại chưa
                if (staffAccountRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email already exists");
                }

                // Tạo staff account mới
                var staff = new StaffAccount();
                staff.setFirst_name(request.getFullName().split(" ")[0]);
                staff.setLast_name(request.getFullName().substring(request.getFullName().indexOf(" ") + 1));
                staff.setUserName(request.getUsername());
                staff.setEmail(request.getEmail());
                staff.setPhone_number(request.getPhone());
                staff.setPassword_hash(passwordEncoder.encode(request.getPassword()));
                staff.setActive(true);

                // Set role mặc định là STAFF
                Role staffRole = roleRepository.findByRoleName("STAFF")
                                .orElseThrow(() -> new RuntimeException("Role STAFF not found"));
                staff.setRole(staffRole);

                staffAccountRepository.save(staff);

                // Tạo JWT token
                String token = jwtService.generateToken(
                                org.springframework.security.core.userdetails.User.builder()
                                                .username(staff.getUserName())
                                                .password(staff.getPassword_hash())
                                                .authorities("ROLE_STAFF")
                                                .build(),
                                "STAFF");

                // Tạo response
                var response = new StaffAuthResponse();
                response.setToken(token);
                response.setTokenType("Bearer");
                response.setExpiresIn(24 * 60 * 60 * 1000L); // 24 hours
                response.setUserType("STAFF");

                var userInfo = new StaffAuthResponse.StaffInfo();
                userInfo.setId(staff.getId());
                userInfo.setUsername(staff.getUserName());
                userInfo.setFullName(request.getFullName());
                userInfo.setEmail(staff.getEmail());
                userInfo.setPhone(staff.getPhone_number());
                userInfo.setActive(staff.isActive());

                var roles = new ArrayList<String>();
                roles.add(staff.getRole().getRoleName());
                userInfo.setRoles(roles);

                response.setUser(userInfo);

                return ResponseEntity.ok(response);
        }

        @PostMapping("/login")
        public ResponseEntity<StaffAuthResponse> login(@Valid @RequestBody StaffAuthRequest request) {
                // Xác thực staff
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

                // Lấy thông tin staff
                var staff = staffAccountRepository.findByUserName(request.getUsername())
                                .orElseThrow(() -> new RuntimeException("Staff not found"));

                // Tạo JWT token
                String token = jwtService.generateToken(
                                (org.springframework.security.core.userdetails.User) authentication.getPrincipal(),
                                "STAFF");

                // Tạo response
                var response = new StaffAuthResponse();
                response.setToken(token);
                response.setTokenType("Bearer");
                response.setExpiresIn(24 * 60 * 60 * 1000L); // 24 hours
                response.setUserType("STAFF");

                var userInfo = new StaffAuthResponse.StaffInfo();
                userInfo.setId(staff.getId());
                userInfo.setUsername(staff.getUserName());
                userInfo.setFullName(staff.getFirst_name() + " " + staff.getLast_name());
                userInfo.setEmail(staff.getEmail());
                userInfo.setPhone(staff.getPhone_number());
                userInfo.setActive(staff.isActive());

                var roles = new ArrayList<String>();
                roles.add(staff.getRole().getRoleName());
                userInfo.setRoles(roles);

                response.setUser(userInfo);

                return ResponseEntity.ok(response);
        }
}