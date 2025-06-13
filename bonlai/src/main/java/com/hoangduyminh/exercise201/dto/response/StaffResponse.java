package com.hoangduyminh.exercise201.dto.response;

import lombok.Data;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO cho Staff
 */
@Data
public class StaffResponse {
    private UUID id;
    private String fullName;
    private String email;
    private String phone;
    private String username;
    private String avatar;
    private String address;
    private String position;
    private String department;
    private Boolean isActive;
    private String note;

    private Date createdAt;
    private Date updatedAt;
    private String createdBy;
    private String updatedBy;

    private List<RoleResponse> roles;

    // Stats
    private Integer totalCustomers;
    private Integer totalOrders;
    private Double totalRevenue;
    private Double averageRating;
    private Integer reviewCount;

    // Performance
    private Integer completedTasks;
    private Integer pendingTasks;
    private Double taskCompletionRate;
    private Date lastLogin;
    private String lastLoginIp;

    // Schedule
    private Integer upcomingBookings;
    private Date nextBookingTime;
    private List<String> workingDays;
    private String workingHours;
}