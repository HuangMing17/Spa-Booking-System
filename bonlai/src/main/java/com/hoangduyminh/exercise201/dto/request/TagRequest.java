package com.hoangduyminh.exercise201.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request DTO cho Tag creation/update
 */
@Data
public class TagRequest {

    @NotBlank(message = "Tên tag không được để trống")
    @Size(max = 100, message = "Tên tag không được quá 100 ký tự")
    private String name;

    @Size(max = 255, message = "Mô tả không được quá 255 ký tự")
    private String description;

    private String slug;
    private String thumbnail;
    private Integer displayOrder;
    private Boolean isActive;
    private String type; // PRODUCT, SERVICE, etc.
}