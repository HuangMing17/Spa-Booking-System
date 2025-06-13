package com.hoangduyminh.exercise201.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class CartDTO {
    private UUID id;
    private UUID customerId;
    private String customerName;
    private List<CartItemDTO> items;
    private Double totalAmount;
    private Double discountAmount;
    private Double finalAmount;
    private UUID couponId;
    private String couponCode;
    private Boolean isActive;
}