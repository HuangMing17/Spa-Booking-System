package com.hoangduyminh.exercise201.dto.response;

import lombok.Data;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO cho Customer
 */
@Data
public class CustomerResponse {
    private UUID id;
    private String fullName;
    private String email;
    private String phone;
    private Boolean isActive;
    private Date registeredAt;
    private Date updatedAt;
    private List<CustomerAddressResponse> addresses;
}

/**
 * Response DTO cho CustomerAddress
 */
@Data
class CustomerAddressResponse {
    private UUID id;
    private String address;
    private String ward;
    private String district;
    private String city;
    private String country;
    private String postalCode;
    private String phone;
    private String note;
    private Boolean isDefault;
    private Double latitude;
    private Double longitude;
    private Date createdAt;
    private Date updatedAt;
}