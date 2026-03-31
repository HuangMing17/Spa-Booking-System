package com.hoangduyminh.exercise201.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;
import java.util.UUID;

/**
 * Request DTO cho Product/Service creation/update
 */
@Data
public class ProductRequest {
    @NotBlank(message = "Tên dịch vụ không được để trống")
    @Size(max = 255, message = "Tên dịch vụ không được quá 255 ký tự")
    private String name;

    @Size(max = 1000, message = "Mô tả không được quá 1000 ký tự")
    private String description;

    private String slug;
    private String thumbnail;
    private List<String> images;

    @NotNull(message = "Giá không được để trống")
    @PositiveOrZero(message = "Giá phải lớn hơn hoặc bằng 0")
    private Double regularPrice;

    @PositiveOrZero(message = "Giá khuyến mãi phải lớn hơn hoặc bằng 0")
    private Double salePrice;

    private Boolean isActive;
    private List<UUID> categoryIds;
    private List<String> tagNames;

    // Variants và Attributes mới cho dịch vụ spa
    private List<ServiceVariantRequest> variants;
    private List<ServiceAttributeRequest> attributes;
}