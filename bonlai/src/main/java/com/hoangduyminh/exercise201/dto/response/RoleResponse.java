package com.hoangduyminh.exercise201.dto.response;

import lombok.Data;
import java.util.UUID;
import java.util.Date;

/**
 * Response DTO cho Role
 */
@Data
public class RoleResponse {
    private UUID id;
    private String name;
    private String description;
    private String code;
    private Boolean isActive;
    private Date createdAt;
    private Date updatedAt;
    private String createdBy;
    private String updatedBy;

    // Statistics
    private Integer staffCount;
    private Integer permissionCount;
}
