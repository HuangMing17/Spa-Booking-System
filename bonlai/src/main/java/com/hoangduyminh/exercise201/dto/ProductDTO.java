package com.hoangduyminh.exercise201.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private UUID id;

    @NotBlank(message = "Tên dịch vụ spa không được để trống")
    @Size(max = 255, message = "Tên dịch vụ spa không được vượt quá 255 ký tự")
    private String name;

    @NotBlank(message = "Mã dịch vụ không được để trống")
    @Size(max = 50, message = "Mã dịch vụ không được vượt quá 50 ký tự")
    private String sku;

    @Size(max = 1000, message = "Mô tả ngắn không được vượt quá 1000 ký tự")
    private String shortDescription;

    private String description;
    private String slug;
    private String thumbnail;
    private BigDecimal regularPrice = BigDecimal.ZERO;
    private BigDecimal salePrice = BigDecimal.ZERO;
    private Boolean isPublished = false;
}