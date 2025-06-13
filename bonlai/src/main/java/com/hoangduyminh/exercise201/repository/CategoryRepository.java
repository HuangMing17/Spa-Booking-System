package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface cho Category entity
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

        /**
         * Tìm kiếm danh mục theo tên (không phân biệt hoa thường)
         */
        List<Category> findByCategoryNameContainingIgnoreCase(String name);

        /**
         * Tìm danh mục con trực tiếp
         */
        @Query("SELECT c FROM Category c WHERE c.parent.id = :parentId")
        List<Category> findByParentId(UUID parentId);

        /**
         * Đếm số danh mục con trực tiếp
         */
        @Query("SELECT COUNT(c) FROM Category c WHERE c.parent.id = :parentId")
        Long countChildCategories(UUID parentId);

        /**
         * Tìm danh mục root (không có parent)
         */
        @Query("SELECT c FROM Category c WHERE c.parent IS NULL")
        List<Category> findRootCategories();

        /**
         * Tìm danh mục active và có sản phẩm
         */
        @Query("SELECT DISTINCT c FROM Category c " +
                        "JOIN ProductCategory pc ON c.id = pc.category.id " +
                        "WHERE c.active = true")
        List<Category> findActiveWithProducts();

        /**
         * Tìm danh mục phổ biến (nhiều sản phẩm nhất)
         */
        @Query("SELECT c FROM Category c " +
                        "LEFT JOIN ProductCategory pc ON c.id = pc.category.id " +
                        "GROUP BY c " +
                        "ORDER BY COUNT(pc) DESC")
        List<Category> findPopularCategories();
}