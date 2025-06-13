package com.hoangduyminh.exercise201.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * DTO class cho mã giảm giá
 */
@Data
public class CouponDTO {
    private UUID id;

    @NotBlank(message = "Code không được để trống")
    @Size(min = 3, max = 50, message = "Code phải từ 3-50 ký tự")
    @Pattern(regexp = "^[A-Z0-9_-]+$", message = "Code chỉ được chứa chữ hoa, số và các ký tự _-")
    private String code;

    @NotBlank(message = "Tên không được để trống")
    private String name;

    private String description;

    @NotNull(message = "Loại giảm giá không được để trống")
    private String type; // PERCENT, FIXED_AMOUNT

    @NotNull(message = "Giá trị giảm không được để trống")
    @DecimalMin(value = "0", message = "Giá trị giảm phải lớn hơn 0")
    private Double value;

    @DecimalMin(value = "0", message = "Giá trị đơn tối thiểu phải lớn hơn 0")
    private Double minOrderAmount;

    @DecimalMin(value = "0", message = "Giá trị giảm tối đa phải lớn hơn 0")
    private Double maxDiscountAmount;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private Date startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    private Date endDate;

    private Integer usageLimit; // Giới hạn số lần sử dụng
    private Integer usageCount; // Số lần đã sử dụng
    private Boolean isActive;
    private Boolean isPublic; // Hiển thị công khai hay không

    // Thống kê
    private Integer customerUsed; // Số khách hàng đã dùng
    private Double totalDiscountAmount; // Tổng tiền đã giảm
    private List<UUID> appliedServiceIds; // Các dịch vụ áp dụng được
}