package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.Category;
import com.hoangduyminh.exercise201.entity.Product;
import com.hoangduyminh.exercise201.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface cho bảng product_categories
 */
@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, UUID> {

    /**
     * Tìm tất cả liên kết sản phẩm-danh mục theo danh mục
     */
    List<ProductCategory> findByCategory(Category category);

    /**
     * Tìm tất cả liên kết theo id danh mục
     */
    @Query("SELECT pc FROM ProductCategory pc WHERE pc.category.id = :categoryId")
    List<ProductCategory> findByCategoryId(UUID categoryId);

    /**
     * Đếm số sản phẩm trong danh mục
     */
    @Query("SELECT COUNT(pc) FROM ProductCategory pc WHERE pc.category.id = :categoryId")
    Long countProductsInCategory(UUID categoryId);

    /**
     * Kiểm tra sản phẩm có trong danh mục không
     */
    @Query("SELECT COUNT(pc) > 0 FROM ProductCategory pc " +
            "WHERE pc.category.id = :categoryId " +
            "AND pc.product.id = :productId")
    boolean existsByCategoryAndProduct(UUID categoryId, UUID productId);

    /**
     * Xóa tất cả liên kết sản phẩm-danh mục theo danh mục
     */
    void deleteByCategory(Category category);

    /**
     * Tìm tất cả liên kết sản phẩm-danh mục theo sản phẩm
     */
    List<ProductCategory> findByProduct(Product product);

    void deleteByProduct(Product product);
}