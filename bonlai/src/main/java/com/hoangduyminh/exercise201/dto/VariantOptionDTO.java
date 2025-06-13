package com.hoangduyminh.exercise201.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VariantOptionDTO {
    private UUID id;

    @NotNull(message = "ID khung giờ không được để trống")
    private UUID variantId;

    @NotBlank(message = "Thời gian không được để trống")
    @Size(max = 100, message = "Thời gian không được vượt quá 100 ký tự")
    private String title;

    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    private String description;

    private Integer displayOrder = 0;
    private Boolean isActive = true;
}