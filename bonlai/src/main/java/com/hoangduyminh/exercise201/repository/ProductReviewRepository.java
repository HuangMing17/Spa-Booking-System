package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, UUID> {
    List<ProductReview> findByProduct_Id(UUID productId);

    List<ProductReview> findByCustomer_Id(UUID customerId);

    Optional<ProductReview> findByProduct_IdAndCustomer_Id(UUID productId, UUID customerId);

    boolean existsByProduct_IdAndCustomer_Id(UUID productId, UUID customerId);
}