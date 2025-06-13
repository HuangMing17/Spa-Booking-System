package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.Gallery;
import com.hoangduyminh.exercise201.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GalleryRepository extends JpaRepository<Gallery, UUID> {

    /**
     * Lấy danh sách hình ảnh của một sản phẩm
     */
    List<Gallery> findByProductId(UUID productId);

    /**
     * Lấy danh sách hình ảnh của một sản phẩm
     */
    List<Gallery> findByProduct(Product product);

    /**
     * Lấy hình ảnh thumbnail của sản phẩm
     */
    Gallery findByProductIdAndIsThumbnailTrue(UUID productId);

    /**
     * Xóa tất cả hình ảnh của một sản phẩm
     */
    void deleteByProduct(Product product);

    /**
     * Đếm số lượng hình ảnh của một sản phẩm
     */
    long countByProductId(UUID productId);
}