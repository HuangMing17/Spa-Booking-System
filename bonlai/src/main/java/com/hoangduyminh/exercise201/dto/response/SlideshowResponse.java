package com.hoangduyminh.exercise201.dto.response;

import lombok.Data;
import java.util.Date;
import java.util.UUID;

/**
 * Response DTO cho Slideshow
 */
@Data
public class SlideshowResponse {
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

    // Stats
    private Integer viewCount;
    private Integer clickCount;
    private Double clickThroughRate;
    private Date lastViewedAt;
    private Date lastClickedAt;
    private Boolean isExpired;
    private Long daysUntilExpiry;

    // Device stats
    private Integer mobileViews;
    private Integer desktopViews;
    private Integer tabletViews;
    private Double mobileClickRate;
    private Double desktopClickRate;
    private Double tabletClickRate;

    // Time stats
    private Integer morningViews; // 6-12h
    private Integer afternoonViews; // 12-18h
    private Integer eveningViews; // 18-24h
    private Integer nightViews; // 0-6h
    private Double peakViewHour;
    private Double peakClickHour;
}