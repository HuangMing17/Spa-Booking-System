package com.hoangduyminh.exercise201.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * DTO class cho tài khoản nhân viên
 */
@Data
public class StaffAccountDTO {
    private UUID id;

    @NotBlank(message = "Username không được để trống")
    @Size(min = 4, max = 50, message = "Username phải từ 4-50 ký tự")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Username chỉ được chứa chữ cái, số và các ký tự ._-")
    private String username;

    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^[0-9]{10}$", message = "Số điện thoại phải có 10 chữ số")
    private String phone;

    private String avatar;
    private Date birthday;
    private String gender;
    private Boolean isActive;
    private Date lastLoginAt;
    private String position; // Chức vụ
    private String department; // Phòng ban

    // Các role của tài khoản
    private List<RoleDTO> roles;

    // Thống kê
    private Integer totalOrders; // Số đơn đã xử lý
    private Double totalRevenue; // Doanh thu đã tạo
    private Date lastOrderDate; // Đơn gần nhất
}