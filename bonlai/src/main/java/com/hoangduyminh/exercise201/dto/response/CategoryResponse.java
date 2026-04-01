package com.hoangduyminh.exercise201.dto.response;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO for Category
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL) // Loại bỏ các trường null khỏi JSON response
public class CategoryResponse {
    private UUID id;
    private String name;
    private String description;

    private Boolean isActive;

    private UUID parentId;
    private String parentName;

    private Date createdAt;
    private Date updatedAt;
    private String createdBy;
    private String updatedBy;

    // Thống kê - chỉ xuất hiện trong các response chi tiết
    private Integer childCount; // Số lượng danh mục con
    private List<CategoryResponse> children; // Danh mục con
    private Integer productCount; // Số lượng sản phẩm
    private List<ProductResponse> products; // Sản phẩm trong danh mục
}