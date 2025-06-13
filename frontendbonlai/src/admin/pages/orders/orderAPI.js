import axiosInstance from "../../../utils/axios";

// Appointment status constants (using order system for appointment booking)
export const APPOINTMENT_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  
};

export const APPOINTMENT_STATUS_LABELS = {
  [APPOINTMENT_STATUS.PENDING]: "Chờ xác nhận",
  [APPOINTMENT_STATUS.CONFIRMED]: "Đã xác nhận",
  [APPOINTMENT_STATUS.COMPLETED]: "Hoàn thành",
  [APPOINTMENT_STATUS.CANCELLED]: "Đã hủy",
  [APPOINTMENT_STATUS.RECEIVED]: "Đã nhận dịch vụ",
};

export const APPOINTMENT_STATUS_COLORS = {
  [APPOINTMENT_STATUS.PENDING]: "orange",
  [APPOINTMENT_STATUS.CONFIRMED]: "blue",
  [APPOINTMENT_STATUS.COMPLETED]: "green",
  [APPOINTMENT_STATUS.CANCELLED]: "red",
  [APPOINTMENT_STATUS.RECEIVED]: "cyan",
};

// Keep old constants for backward compatibility
export const ORDER_STATUS = APPOINTMENT_STATUS;
export const ORDER_STATUS_LABELS = APPOINTMENT_STATUS_LABELS;
export const ORDER_STATUS_COLORS = APPOINTMENT_STATUS_COLORS;

// 0. Lấy tất cả lịch hẹn (Get all appointments)
export const getAllOrders = async () => {
  try {
    const response = await axiosInstance.get("/api/orders");
    return response; // axios interceptor already returns response.data
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
};

// Keep old function name for backward compatibility
export const fetchOrders = getAllOrders;

// 1. Tạo lịch hẹn mới (Create appointment)
export const createAppointment = async (appointmentData) => {
  try {
    const response = await axiosInstance.post("/api/orders", appointmentData);
    return response; // axios interceptor already returns response.data
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

// 2. Cập nhật lịch hẹn (Update appointment)
export const updateAppointment = async (id, appointmentData) => {
  try {
    const response = await axiosInstance.put(
      `/api/orders/${id}`,
      appointmentData
    );
    return response; // axios interceptor already returns response.data
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

// Keep old function names for backward compatibility
export const createOrder = createAppointment;
export const updateOrder = updateAppointment;

// 3. Hủy đơn hàng (cập nhật trạng thái thay vì xóa)
export const cancelOrder = async (id, customerId = null) => {
  try {
    console.log("Cancelling order:", { id, customerId });
    
    // If customerId is provided, use customer-specific endpoint (restricted to CANCELLED only)
    if (customerId) {
      console.log("Using customer-specific cancellation endpoint");
      const response = await axiosInstance.put(
        `/api/orders/customer/${id}/status/${APPOINTMENT_STATUS.CANCELLED}`,
        {
          statusCode: APPOINTMENT_STATUS.CANCELLED
        }
      );
      console.log("Customer cancellation successful:", response);
      return response;
    }
      // For admin users, use the general cancellation endpoint
    console.log("Using admin cancellation endpoint");
    const response = await axiosInstance.put(`/api/orders/${id}/status/${APPOINTMENT_STATUS.CANCELLED}`, {
      statusCode: APPOINTMENT_STATUS.CANCELLED
    });
    console.log("Admin cancellation successful:", response);
    return response;
  } catch (error) {
    console.error("Error cancelling order:", error);
    
    // Fallback to old method if the new endpoint doesn't exist
    try {
      console.log("Attempting fallback cancellation method");
      // First try with the DELETE method as per the Spring Boot controller
      const fallbackResponse = await axiosInstance.delete(`/api/orders/${id}`);
      console.log("Fallback cancellation successful:", fallbackResponse);
      return fallbackResponse;
    } catch (fallbackError) {
      console.error("Fallback cancellation also failed:", fallbackError);
      throw error; // Throw the original error
    }
  }
};

// 4. Xem chi tiết đơn hàng
export const getOrderById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/orders/${id}`);
    return response; // axios interceptor already returns response.data
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

// 5. Tìm kiếm đơn hàng
export const searchOrders = async (keyword) => {
  try {
    const response = await axiosInstance.get(`/api/orders/search`, {
      params: { keyword },
    });
    return response; // axios interceptor already returns response.data
  } catch (error) {
    console.error("Error searching orders:", error);
    throw error;
  }
};

// 6. Lấy đơn hàng theo khách hàng
export const getOrdersByCustomer = async (customerId) => {
  try {
    const response = await axiosInstance.get(
      `/api/orders/customer/${customerId}`
    );
    return response; // axios interceptor already returns response.data
  } catch (error) {
    console.error("Error fetching orders by customer:", error);
    throw error;
  }
};

// 7. Lấy đơn hàng theo trạng thái
export const getOrdersByStatus = async (statusId) => {
  try {
    const response = await axiosInstance.get(`/api/orders/status/${statusId}`);
    return response; // axios interceptor already returns response.data
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    throw error;
  }
};

// 8. Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (id, statusId) => {
  try {
    const response = await axiosInstance.put(
      `/api/orders/${id}/status/${statusId}`
    );
    return response; // axios interceptor already returns response.data
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// 9. Quản lý dịch vụ trong đơn hàng

// Thêm dịch vụ vào đơn hàng
export const addOrderItem = async (orderId, itemData) => {
  try {
    const response = await axiosInstance.post(
      `/api/orders/${orderId}/items`,
      itemData
    );
    return response; // axios interceptor already returns response.data
  } catch (error) {
    console.error("Error adding order item:", error);
    throw error;
  }
};

// Cập nhật dịch vụ trong đơn hàng
export const updateOrderItem = async (itemId, itemData) => {
  try {
    const response = await axiosInstance.put(
      `/api/orders/items/${itemId}`,
      itemData
    );
    return response; // axios interceptor already returns response.data
  } catch (error) {
    console.error("Error updating order item:", error);
    throw error;
  }
};

// Xóa dịch vụ khỏi đơn hàng
export const removeOrderItem = async (itemId) => {
  try {
    const response = await axiosInstance.delete(`/api/orders/items/${itemId}`);
    return response; // axios interceptor already returns response.data
  } catch (error) {
    console.error("Error removing order item:", error);
    throw error;
  }
};

// Lấy danh sách dịch vụ trong đơn hàng
export const getOrderItems = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/api/orders/${orderId}/items`);
    return response; // axios interceptor already returns response.data
  } catch (error) {
    console.error("Error fetching order items:", error);
    throw error;
  }
};

// 10. Quản lý mã giảm giá

// Áp dụng mã giảm giá
export const applyCoupon = async (orderId, couponCode) => {
  try {
    const response = await axiosInstance.post(
      `/api/orders/${orderId}/coupon/${couponCode}`
    );
    return response; // axios interceptor already returns response.data
  } catch (error) {
    console.error("Error applying coupon:", error);
    throw error;
  }
};

// Hủy mã giảm giá
export const removeCoupon = async (orderId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/orders/${orderId}/coupon`
    );
    return response; // axios interceptor already returns response.data
  } catch (error) {
    console.error("Error removing coupon:", error);
    throw error;
  }
};

// Utility functions

// Kiểm tra xem đơn hàng có thể chỉnh sửa không
export const canEditOrder = (status) => {
  return ![APPOINTMENT_STATUS.COMPLETED, APPOINTMENT_STATUS.CANCELLED].includes(
    status
  );
};

// Kiểm tra xem đơn hàng có thể hủy không
export const canCancelOrder = (status) => {
  return [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.CONFIRMED].includes(
    status
  );
};

// Tính tổng thời gian của đơn hàng
export const calculateTotalDuration = (items) => {
  return items.reduce((total, item) => {
    return total + (item.duration || 0) * (item.quantity || 1);
  }, 0);
};

// Tính tổng tiền của đơn hàng
export const calculateTotalAmount = (items, couponDiscount = 0) => {
  const subtotal = items.reduce((total, item) => {
    // Use totalPrice from API response, or calculate from unitPrice * quantity, fallback to old price field
    const itemTotal =
      item.totalPrice ||
      (item.unitPrice || item.price || 0) * (item.quantity || 1);
    return total + itemTotal;
  }, 0);
  return Math.max(0, subtotal - couponDiscount);
};
