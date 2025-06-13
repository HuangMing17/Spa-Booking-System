package com.hoangduyminh.exercise201.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.Date;

/**
 * Request DTO cho Slideshow creation/update
 */
@Data
public class SlideshowRequest {

    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 255, message = "Tiêu đề không được quá 255 ký tự")
    private String title;

    @Size(max = 1000, message = "Mô tả không được quá 1000 ký tự")
    private String description;

    @NotBlank(message = "URL ảnh không được để trống")
    private String imageUrl;

    private String linkUrl;
    private String buttonText;

    @PositiveOrZero(message = "Thứ tự hiển thị phải lớn hơn hoặc bằng 0")
    private Integer displayOrder;

    private Boolean isActive;

    @Future(message = "Ngày bắt đầu phải là ngày trong tương lai")
    private Date startDate;

    @Future(message = "Ngày kết thúc phải là ngày trong tương lai")
    private Date endDate;
}