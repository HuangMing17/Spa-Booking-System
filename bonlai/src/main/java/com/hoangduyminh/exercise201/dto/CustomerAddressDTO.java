package com.hoangduyminh.exercise201.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

/**
 * DTO class cho địa chỉ khách hàng
 */
@Data
public class CustomerAddressDTO {
    private UUID id;
    private UUID customerId;

    @NotBlank(message = "Tên địa chỉ không được để trống")
    private String name;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;

    @NotBlank(message = "Địa chỉ chi tiết không được để trống")
    private String addressLine1;
    private String addressLine2;

    private String ward; // phường/xã
    private String district; // quận/huyện
    private String city; // tỉnh/thành phố
    private String country;

    private String postalCode;
    private Boolean isDefault;
    private String note;
}