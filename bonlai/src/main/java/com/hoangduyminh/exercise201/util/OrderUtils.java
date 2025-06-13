package com.hoangduyminh.exercise201.util;

import com.hoangduyminh.exercise201.constant.OrderStatusConstant;
import com.hoangduyminh.exercise201.dto.OrderDTO;
import com.hoangduyminh.exercise201.exception.BusinessException;
import java.util.Arrays;

/**
 * Utility class for order processing
 */
public class OrderUtils {

    /**
     * Validate if order can be updated
     */
    public static void validateOrderUpdatable(String currentStatus) {
        if (Arrays.asList(OrderStatusConstant.LOCKED_STATUSES).contains(currentStatus)) {
            throw new BusinessException.OrderLocked(
                    "Không thể cập nhật đơn đặt lịch ở trạng thái này");
        }
    }

    /**
     * Validate if order can be cancelled
     */
    public static void validateOrderCancellable(String currentStatus) {
        if (!Arrays.asList(OrderStatusConstant.CANCELLABLE_STATUSES).contains(currentStatus)) {
            throw new BusinessException.InvalidOrderStatus(
                    "Không thể hủy đơn đặt lịch ở trạng thái này");
        }
    }

    /**
     * Validate if status transition is allowed
     */
    public static void validateStatusTransition(String fromStatus, String toStatus) {
        // Don't allow transition from final statuses
        if (Arrays.asList(OrderStatusConstant.FINAL_STATUSES).contains(fromStatus)) {
            throw new BusinessException.InvalidOrderStatus(
                    "Không thể thay đổi trạng thái của đơn đã hoàn thành");
        }

        // Only allow forward transitions based on order
        int currentIdx = getStatusIndex(fromStatus);
        int newIdx = getStatusIndex(toStatus);

        if (currentIdx == -1 || newIdx == -1) {
            throw new BusinessException("Trạng thái không hợp lệ");
        }

        if (newIdx <= currentIdx) {
            throw new BusinessException.InvalidOrderStatus(
                    "Không thể chuyển về trạng thái trước đó");
        }
    }

    /**
     * Get status index in the ordered list
     */
    private static int getStatusIndex(String status) {
        String[] statusOrder = {
                OrderStatusConstant.PENDING,
                OrderStatusConstant.CONFIRMED,
                OrderStatusConstant.PROCESSING,
                OrderStatusConstant.COMPLETED,
                OrderStatusConstant.CANCELLED,
                OrderStatusConstant.REFUNDED
        };

        for (int i = 0; i < statusOrder.length; i++) {
            if (statusOrder[i].equals(status)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Check if status is final
     */
    public static boolean isFinalStatus(String status) {
        return Arrays.asList(OrderStatusConstant.FINAL_STATUSES).contains(status);
    }

    /**
     * Check if status is locked
     */
    public static boolean isLockedStatus(String status) {
        return Arrays.asList(OrderStatusConstant.LOCKED_STATUSES).contains(status);
    }

    /**
     * Check if status can be cancelled
     */
    public static boolean isCancellable(String status) {
        return Arrays.asList(OrderStatusConstant.CANCELLABLE_STATUSES).contains(status);
    }

    private OrderUtils() {
        // Private constructor to prevent instantiation
    }
}