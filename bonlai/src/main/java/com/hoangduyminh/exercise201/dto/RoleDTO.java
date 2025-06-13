package com.hoangduyminh.exercise201.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.UUID;

/**
 * DTO cho Role entity
 */
@Data
public class RoleDTO {

    private UUID id;

    @NotBlank(message = "Tên role không được để trống")
    @Size(min = 3, max = 50, message = "Tên role phải từ 3-50 ký tự")
    private String roleName;

    private String privileges;

    // Số lượng staff account đang sử dụng role này
    private Integer accountCount;
}