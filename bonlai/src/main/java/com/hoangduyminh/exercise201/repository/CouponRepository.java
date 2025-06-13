package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface cho Coupon entity
 */
@Repository
public interface CouponRepository extends JpaRepository<Coupon, UUID> {

        /**
         * Tìm mã giảm giá theo code
         */
        Optional<Coupon> findByCode(String code);

        /**
         * Tìm kiếm mã giảm giá theo từ khóa
         */
        @Query("SELECT c FROM Coupon c WHERE " +
                        "LOWER(c.code) LIKE LOWER(CONCAT('%', :keyword, '%'))")
        List<Coupon> searchCoupons(String keyword);

        /**
         * Lấy danh sách mã còn hiệu lực
         */
        @Query("SELECT c FROM Coupon c WHERE " +
                        "c.couponStartDate <= CURRENT_TIMESTAMP AND " +
                        "c.couponEndDate > CURRENT_TIMESTAMP AND " +
                        "(c.maxUsage IS NULL OR c.timesUsed < c.maxUsage)")
        List<Coupon> findValidCoupons();

        /**
         * Lấy danh sách mã sắp hết hạn
         */
        @Query("SELECT c FROM Coupon c WHERE " +
                        "c.couponEndDate BETWEEN :startDate AND :endDate")
        List<Coupon> findExpiringCoupons(Date startDate, Date endDate);

        /**
         * Kiểm tra mã giảm giá có hiệu lực
         */
        @Query("SELECT COUNT(c) > 0 FROM Coupon c WHERE " +
                        "c.code = :code AND " +
                        "c.couponStartDate <= CURRENT_TIMESTAMP AND " +
                        "c.couponEndDate > CURRENT_TIMESTAMP AND " +
                        "(c.maxUsage IS NULL OR c.timesUsed < c.maxUsage)")
        boolean isValidCoupon(String code);

        /**
         * Kiểm tra khách hàng đã dùng mã chưa
         */
        @Query("SELECT COUNT(o) > 0 FROM Order o " +
                        "WHERE o.customer.id = :customerId AND o.coupon.code = :code")
        boolean hasCustomerUsedCoupon(UUID customerId, String code);

        /**
         * Kiểm tra mã có áp dụng cho sản phẩm không
         */
        @Query("SELECT COUNT(pc) > 0 FROM ProductCoupon pc " +
                        "WHERE pc.coupon.code = :code AND pc.product.id = :productId")
        boolean isValidForProduct(String code, UUID productId);

        /**
         * Kiểm tra mã có áp dụng cho danh mục không
         */
        @Query("SELECT COUNT(pc) > 0 FROM ProductCoupon pc " +
                        "JOIN ProductCategory pcat ON pc.product.id = pcat.product.id " +
                        "WHERE pc.coupon.code = :code AND pcat.category.id = :categoryId")
        boolean isValidForCategory(String code, UUID categoryId);

        /**
         * Tính tổng giá trị giảm giá đã sử dụng
         */
        @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.coupon.id = :couponId")
        Double calculateTotalOrderValueByCouponId(UUID couponId);

        /**
         * Đếm số lần sử dụng
         */
        @Query("SELECT COUNT(o) FROM Order o WHERE o.coupon.id = :couponId")
        Long countUsage(UUID couponId);

        /**
         * Lấy lần sử dụng cuối cùng
         */
        @Query("SELECT MAX(o.created_at) FROM Order o WHERE o.coupon.id = :couponId")
        Date getLastUsedDate(UUID couponId);

        /**
         * Kiểm tra code đã tồn tại
         */
        boolean existsByCode(String code);

        @Query("SELECT c FROM Coupon c WHERE c.couponStartDate <= ?1 AND c.couponEndDate >= ?1")
        List<Coupon> findValidCoupons(Date date);

        @Query("SELECT COUNT(DISTINCT o.customer.id) FROM Order o WHERE o.coupon.id = ?1")
        Long countCustomersByCouponId(UUID couponId);

        @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.coupon.id = ?1")
        Double calculateTotalDiscountByCouponId(UUID couponId);
}