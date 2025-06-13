package com.hoangduyminh.exercise201.dto.response;

import lombok.Data;
import java.util.Date;
import java.util.UUID;

/**
 * Response DTO cho Coupon
 * Chỉ chứa các trường có trong entity Coupon và stats tính toán
 */
@Data
public class CouponResponse {
    // Entity fields
    private UUID id;
    private String code;
    private String discountType;
    private Double discountValue;
    private Double minimumOrderAmount;
    private Integer maxUsage;
    private Date startDate;
    private Date endDate;

    // Stats (calculated fields)
    private Integer totalUsed;
    private Integer remainingUsage;
    private Double totalDiscountAmount;
    private Integer totalOrders;
    private Boolean isExpired;
    private Long daysUntilExpiry;
}