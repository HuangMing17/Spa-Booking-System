package com.hoangduyminh.exercise201.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

/**
 * DTO cũ cho Category - CHÚ Ý: Được giữ lại để hỗ trợ các API cũ
 * Các API mới nên sử dụng CategoryRequest và CategoryResponse
 * 
 * @deprecated Sử dụng
 *             {@link com.hoangduyminh.exercise201.dto.request.CategoryRequest}
 *             và
 *             {@link com.hoangduyminh.exercise201.dto.response.CategoryResponse}
 *             để thay thế
 */
@Deprecated
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private UUID id;
    private UUID parentId;

    @NotBlank(message = "Tên danh mục dịch vụ không được để trống")
    @Size(max = 100, message = "Tên danh mục dịch vụ không được vượt quá 100 ký tự")
    private String name;

    @NotBlank(message = "Mã danh mục không được để trống")
    @Size(max = 50, message = "Mã danh mục không được vượt quá 50 ký tự")
    private String code;

    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    private String description;

    // Các trường sau đã được cập nhật để phù hợp với entity hiện tại
    private Boolean isActive = true;
}