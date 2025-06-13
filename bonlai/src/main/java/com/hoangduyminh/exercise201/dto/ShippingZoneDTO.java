package com.hoangduyminh.exercise201.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShippingZoneDTO {
    private UUID id;

    @NotBlank(message = "Tên khu vực vận chuyển không được để trống")
    @Size(max = 100, message = "Tên khu vực vận chuyển không được vượt quá 100 ký tự")
    private String name;

    @NotBlank(message = "Code khu vực không được để trống")
    @Size(max = 50, message = "Code khu vực không được vượt quá 50 ký tự")
    private String code;

    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    private String description;

    private List<UUID> countryIds;
    private Integer displayOrder = 0;
    private Boolean isActive = true;
}