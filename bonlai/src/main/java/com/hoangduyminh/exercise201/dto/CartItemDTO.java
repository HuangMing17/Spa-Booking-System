package com.hoangduyminh.exercise201.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class CartItemDTO {
    private UUID id;
    private UUID cartId;
    private UUID productId;
    private String productName;
    private Integer quantity;
    private Double unitPrice;
    private Double totalPrice;
    private UUID variantId; // timeSlot id
    private String variantName; // timeSlot name
    private UUID attributeId; // room id
    private String attributeName; // room name
    private String note;
}