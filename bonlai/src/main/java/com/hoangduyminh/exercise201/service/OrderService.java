package com.hoangduyminh.exercise201.service;

import com.hoangduyminh.exercise201.dto.OrderDTO;
import com.hoangduyminh.exercise201.dto.OrderItemDTO;

import java.util.Date;
import java.util.List;
import java.util.UUID;

public interface OrderService {
    /**
     * Tạo đơn đặt lịch mới
     * 
     * @param orderDTO thông tin đơn đặt lịch
     * @return đơn đặt lịch đã được tạo
     */
    OrderDTO createOrder(OrderDTO orderDTO);

    /**
     * Cập nhật thông tin đơn đặt lịch
     * 
     * @param id       id đơn đặt lịch
     * @param orderDTO thông tin mới
     * @return đơn đặt lịch đã cập nhật
     */
    OrderDTO updateOrder(String id, OrderDTO orderDTO);

    /**
     * Hủy đơn đặt lịch
     * 
     * @param id id đơn đặt lịch cần hủy
     */
    void cancelOrder(String id);

    /**
     * Lấy thông tin chi tiết đơn đặt lịch
     * 
     * @param id id đơn đặt lịch
     * @return thông tin chi tiết đơn
     */
    OrderDTO getOrderById(String id);

    /**
     * Tìm kiếm đơn đặt lịch
     * 
     * @param keyword từ khóa tìm kiếm (mã đơn, tên khách hàng)
     * @return danh sách đơn phù hợp
     */
    List<OrderDTO> searchOrders(String keyword);

    /**
     * Lấy danh sách đơn đặt lịch của khách hàng
     * 
     * @param customerId id khách hàng
     * @return danh sách đơn của khách hàng
     */
    List<OrderDTO> getOrdersByCustomer(UUID customerId);

    /**
     * Lấy danh sách đơn theo trạng thái
     * 
     * @param statusCode mã trạng thái (PENDING, CONFIRMED, PROCESSING, etc.)
     * @return danh sách đơn có trạng thái tương ứng
     */
    List<OrderDTO> getOrdersByStatus(String statusCode);

    /**
     * Cập nhật trạng thái đơn đặt lịch
     * 
     * @param id         id đơn đặt lịch
     * @param statusCode mã trạng thái (PENDING, CONFIRMED, PROCESSING, etc.)
     * @return đơn đặt lịch đã cập nhật
     */
    OrderDTO updateOrderStatus(String id, String statusCode);

    /**
     * Thêm dịch vụ vào đơn đặt lịch
     * 
     * @param orderId id đơn đặt lịch
     * @param itemDTO thông tin dịch vụ cần thêm
     * @return chi tiết dịch vụ đã thêm
     */
    OrderItemDTO addOrderItem(String orderId, OrderItemDTO itemDTO);

    /**
     * Cập nhật dịch vụ trong đơn
     * 
     * @param itemId  id dịch vụ cần cập nhật
     * @param itemDTO thông tin mới
     * @return chi tiết dịch vụ sau cập nhật
     */
    OrderItemDTO updateOrderItem(UUID itemId, OrderItemDTO itemDTO);

    /**
     * Xóa dịch vụ khỏi đơn
     * 
     * @param itemId id dịch vụ cần xóa
     */
    void removeOrderItem(UUID itemId);

    /**
     * Lấy danh sách dịch vụ trong đơn
     * 
     * @param orderId id đơn đặt lịch
     * @return danh sách dịch vụ trong đơn
     */
    List<OrderItemDTO> getOrderItems(String orderId);

    /**
     * Áp dụng mã giảm giá cho đơn
     * 
     * @param orderId    id đơn đặt lịch
     * @param couponCode mã giảm giá
     * @return đơn đặt lịch sau khi áp dụng giảm giá
     */
    OrderDTO applyCoupon(String orderId, String couponCode);

    /**
     * Hủy áp dụng mã giảm giá
     * 
     * @param orderId id đơn đặt lịch
     * @return đơn đặt lịch sau khi hủy giảm giá
     */
    OrderDTO removeCoupon(String orderId);

    /**
     * Lấy danh sách đơn theo ngày hẹn
     */
    List<OrderDTO> getOrdersByAppointmentDate(Date appointmentDate);

    /**
     * Lấy danh sách đơn theo khoảng thời gian hẹn
     */
    List<OrderDTO> getOrdersByAppointmentDateBetween(Date startDate, Date endDate);

    /**
     * Lấy danh sách tất cả đơn hàng
     * 
     * @return danh sách đơn hàng
     */
    List<OrderDTO> getAllOrders();
}