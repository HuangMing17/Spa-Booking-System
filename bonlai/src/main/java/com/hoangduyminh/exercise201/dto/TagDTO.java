package com.hoangduyminh.exercise201.dto;

import jakarta.validation.constraints.NotBlank;
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
public class TagDTO {
    private UUID id;

    @NotBlank(message = "Tên nhóm giảm giá không được để trống")
    @Size(max = 50, message = "Tên nhóm giảm giá không được vượt quá 50 ký tự")
    private String name;

    @NotBlank(message = "Mã nhóm giảm giá không được để trống")
    @Size(max = 50, message = "Mã nhóm giảm giá không được vượt quá 50 ký tự")
    private String code;

    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    private String description;

    private String slug;
    private Integer displayOrder = 0;
    private Boolean isActive = true;
}