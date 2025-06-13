package com.hoangduyminh.exercise201.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

/**
 * Request DTO cho Customer creation/update
 */
@Data
public class CustomerRequest {

  
    private String fullName;

   
    
    private String email;

  
    private String phone;

    private Boolean isActive;

    @Valid
    private List<CustomerAddressRequest> addresses;
}

/**
 * Request DTO cho CustomerAddress creation/update
 */
@Data
class CustomerAddressRequest {

    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;

    private String ward; // Phường/Xã
    private String district; // Quận/Huyện
    private String city; // Tỉnh/Thành phố
    private String country;

    @Pattern(regexp = "^[0-9]{5,6}$", message = "Mã bưu điện không hợp lệ")
    private String postalCode;

    private String phone;
    private String note;
    private Boolean isDefault;
    private Double latitude;
    private Double longitude;
}