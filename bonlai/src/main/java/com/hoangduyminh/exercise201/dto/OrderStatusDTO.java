package com.hoangduyminh.exercise201.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusDTO {
    private UUID id;

    @NotBlank(message = "Mã trạng thái không được để trống")
    private String code;

    @NotBlank(message = "Tên trạng thái không được để trống")
    private String name;

    private String description;
    private String type;
    private Integer displayOrder = 0;
    private String color;
    private String icon;
    private Boolean isActive = true;
    private Boolean isFinal = false;

    // Thống kê
    private Long orderCount = 0L;
}