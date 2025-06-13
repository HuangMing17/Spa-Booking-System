package com.hoangduyminh.exercise201.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.UUID;

/**
 * Request DTO for Category creation/update
 */
@Data
public class CategoryRequest {

    @NotBlank(message = "Tên danh mục không được để trống")
    @Size(max = 255, message = "Tên danh mục không được quá 255 ký tự")
    private String name;

    @Size(max = 1000, message = "Mô tả không được quá 1000 ký tự")
    private String description;

    private String thumbnail; // Sẽ được map sang trường image trong entity
    private Boolean isActive;
    private UUID parentId; // ID của danh mục cha nếu có
}