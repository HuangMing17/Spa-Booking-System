package com.hoangduyminh.exercise201.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Date;
import java.util.UUID;

@Data
public class CartItemRequest {
    @NotNull(message = "ProductId không được để trống")
    private UUID productId;

    @NotNull(message = "Số lượng không được để trống")
    private Integer quantity;

    @NotNull(message = "VariantValueId không được để trống")
    private UUID variantValueId;

    @NotNull(message = "AttributeValueId không được để trống")
    private UUID attributeValueId;

    @NotNull(message = "AppointmentDate không được để trống")
    private Date appointmentDate;

    private String note;
}