package com.hoangduyminh.exercise201.dto;

import lombok.Data;
import java.util.Date;
import java.util.UUID;

/**
 * DTO cho Slideshow - Support cho các method cũ
 */
@Data
public class SlideshowDTO {
    private UUID id;
    private String title;
    private String description;
    private String imageUrl;
    private String linkUrl;
    private String buttonText;
    private Integer displayOrder;
    private Boolean isActive;
    private Date startDate;
    private Date endDate;
    private Date createdAt;
    private Date updatedAt;
    private String createdBy;
    private String updatedBy;
}