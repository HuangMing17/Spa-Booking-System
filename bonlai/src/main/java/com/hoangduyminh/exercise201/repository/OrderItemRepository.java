package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {

    /**
     * Tìm tất cả dịch vụ trong đơn
     */
    @Query("""
        SELECT oi FROM OrderItem oi
        JOIN FETCH oi.product
        JOIN FETCH oi.order o
        LEFT JOIN FETCH o.customer
        LEFT JOIN FETCH o.orderStatus
        WHERE o.id = :orderId
    """)
    List<OrderItem> findByOrderId(@Param("orderId") String orderId);

    /**
     * Tìm dịch vụ theo sản phẩm
     */
    @EntityGraph(attributePaths = { "product", "order", "order.customer", "order.orderStatus" })
    List<OrderItem> findByProduct_Id(UUID productId);

    @Override
    @EntityGraph(attributePaths = { "product", "order", "order.customer", "order.orderStatus" })
    Optional<OrderItem> findById(UUID id);

    /**
     * Xóa tất cả dịch vụ trong đơn
     */
    void deleteByOrderId(String orderId);

    /**
     * Đếm số lượng dịch vụ trong đơn
     */
    long countByOrderId(String orderId);

    /**
     * Đếm số lần đặt của một dịch vụ
     */
    long countByProduct_Id(UUID productId);

    /**
     * Kiểm tra dịch vụ đã tồn tại trong đơn
     */
    boolean existsByOrderIdAndProduct_Id(String orderId, UUID productId);

    // Kiểm tra khách đã mua sản phẩm này chưa
    boolean existsByProduct_IdAndOrder_Customer_Id(UUID productId, UUID customerId);
}
