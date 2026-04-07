package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    @Override
    @Query("""
        SELECT DISTINCT o FROM Order o
        LEFT JOIN FETCH o.customer
        LEFT JOIN FETCH o.orderStatus
        LEFT JOIN FETCH o.orderItems oi
        LEFT JOIN FETCH oi.product
    """)
    List<Order> findAll();

    @Override
    @Query("""
        SELECT DISTINCT o FROM Order o
        LEFT JOIN FETCH o.customer
        LEFT JOIN FETCH o.orderStatus
        LEFT JOIN FETCH o.orderItems oi
        LEFT JOIN FETCH oi.product
        WHERE o.id = :id
    """)
    Optional<Order> findById(@Param("id") String id);

        /**
         * Tìm đơn đặt lịch theo khách hàng
         */
        @Query("""
            SELECT DISTINCT o FROM Order o
            LEFT JOIN FETCH o.customer
            LEFT JOIN FETCH o.orderStatus
            LEFT JOIN FETCH o.orderItems oi
            LEFT JOIN FETCH oi.product
            WHERE o.customer.id = :customerId
        """)
        List<Order> findByCustomerId(@Param("customerId") UUID customerId);

        /**
         * Tìm đơn theo trạng thái
         */
        @Query("""
            SELECT DISTINCT o FROM Order o
            LEFT JOIN FETCH o.customer
            LEFT JOIN FETCH o.orderStatus
            LEFT JOIN FETCH o.orderItems oi
            LEFT JOIN FETCH oi.product
            WHERE o.orderStatus.id = :statusId
        """)
        List<Order> findByOrderStatus_Id(@Param("statusId") UUID statusId);

        /**
         * Tìm đơn theo khách hàng và trạng thái
         */
        @Query("""
            SELECT DISTINCT o FROM Order o
            LEFT JOIN FETCH o.customer
            LEFT JOIN FETCH o.orderStatus
            LEFT JOIN FETCH o.orderItems oi
            LEFT JOIN FETCH oi.product
            WHERE o.customer.id = :customerId AND o.orderStatus.id = :statusId
        """)
        List<Order> findByCustomerIdAndOrderStatus_Id(
                        @Param("customerId") UUID customerId,
                        @Param("statusId") UUID statusId);

        /**
         * Tìm đơn theo thông tin khách hàng
         */
        @Query("""
            SELECT DISTINCT o FROM Order o
            LEFT JOIN FETCH o.customer
            LEFT JOIN FETCH o.orderStatus
            LEFT JOIN FETCH o.orderItems oi
            LEFT JOIN FETCH oi.product
            WHERE LOWER(o.customer.first_name) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(o.customer.last_name) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(o.id) LIKE LOWER(CONCAT('%', :keyword, '%'))
        """)
        List<Order> findByCustomer_first_nameContainingIgnoreCaseOrCustomer_last_nameContainingIgnoreCaseOrIdContainingIgnoreCase(
                        @Param("keyword") String keyword);


        /**
         * Đếm số đơn theo trạng thái
         */
        long countByOrderStatus_Id(UUID statusId);

        /**
         * Đếm số đơn của khách hàng
         */
        long countByCustomerId(UUID customerId);


        /**
         * Tìm đơn chưa hoàn thành của khách hàng
         */
        @Query("""
            SELECT DISTINCT o FROM Order o
            LEFT JOIN FETCH o.customer
            LEFT JOIN FETCH o.orderStatus
            LEFT JOIN FETCH o.orderItems oi
            LEFT JOIN FETCH oi.product
            WHERE o.customer.id = :customerId AND o.orderStatus.statusName = :statusName
        """)
        List<Order> findByCustomerIdAndOrderStatus_StatusName(
                        @Param("customerId") UUID customerId,
                        @Param("statusName") String statusName);

        /**
         * Tìm đơn theo khoảng thời gian
         */
        @Query("SELECT o FROM Order o WHERE o.created_at BETWEEN :startDate AND :endDate")
        List<Order> findByCreated_atBetween(
                        @Param("startDate") java.util.Date startDate,
                        @Param("endDate") java.util.Date endDate);

        /**
         * Kiểm tra khách hàng có đơn chưa hoàn thành không
         */
        boolean existsByCustomerIdAndOrderStatus_StatusName(UUID customerId, String statusName);

        /**
         * Tìm đơn theo ngày hẹn
         */
        @Query("""
            SELECT DISTINCT o FROM Order o
            LEFT JOIN FETCH o.customer
            LEFT JOIN FETCH o.orderStatus
            LEFT JOIN FETCH o.orderItems oi
            LEFT JOIN FETCH oi.product
            WHERE o.appointmentDate = :appointmentDate
        """)
        List<Order> findByAppointmentDate(@Param("appointmentDate") Date appointmentDate);

        /**
         * Tìm đơn theo khoảng thời gian hẹn
         */
        @Query("""
            SELECT DISTINCT o FROM Order o
            LEFT JOIN FETCH o.customer
            LEFT JOIN FETCH o.orderStatus
            LEFT JOIN FETCH o.orderItems oi
            LEFT JOIN FETCH oi.product
            WHERE o.appointmentDate BETWEEN :startDate AND :endDate
        """)
        List<Order> findByAppointmentDateBetween(
                        @Param("startDate") Date startDate,
                        @Param("endDate") Date endDate);

        /**
         * Kiểm tra trùng lịch hẹn (cùng service, cùng ngày giờ) bỏ qua lịch đã hủy
         */
        @Query("""
            SELECT COUNT(o) > 0 FROM Order o JOIN OrderItem i ON i.order.id = o.id
            WHERE i.product.id = :productId 
            AND o.appointmentDate = :appointmentDate
            AND o.orderStatus.statusName NOT IN ('CANCELLED', 'REJECTED', 'FAILED')
        """)
        boolean existsBySlot(
          @Param("productId") UUID productId, 
          @Param("appointmentDate") Date appointmentDate
        );
}
