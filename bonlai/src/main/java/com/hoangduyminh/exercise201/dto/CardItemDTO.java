package com.hoangduyminh.exercise201.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CardItemDTO {
    private UUID id;

    @NotNull(message = "ID giỏ hàng không được để trống")
    private UUID cardId;

    @NotNull(message = "ID sản phẩm không được để trống")
    private UUID productId;

    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer quantity;

    private BigDecimal price = BigDecimal.ZERO;
    private String notes;
}