package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface cho Cart entity
 */
@Repository
public interface CartRepository extends JpaRepository<Cart, UUID> {

        /**
         * Tìm giỏ hàng theo khách hàng
         */
        Optional<Cart> findByCustomerId(UUID customerId);

        /**
         * Kiểm tra tồn tại giỏ hàng theo khách
         */
        boolean existsByCustomerId(UUID customerId);

        /**
         * Đếm số lượng giỏ hàng của khách
         */
        @Query("SELECT COUNT(c) FROM Cart c WHERE c.customerId = :customerId")
        Long countCartsByCustomer(UUID customerId);

        /**
         * Tính tổng giá trị giỏ hàng
         */
        @Query("SELECT SUM(ci.quantity * ci.unitPrice) FROM Cart c " +
                        "JOIN CartItem ci ON c.id = ci.cart.id " +
                        "WHERE c.id = :cartId")
        Double calculateCartTotal(UUID cartId);

        /**
         * Tìm giỏ hàng có sản phẩm
         */
        @Query("SELECT DISTINCT c FROM Cart c " +
                        "JOIN CartItem ci ON c.id = ci.cart.id " +
                        "WHERE ci.productId = :productId")
        List<Cart> findCartsWithProduct(UUID productId);

        /**
         * Tìm giỏ hàng theo ngày hẹn
         */
        @Query("SELECT c FROM Cart c WHERE c.appointmentDate = :appointmentDate")
        List<Cart> findByAppointmentDate(Date appointmentDate);

        /**
         * Tìm giỏ hàng theo khoảng thời gian
         */
        @Query("SELECT c FROM Cart c WHERE c.appointmentDate BETWEEN :startDate AND :endDate")
        List<Cart> findByAppointmentDateBetween(Date startDate, Date endDate);

        /**
         * Tìm giỏ hàng được tạo trong khoảng thời gian
         */
        @Query("SELECT c FROM Cart c WHERE " +
                        "c.createdAt BETWEEN :startDate AND :endDate")
        List<Cart> findCartsBetweenDates(java.util.Date startDate, java.util.Date endDate);

        /**
         * Đếm số lượng item trong giỏ
         */
        @Query("SELECT COUNT(ci) FROM Cart c " +
                        "JOIN CartItem ci ON c.id = ci.cart.id " +
                        "WHERE c.id = :cartId")
        Long countItemsInCart(UUID cartId);

        /**
         * Tính tổng số lượng sản phẩm trong giỏ
         */
        @Query("SELECT SUM(ci.quantity) FROM Cart c " +
                        "JOIN CartItem ci ON c.id = ci.cart.id " +
                        "WHERE c.id = :cartId")
        Long calculateTotalQuantity(UUID cartId);
}