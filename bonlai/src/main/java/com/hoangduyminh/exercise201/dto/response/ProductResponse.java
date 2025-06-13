package com.hoangduyminh.exercise201.dto.response;

import lombok.Data;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO cho Product
 */
@Data
public class ProductResponse {
    private UUID id;
    private String name;
    private String description;
    private String slug;
    private String thumbnail;
    private Double regularPrice;
    private Double salePrice;
    private Integer stock;
    private Boolean isActive;

    private Date createdAt;
    private Date updatedAt;
    private String createdBy;
    private String updatedBy;

    // Relationships
    private List<CategoryResponse> categories;
    private List<String> tagNames;
    private List<String> images; // Gallery URLs

    // Variants
    private List<UUID> variantIds;
    private List<String> variantNames;
    private List<Double> variantPrices;
    private List<Integer> variantDurations; // Thời lượng của từng gói (phút)

    // Attributes
    private List<UUID> attributeIds;
    private List<String> attributeNames;
    private List<String> attributeValues;

}