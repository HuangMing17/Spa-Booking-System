package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.Slideshow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Repository interface cho Slideshow entity
 */
@Repository
public interface SlideshowRepository extends JpaRepository<Slideshow, UUID> {

        /**
         * Lấy danh sách slideshow đang active
         */
        @Query("SELECT s FROM Slideshow s WHERE " +
                        "s.published = true AND " +
                        "s.startDate <= CURRENT_TIMESTAMP AND " +
                        "s.endDate > CURRENT_TIMESTAMP " +
                        "ORDER BY s.displayOrder")
        List<Slideshow> findActiveSlideshows();

        /**
         * Lấy danh sách slideshow theo thứ tự hiển thị
         */
        List<Slideshow> findAllByOrderByDisplayOrderAsc();

        /**
         * Lấy danh sách slideshow sắp hết hạn
         */
        @Query("SELECT s FROM Slideshow s WHERE " +
                        "s.published = true AND " +
                        "s.endDate BETWEEN :startDate AND :endDate")
        List<Slideshow> findExpiringSlideshows(Date startDate, Date endDate);

        /**
         * Kiểm tra có slideshow trùng thứ tự hiển thị
         */
        boolean existsByDisplayOrder(Integer displayOrder);
}