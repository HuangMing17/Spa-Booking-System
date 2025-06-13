package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderStatusRepository extends JpaRepository<OrderStatus, UUID> {

    /**
     * Tìm trạng thái theo mã code
     */
    Optional<OrderStatus> findByStatusName(String statusName);

    /**
     * Kiểm tra mã trạng thái đã tồn tại chưa
     */
    boolean existsByStatusName(String statusName);

    /**
     * Tìm trạng thái theo tên
     */
    List<OrderStatus> findByStatusNameContainingIgnoreCase(String statusName);

    /**
     * Tìm tất cả trạng thái theo thứ tự xử lý
     */
    List<OrderStatus> findAllByOrderByStatusNameAsc();

    /**
     * Tìm tất cả trạng thái kết thúc
     */
    List<OrderStatus> findByStatusNameIn(List<String> statusNames);
}