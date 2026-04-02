package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

        /**
         * Tìm đơn đặt lịch theo khách hàng
         */
        List<Order> findByCustomerId(UUID customerId);

        /**
         * Tìm đơn theo trạng thái
         */
        List<Order> findByOrderStatus_Id(UUID statusId);

        /**
         * Tìm đơn theo khách hàng và trạng thái
         */
        List<Order> findByCustomerIdAndOrderStatus_Id(UUID customerId, UUID statusId);

        /**
         * Tìm đơn theo thông tin khách hàng
         */
        @Query("SELECT o FROM Order o WHERE LOWER(o.customer.first_name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(o.customer.last_name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(o.id) LIKE LOWER(CONCAT('%', :keyword, '%'))")
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
        List<Order> findByCustomerIdAndOrderStatus_StatusName(UUID customerId, String statusName);

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
        List<Order> findByAppointmentDate(Date appointmentDate);

        /**
         * Tìm đơn theo khoảng thời gian hẹn
         */
        List<Order> findByAppointmentDateBetween(Date startDate, Date endDate);

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