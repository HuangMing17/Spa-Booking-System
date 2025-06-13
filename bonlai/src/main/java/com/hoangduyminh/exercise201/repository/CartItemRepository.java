package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    List<CartItem> findByCart_Id(UUID cartId);

    void deleteByCart_Id(UUID cartId);

    boolean existsByCart_IdAndProductId(UUID cartId, UUID productId);

    Optional<CartItem> findByCart_IdAndProductId(UUID cartId, UUID productId);

    /**
     * Tìm các item theo ngày hẹn
     */
    @Query("SELECT ci FROM CartItem ci WHERE ci.appointmentDate = :appointmentDate")
    List<CartItem> findByAppointmentDate(Date appointmentDate);

    /**
     * Tìm các item theo khoảng thời gian
     */
    @Query("SELECT ci FROM CartItem ci WHERE ci.appointmentDate BETWEEN :startDate AND :endDate")
    List<CartItem> findByAppointmentDateBetween(Date startDate, Date endDate);

    /**
     * Kiểm tra xem có item nào trùng lịch không
     */
    @Query("SELECT COUNT(ci) > 0 FROM CartItem ci " +
            "WHERE ci.appointmentDate = :appointmentDate " +
            "AND ci.productId = :productId " +
            "AND ci.cart.id != :cartId")
    boolean existsOverlappingAppointment(Date appointmentDate, UUID productId, UUID cartId);
}