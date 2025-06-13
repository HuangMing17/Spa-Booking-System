package com.hoangduyminh.exercise201.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.Date;

/**
 * Request DTO cho Coupon creation/update
 * Chỉ chứa các trường có trong entity Coupon
 */
@Data
public class CouponRequest {

    
    private String code;

    private String discountType; // PERCENTAGE, FIXED_AMOUNT

   
    private Double discountValue;

   
    private Double minimumOrderAmount;

  private Integer maxUsage;

   
    private Date startDate;


    private Date endDate;
}