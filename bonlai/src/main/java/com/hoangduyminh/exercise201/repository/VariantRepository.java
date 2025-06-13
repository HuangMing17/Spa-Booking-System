package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.Variant;
import com.hoangduyminh.exercise201.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VariantRepository extends JpaRepository<Variant, UUID> {

    /**
     * Tìm khung giờ theo tên
     */
    List<Variant> findByVariantOptionNameContainingIgnoreCase(String variantOptionName);

    /**
     * Tìm tất cả variants của một sản phẩm
     */
    List<Variant> findByProductId(UUID productId);

    /**
     * Xóa tất cả variants của một sản phẩm
     */
    void deleteByProduct(Product product);
}