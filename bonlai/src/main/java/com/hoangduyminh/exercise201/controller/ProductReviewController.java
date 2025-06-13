package com.hoangduyminh.exercise201.controller;

import com.hoangduyminh.exercise201.dto.ProductReviewDTO;
import com.hoangduyminh.exercise201.service.ProductReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ProductReviewController {
    private final ProductReviewService productReviewService;

    public ProductReviewController(ProductReviewService productReviewService) {
        this.productReviewService = productReviewService;
    }

    // Thêm review cho sản phẩm
    @PostMapping("/products/{productId}/reviews")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF')")
    public ResponseEntity<ProductReviewDTO> createReview(
            @PathVariable UUID productId,
            @Valid @RequestBody ProductReviewDTO reviewDTO) {
        reviewDTO.setProductId(productId);
        return ResponseEntity.ok(productReviewService.createReview(reviewDTO));
    }

    // Lấy danh sách review theo sản phẩm
    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<List<ProductReviewDTO>> getReviewsByProduct(@PathVariable UUID productId) {
        return ResponseEntity.ok(productReviewService.getReviewsByProduct(productId));
    }

    // Sửa review
    @PutMapping("/reviews/{reviewId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF')")
    public ResponseEntity<ProductReviewDTO> updateReview(
            @PathVariable UUID reviewId,
            @Valid @RequestBody ProductReviewDTO reviewDTO) {
        return ResponseEntity.ok(productReviewService.updateReview(reviewId, reviewDTO));
    }

    // Xóa review
    @DeleteMapping("/reviews/{reviewId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF')")
    public ResponseEntity<Void> deleteReview(@PathVariable UUID reviewId) {
        productReviewService.deleteReview(reviewId);
        return ResponseEntity.ok().build();
    }

    // Lấy review của 1 khách cho 1 sản phẩm (nếu cần)
    @GetMapping("/products/{productId}/reviews/customer/{customerId}")
    public ResponseEntity<ProductReviewDTO> getReviewByProductAndCustomer(
            @PathVariable UUID productId,
            @PathVariable UUID customerId) {
        return ResponseEntity.ok(productReviewService.getReviewByProductAndCustomer(productId, customerId));
    }
}