package com.hoangduyminh.exercise201.dto.response;

import lombok.Data;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO cho Cart
 */
@Data
public class CartResponse {
    private UUID id;
    private UUID customerId;
    private String customerName;
    private String customerEmail;

    private String note;

    private Double subtotal; // Tổng tiền chưa giảm giá
    private Double discount; // Tổng tiền giảm giá
    private Double tax; // Thuế
    private Double total; // Tổng tiền cuối cùng

    private Integer totalItems; // Tổng số items
    private Integer totalQuantity; // Tổng số lượng

    private Date createdAt;
    private Date updatedAt;
    private String createdBy;
    private String updatedBy;

    private List<CartItemResponse> items;
}