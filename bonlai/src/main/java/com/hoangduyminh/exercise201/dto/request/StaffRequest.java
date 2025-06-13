package com.hoangduyminh.exercise201.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;
import java.util.UUID;

/**
 * Request DTO cho Staff creation/update
 */
@Data
public class StaffRequest {

    @NotBlank(message = "Tên không được để trống")
    @Size(max = 255, message = "Tên không được quá 255 ký tự")
    private String fullName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Số điện thoại không hợp lệ")
    private String phone;

    @NotBlank(message = "Username không được để trống")
    @Size(min = 4, max = 50, message = "Username phải từ 4-50 ký tự")
    private String username;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải ít nhất 6 ký tự")
    private String password;

    private String avatar;
    private String address;
    private String position; // Chức vụ
    private String department; // Phòng ban
    private List<UUID> roleIds; // Danh sách role được gán

    private Boolean isActive;
    private String note;
}

/**
 * Request DTO cho Role creation/update
 */
@Data
class RoleRequest {

    @NotBlank(message = "Tên role không được để trống")
    @Size(max = 50, message = "Tên role không được quá 50 ký tự")
    private String name;

    @Size(max = 255, message = "Mô tả không được quá 255 ký tự")
    private String description;

    private List<String> permissions; // Danh sách quyền
}