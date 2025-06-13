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
public class GalleryDTO {
    private UUID id;

    @NotNull(message = "ID dịch vụ không được để trống")
    private UUID productId;

    @NotBlank(message = "URL hình ảnh không được để trống")
    private String url;

    @Size(max = 255, message = "Tên hình ảnh không được vượt quá 255 ký tự")
    private String title;

    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    private String description;

    private String altText;
    private Integer displayOrder = 0;
    private Boolean isThumbnail = false;
    private Boolean isActive = true;
}