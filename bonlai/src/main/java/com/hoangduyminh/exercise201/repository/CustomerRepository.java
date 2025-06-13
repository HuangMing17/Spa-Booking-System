package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface cho Customer entity
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {

        /**
         * Tìm khách hàng theo email
         */
        Optional<Customer> findByEmail(String email);

        /**
         * Tìm khách hàng theo số điện thoại
         */
        Optional<Customer> findByPhone(String phone);

        /**
         * Tìm khách hàng theo Firebase UID
         */
        Optional<Customer> findByFirebaseUid(String firebaseUid);

        /**
         * Tìm kiếm khách hàng theo từ khóa
         */
        @Query("SELECT c FROM Customer c WHERE " +
                        "LOWER(c.first_name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                        "LOWER(c.last_name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                        "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
        List<Customer> searchCustomers(String keyword);

        /**
         * Tính tổng số đơn hàng của khách
         */
        @Query("SELECT COUNT(o) FROM Order o WHERE o.customer.id = :customerId")
        Long countOrdersByCustomer(UUID customerId);

        /**
         * Tính tổng chi tiêu của khách
         */
        @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.customer.id = :customerId")
        Double calculateTotalSpentByCustomer(UUID customerId);

        /**
         * Lấy ngày đặt đơn gần nhất
         */
        @Query("SELECT MAX(o.created_at) FROM Order o WHERE o.customer.id = :customerId")
        Date getLastOrderDate(UUID customerId);

        /**
         * Đếm số đơn hàng chưa hoàn thành
         */
        @Query("SELECT COUNT(o) FROM Order o WHERE " +
                        "o.customer.id = :customerId AND " +
                        "o.orderStatus.statusName NOT IN ('COMPLETED', 'CANCELLED', 'REFUNDED')")
        Long countUpcomingBookings(UUID customerId);        /**
         * Lấy danh sách khách hàng đăng ký trong khoảng thời gian
         * 
         * @param fromDate ngày bắt đầu
         * @return danh sách khách hàng đăng ký sau ngày fromDate
         */
        @Query("SELECT c FROM Customer c WHERE c.registered_at >= :fromDate ORDER BY c.registered_at DESC")
        List<Customer> findByRegisteredAtAfter(@org.springframework.data.repository.query.Param("fromDate") Date fromDate);

        /**
         * Kiểm tra email đã tồn tại
         */
        boolean existsByEmail(String email);

        /**
         * Kiểm tra phone đã tồn tại
         */
        boolean existsByPhone(String phone);
}