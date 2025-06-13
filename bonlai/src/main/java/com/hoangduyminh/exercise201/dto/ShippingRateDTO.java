package com.hoangduyminh.exercise201.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
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
public class ShippingRateDTO {
    private UUID id;

    @NotNull(message = "ID khu vực vận chuyển không được để trống")
    private UUID shippingZoneId;

    @NotBlank(message = "Tên phí vận chuyển không được để trống")
    @Size(max = 100, message = "Tên phí vận chuyển không được vượt quá 100 ký tự")
    private String name;

    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    private String description;

    @PositiveOrZero(message = "Giá vận chuyển không được âm")
    private BigDecimal price = BigDecimal.ZERO;

    private String conditions;
    private Integer displayOrder = 0;
    private Boolean isActive = true;
}