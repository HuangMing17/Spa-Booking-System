package com.hoangduyminh.exercise201.dto.response;

import lombok.Data;
import java.util.Date;
import java.util.UUID;

@Data
public class CartItemResponse {
    private UUID id;
    private UUID productId;
    private String productName;
    private Integer quantity;
    private Double unitPrice;
    private Double subtotal;

    // Variant info
    private String variantName;
    private Double variantPrice;
    private Integer duration;

    // Attribute info
    private String attributeName;
    private String attributeValue;

    // Appointment info
    private Date appointmentDate;
    private String note;
}
