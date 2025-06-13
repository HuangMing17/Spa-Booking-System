package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.VariantValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VariantValueRepository extends JpaRepository<VariantValue, UUID> {

    /**
     * Đếm số lần khung giờ được sử dụng
     */
    long countByVariant_Id(UUID variantId);

    /**
     * Đếm số lần thời gian cụ thể được sử dụng
     */
    long countByVariant_VariantOption_Id(UUID optionId);

    /**
     * Tìm tất cả giá trị khung giờ của một sản phẩm
     */
    List<VariantValue> findByVariant_Product_Id(UUID productId);

    /**
     * Xóa tất cả giá trị khung giờ của một sản phẩm
     */
    void deleteByVariant_Product_Id(UUID productId);

    /**
     * Kiểm tra sản phẩm đã được gán khung giờ chưa
     */
    boolean existsByVariant_Product_IdAndVariant_Id(UUID productId, UUID variantId);

    /**
     * Kiểm tra sản phẩm đã được gán thời gian cụ thể chưa
     */
    boolean existsByVariant_Product_IdAndVariant_VariantOption_Id(UUID productId, UUID optionId);
}