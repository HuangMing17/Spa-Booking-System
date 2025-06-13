package com.hoangduyminh.exercise201.constant;

public class OrderStatusConstant {
        // Mã trạng thái
        public static final String PENDING = "PENDING";
        public static final String CONFIRMED = "CONFIRMED";
        public static final String PROCESSING = "PROCESSING";
        public static final String COMPLETED = "COMPLETED";
        public static final String CANCELLED = "CANCELLED";
        public static final String REFUNDED = "REFUNDED";

        // Trạng thái không cho phép sửa đổi
        public static final String[] LOCKED_STATUSES = {
                        COMPLETED,
                        CANCELLED,
                        REFUNDED
        };

        // Trạng thái cho phép hủy
        public static final String[] CANCELLABLE_STATUSES = {
                        PENDING,
                        CONFIRMED
        };

        // Trạng thái kết thúc
        public static final String[] FINAL_STATUSES = {
                        COMPLETED,
                        CANCELLED,
                        REFUNDED
        };

        // Thứ tự xử lý
        public static final String[] STATUS_ORDER = {
                        PENDING,
                        CONFIRMED,
                        PROCESSING,
                        COMPLETED,
                        CANCELLED,
                        REFUNDED
        };

        private OrderStatusConstant() {
                // Private constructor to prevent instantiation
        }
}