package com.hoangduyminh.exercise201.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

/**
 * DTO class cho thông báo
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private UUID id;
    private String title;
    private String content;
    private Boolean seen;
    private Date createdAt;
    private Date receiveTime;
    private Date notificationExpiryDate;
}