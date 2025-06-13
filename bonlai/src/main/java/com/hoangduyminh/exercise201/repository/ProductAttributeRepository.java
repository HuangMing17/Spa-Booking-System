package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.Product;
import com.hoangduyminh.exercise201.entity.ProductAttribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductAttributeRepository extends JpaRepository<ProductAttribute, UUID> {

    /**
     * Tìm tất cả sản phẩm trong một phòng
     */
    List<ProductAttribute> findByAttributeId(UUID attributeId);

    /**
     * Tìm tất cả phòng của một sản phẩm
     */
    List<ProductAttribute> findByProductId(UUID productId);

    /**
     * Tìm thông tin phân bổ phòng cụ thể cho sản phẩm
     */
    ProductAttribute findByProductIdAndAttributeId(UUID productId, UUID attributeId);

    /**
     * Kiểm tra sản phẩm đã được phân bổ vào phòng chưa
     */
    boolean existsByProductIdAndAttributeId(UUID productId, UUID attributeId);

    /**
     * Xóa phân bổ phòng cho sản phẩm
     */
    void deleteByProductIdAndAttributeId(UUID productId, UUID attributeId);

    /**
     * Xóa tất cả phân bổ của một phòng
     */
    void deleteByAttributeId(UUID attributeId);

    /**
     * Xóa tất cả phân bổ phòng của một sản phẩm
     */
    void deleteByProductId(UUID productId);

    /**
     * Đếm số sản phẩm trong phòng
     */
    long countByAttributeId(UUID attributeId);

    /**
     * Đếm số phòng của sản phẩm
     */
    long countByProductId(UUID productId);

    List<ProductAttribute> findByProduct(Product product);

    void deleteByProduct(Product product);
}