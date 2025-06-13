package com.hoangduyminh.exercise201.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * DTO class cho khách hàng
 */
@Data
public class CustomerDTO {
    private UUID id;

    @NotBlank(message = "Tên không được để trống")
    private String name;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^[0-9]{10}$", message = "Số điện thoại phải có 10 chữ số")
    private String phone;

    private String avatar;
    private String address;
    private Date birthday;
    private String gender;
    private Boolean isActive;

    // Thống kê
    private Integer totalOrders;
    private Double totalSpent;
    private Date lastOrderDate;
    private List<CustomerAddressDTO> addresses;
    private List<OrderDTO> recentOrders;
}