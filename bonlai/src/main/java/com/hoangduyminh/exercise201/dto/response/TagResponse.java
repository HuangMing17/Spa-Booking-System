package com.hoangduyminh.exercise201.dto.response;

import lombok.Data;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO cho Tag
 */
@Data
public class TagResponse {
    private UUID id;
    private String name;
    private String description;
    private String slug;
    private String thumbnail;
    private Integer displayOrder;
    private Boolean isActive;
    private String type;

    private Date createdAt;
    private Date updatedAt;
    private String createdBy;
    private String updatedBy;

    // Related data
    private List<UUID> productIds;
    private List<String> productNames;

    // Stats
    private Integer productCount;
    private Integer viewCount;
    private Integer usageCount;
    private Date lastUsedAt;

    // Related tags
    private List<UUID> relatedTagIds;
    private List<String> relatedTagNames;
}