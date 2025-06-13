package com.hoangduyminh.exercise201.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductReviewDTO {
    private UUID id;
    private UUID productId;
    private UUID customerId;
    private int rating;
    private String comment;
    private Date createdAt;
    private Date updatedAt;
    private String customerName; // optional: để hiển thị tên người review
}