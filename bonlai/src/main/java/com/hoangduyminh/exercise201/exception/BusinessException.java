package com.hoangduyminh.exercise201.exception;

public class BusinessException extends RuntimeException {
    private final String code;

    public BusinessException(String message) {
        super(message);
        this.code = "BUSINESS_ERROR";
    }

    public BusinessException(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public static class InvalidOrderStatus extends BusinessException {
        public InvalidOrderStatus(String message) {
            super("INVALID_ORDER_STATUS", message);
        }
    }

    public static class OrderLocked extends BusinessException {
        public OrderLocked(String message) {
            super("ORDER_LOCKED", message);
        }
    }

    public static class DuplicateService extends BusinessException {
        public DuplicateService(String message) {
            super("DUPLICATE_SERVICE", message);
        }
    }

    public static class TimeSlotNotAvailable extends BusinessException {
        public TimeSlotNotAvailable(String message) {
            super("TIME_SLOT_NOT_AVAILABLE", message);
        }
    }

    public static class RoomNotAvailable extends BusinessException {
        public RoomNotAvailable(String message) {
            super("ROOM_NOT_AVAILABLE", message);
        }
    }

    public static class ServiceNotAvailable extends BusinessException {
        public ServiceNotAvailable(String message) {
            super("SERVICE_NOT_AVAILABLE", message);
        }
    }

    public static class CustomerNotAvailable extends BusinessException {
        public CustomerNotAvailable(String message) {
            super("CUSTOMER_NOT_AVAILABLE", message);
        }
    }

    public static class InvalidVariant extends BusinessException {
        public InvalidVariant(String message) {
            super(message);
        }
    }
}