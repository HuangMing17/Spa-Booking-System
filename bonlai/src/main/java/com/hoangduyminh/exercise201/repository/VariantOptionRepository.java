package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.VariantOption;
import com.hoangduyminh.exercise201.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VariantOptionRepository extends JpaRepository<VariantOption, UUID> {

    /**
     * Tìm tất cả thời gian của một khung giờ
     */
    List<VariantOption> findByVariantsId(UUID variantId);

    /**
     * Tìm thời gian theo giá trị cụ thể
     */
    List<VariantOption> findByTitleContainingIgnoreCase(String title);

    /**
     * Tìm tất cả thời gian đang hoạt động
     */
    List<VariantOption> findByActiveTrue();

    /**
     * Đếm số lượng thời gian trong khung giờ
     */
    long countByVariantsId(UUID variantId);

    /**
     * Xóa tất cả thời gian của một khung giờ
     */
    void deleteByVariantsId(UUID variantId);

    /**
     * Kiểm tra giá trị thời gian đã tồn tại trong khung giờ chưa
     */
    boolean existsByVariantsIdAndTitleIgnoreCase(UUID variantId, String title);

    /**
     * Tìm thời gian đang được sử dụng bởi sản phẩm
     */
    List<VariantOption> findByProductId(UUID productId);

    /**
     * Tìm thời gian theo danh sách khung giờ
     */
    List<VariantOption> findByVariantsIdIn(List<UUID> variantIds);

    void deleteByProduct(Product product);
}