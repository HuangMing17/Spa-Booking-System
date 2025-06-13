package com.hoangduyminh.exercise201.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private String id;

    @NotNull(message = "ID khách hàng không được để trống")
    private UUID customerId;

    private UUID statusId;

    private Double totalAmount = 0.0;
    private Double discountAmount = 0.0;
    private Double finalAmount = 0.0;
    private UUID couponId;
    private String couponCode;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private Date appointmentDate;
    private String statusName;
    private String statusCode;
    private List<OrderItemDTO> items;
    private Date createdAt;
    private Date updatedAt;
}