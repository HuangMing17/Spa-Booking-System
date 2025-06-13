package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface cho Product entity
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

        /**
         * Tìm kiếm sản phẩm theo tên hoặc mô tả
         */
        @Query("SELECT p FROM Product p WHERE " +
                        "LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                        "LOWER(p.productDescription) LIKE LOWER(CONCAT('%', :keyword, '%'))")
        List<Product> searchProducts(String keyword);

        /**
         * Tìm sản phẩm theo slug
         */
        Optional<Product> findBySlug(String slug);

        /**
         * Tìm sản phẩm theo danh mục
         */
        @Query("SELECT DISTINCT p FROM Product p " +
                        "JOIN ProductCategory pc ON p.id = pc.product.id " +
                        "WHERE pc.category.id = :categoryId")
        List<Product> findByCategory(UUID categoryId);

        /**
         * Tìm sản phẩm theo tag
         */
        @Query("SELECT DISTINCT p FROM Product p " +
                        "JOIN ProductTag pt ON p.id = pt.product.id " +
                        "WHERE pt.tag.id = :tagId")
        List<Product> findByTag(UUID tagId);

        /**
         * Đếm số lượng đơn hàng của sản phẩm
         */
        @Query("SELECT COUNT(oi) FROM OrderItem oi WHERE oi.product.id = :productId")
        Long countOrdersByProduct(UUID productId);

        /**
         * Tính tổng số lượng đã bán
         */
        @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi WHERE oi.product.id = :productId")
        Long countTotalSold(UUID productId);

        /**
         * Tìm sản phẩm theo loại
         */
        List<Product> findByProductType(Product.ProductType productType);

        /**
         * Tìm sản phẩm đang active
         */
        List<Product> findByPublishedTrue();

        /**
         * Tìm sản phẩm theo khoảng giá
         */
        @Query("SELECT p FROM Product p WHERE p.salePrice BETWEEN :minPrice AND :maxPrice")
        List<Product> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);

        /**
         * Tìm sản phẩm theo SKU
         */
        Optional<Product> findBySku(String sku);
}