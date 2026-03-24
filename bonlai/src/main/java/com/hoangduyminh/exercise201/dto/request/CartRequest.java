package com.hoangduyminh.exercise201.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;
import java.util.UUID;

/**
 * Request DTO cho Cart creation/update
 */
@Data
public class CartRequest {

    @NotNull(message = "CustomerId không được để trống")
    private UUID customerId;

    private String note;

    @Valid
    private List<CartItemRequest> items;
}