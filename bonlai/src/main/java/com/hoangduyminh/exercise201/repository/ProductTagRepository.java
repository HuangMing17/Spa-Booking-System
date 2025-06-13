package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.ProductTag;
import com.hoangduyminh.exercise201.entity.ProductTagId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductTagRepository extends JpaRepository<ProductTag, ProductTagId> {

    /**
     * Tìm tất cả tag của một sản phẩm
     */
    List<ProductTag> findByProduct_Id(UUID productId);

    /**
     * Tìm tất cả sản phẩm có tag
     */
    List<ProductTag> findByTag_Id(UUID tagId);

    /**
     * Xóa tag khỏi sản phẩm
     */
    @Modifying
    void deleteByProduct_IdAndTag_Id(UUID productId, UUID tagId);

    /**
     * Kiểm tra sản phẩm đã có tag chưa
     */
    boolean existsByProduct_IdAndTag_Id(UUID productId, UUID tagId);

    /**
     * Xóa tất cả liên kết của một tag
     */
    @Modifying
    void deleteByTag_Id(UUID tagId);

    /**
     * Xóa tất cả tag của một sản phẩm
     */
    @Modifying
    void deleteByProduct_Id(UUID productId);

    /**
     * Đếm số sản phẩm của một tag
     */
    long countByTag_Id(UUID tagId);

    /**
     * Đếm số tag của một sản phẩm
     */
    long countByProduct_Id(UUID productId);
}