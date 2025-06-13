package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface cho Tag entity
 */
@Repository
public interface TagRepository extends JpaRepository<Tag, UUID> {

        /**
         * Tìm kiếm tag theo tên
         */
        @Query("SELECT t FROM Tag t WHERE LOWER(t.tagName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
        List<Tag> searchTags(String keyword);

        /**
         * Tìm tag theo sản phẩm
         */
        @Query("SELECT DISTINCT t FROM Tag t " +
                        "JOIN ProductTag pt ON t.id = pt.tag.id " +
                        "WHERE pt.product.id = :productId")
        List<Tag> findByProduct(UUID productId);

        /**
         * Đếm số sản phẩm gắn tag
         */
        @Query("SELECT COUNT(pt) FROM ProductTag pt WHERE pt.tag.id = :tagId")
        Long countProductsByTag(UUID tagId);

        /**
         * Tìm tag được sử dụng nhiều nhất
         */
        @Query("SELECT t FROM Tag t " +
                        "LEFT JOIN ProductTag pt ON t.id = pt.tag.id " +
                        "GROUP BY t " +
                        "ORDER BY COUNT(pt) DESC")
        List<Tag> findMostUsedTags();

        /**
         * Tìm tag liên quan (cùng gắn với sản phẩm)
         */
        @Query("SELECT DISTINCT t2 FROM Tag t1 " +
                        "JOIN ProductTag pt1 ON t1.id = pt1.tag.id " +
                        "JOIN ProductTag pt2 ON pt1.product.id = pt2.product.id " +
                        "JOIN Tag t2 ON pt2.tag.id = t2.id " +
                        "WHERE t1.id = :tagId AND t2.id != :tagId")
        List<Tag> findRelatedTags(UUID tagId);

        Optional<Tag> findByTagName(String tagName);
}