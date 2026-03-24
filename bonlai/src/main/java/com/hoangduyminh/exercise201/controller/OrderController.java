package com.hoangduyminh.exercise201.controller;

import com.hoangduyminh.exercise201.dto.OrderDTO;
import com.hoangduyminh.exercise201.dto.OrderItemDTO;
import com.hoangduyminh.exercise201.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF')")
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderDTO orderDTO) {
        return ResponseEntity.ok(orderService.createOrder(orderDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF')")
    public ResponseEntity<OrderDTO> updateOrder(
            @PathVariable String id,
            @Valid @RequestBody OrderDTO orderDTO) {
        return ResponseEntity.ok(orderService.updateOrder(id, orderDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF')")
    public ResponseEntity<Void> cancelOrder(@PathVariable String id) {
        orderService.cancelOrder(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF')")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable String id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('STAFF')")
    public ResponseEntity<List<OrderDTO>> searchOrders(@RequestParam String keyword) {
        return ResponseEntity.ok(orderService.searchOrders(keyword));
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF')")
    public ResponseEntity<List<OrderDTO>> getOrdersByCustomer(@PathVariable UUID customerId) {
        return ResponseEntity.ok(orderService.getOrdersByCustomer(customerId));
    }

    @GetMapping("/status/{statusCode}")
    @PreAuthorize("hasAnyRole('STAFF')")
    public ResponseEntity<List<OrderDTO>> getOrdersByStatus(@PathVariable String statusCode) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(statusCode));
    }

    @PutMapping("/{id}/status/{statusCode}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable String id,
            @PathVariable String statusCode) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, statusCode));
    }

    @PutMapping("/customer/{id}/status/{statusCode}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<OrderDTO> updateOrderStatusByCustomer(
            @PathVariable String id,
            @PathVariable String statusCode) {
        if (!List.of("CANCELLED", "RECEIVED").contains(statusCode.toUpperCase())) {
            throw new IllegalArgumentException(
                    "Khách hàng chỉ có thể cập nhật trạng thái thành CANCELLED hoặc RECEIVED");
        }
        return ResponseEntity.ok(orderService.updateOrderStatus(id, statusCode));
    }

    @PostMapping("/{orderId}/items")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF')")
    public ResponseEntity<OrderItemDTO> addOrderItem(
            @PathVariable String orderId,
            @Valid @RequestBody OrderItemDTO itemDTO) {
        return ResponseEntity.ok(orderService.addOrderItem(orderId, itemDTO));
    }

    @PutMapping("/items/{itemId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF')")
    public ResponseEntity<OrderItemDTO> updateOrderItem(
            @PathVariable UUID itemId,
            @Valid @RequestBody OrderItemDTO itemDTO) {
        return ResponseEntity.ok(orderService.updateOrderItem(itemId, itemDTO));
    }

    @DeleteMapping("/items/{itemId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF')")
    public ResponseEntity<Void> removeOrderItem(@PathVariable UUID itemId) {
        orderService.removeOrderItem(itemId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{orderId}/items")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF')")
    public ResponseEntity<List<OrderItemDTO>> getOrderItems(@PathVariable String orderId) {
        return ResponseEntity.ok(orderService.getOrderItems(orderId));
    }

    /**
     * Lấy danh sách tất cả đơn hàng
     * 
     * @return danh sách đơn hàng
     */
    @GetMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}