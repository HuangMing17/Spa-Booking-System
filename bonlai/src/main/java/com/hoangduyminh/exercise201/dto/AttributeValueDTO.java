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
public class AttributeValueDTO {
    private UUID id;

    @NotNull(message = "ID phòng không được để trống")
    private UUID attributeId;

    @NotBlank(message = "Thông tin phòng không được để trống")
    @Size(max = 100, message = "Thông tin phòng không được vượt quá 100 ký tự")
    private String value;

    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    private String description;

    private String icon;
    private Integer displayOrder = 0;
    private Boolean isActive = true;
}