package com.hoangduyminh.exercise201.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private UUID id;
    private String orderId;

    @NotNull(message = "ID sản phẩm không được để trống")
    private UUID productId;

    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer quantity = 1;

    private Double unitPrice = 0.0;
    private Double totalPrice = 0.0;
    private Double discountAmount = 0.0;

    private String productName;
    private String serviceName;

    private String productThumbnail;

    // Thêm các trường cho variant
    private UUID variantId;
    private String variantName;
    private Integer duration; // Thời lượng dịch vụ (phút)
}
