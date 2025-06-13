package com.hoangduyminh.exercise201.service;

import com.hoangduyminh.exercise201.dto.ProductReviewDTO;

import java.util.List;
import java.util.UUID;

public interface ProductReviewService {
    ProductReviewDTO createReview(ProductReviewDTO reviewDTO);

    ProductReviewDTO updateReview(UUID reviewId, ProductReviewDTO reviewDTO);

    void deleteReview(UUID reviewId);

    List<ProductReviewDTO> getReviewsByProduct(UUID productId);

    List<ProductReviewDTO> getReviewsByCustomer(UUID customerId);

    ProductReviewDTO getReviewByProductAndCustomer(UUID productId, UUID customerId);
}