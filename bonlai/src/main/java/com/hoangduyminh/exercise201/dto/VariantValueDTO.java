package com.hoangduyminh.exercise201.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VariantValueDTO {
    private UUID id;

    @NotNull(message = "ID dịch vụ không được để trống")
    private UUID productId;

    @NotNull(message = "ID khung giờ không được để trống")
    private UUID variantId;

    @NotNull(message = "ID thời gian không được để trống")
    private UUID variantOptionId;

    private Integer displayOrder = 0;
    private Boolean isActive = true;
}