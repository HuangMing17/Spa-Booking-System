package com.hoangduyminh.exercise201.controller;

import com.hoangduyminh.exercise201.dto.OrderDTO;
import com.hoangduyminh.exercise201.dto.OrderItemDTO;
import com.hoangduyminh.exercise201.repository.CustomerRepository;
import com.hoangduyminh.exercise201.repository.OrderItemRepository;
import com.hoangduyminh.exercise201.repository.OrderRepository;
import com.hoangduyminh.exercise201.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CustomerRepository customerRepository;

    public OrderController(
            OrderService orderService,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CustomerRepository customerRepository) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.customerRepository = customerRepository;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public ResponseEntity<OrderDTO> createOrder(
            @Valid @RequestBody OrderDTO orderDTO,
            Authentication authentication) {
        enforceCustomerOwnership(authentication, orderDTO.getCustomerId());
        return ResponseEntity.ok(orderService.createOrder(orderDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<OrderDTO> updateOrder(
            @PathVariable String id,
            @Valid @RequestBody OrderDTO orderDTO) {
        return ResponseEntity.ok(orderService.updateOrder(id, orderDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public ResponseEntity<Void> cancelOrder(@PathVariable String id, Authentication authentication) {
        enforceOrderAccess(authentication, id);
        orderService.cancelOrder(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable String id, Authentication authentication) {
        enforceOrderAccess(authentication, id);
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<OrderDTO>> searchOrders(@RequestParam String keyword) {
        return ResponseEntity.ok(orderService.searchOrders(keyword));
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public ResponseEntity<List<OrderDTO>> getOrdersByCustomer(
            @PathVariable UUID customerId,
            Authentication authentication) {
        enforceCustomerOwnership(authentication, customerId);
        return ResponseEntity.ok(orderService.getOrdersByCustomer(customerId));
    }

    @GetMapping("/status/{statusCode}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<OrderDTO>> getOrdersByStatus(@PathVariable String statusCode) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(statusCode));
    }

    @PutMapping("/{id}/status/{statusCode}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable String id,
            @PathVariable String statusCode) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, statusCode));
    }

    @PutMapping("/customer/{id}/status/{statusCode}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public ResponseEntity<OrderDTO> updateOrderStatusByCustomer(
            @PathVariable String id,
            @PathVariable String statusCode,
            Authentication authentication) {
        enforceOrderAccess(authentication, id);
        if (!List.of("CANCELLED", "RECEIVED").contains(statusCode.toUpperCase())) {
            throw new IllegalArgumentException(
                    "Khách hàng chỉ có thể cập nhật trạng thái thành CANCELLED hoặc RECEIVED");
        }
        return ResponseEntity.ok(orderService.updateOrderStatus(id, statusCode));
    }

    @PostMapping("/{orderId}/items")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public ResponseEntity<OrderItemDTO> addOrderItem(
            @PathVariable String orderId,
            @Valid @RequestBody OrderItemDTO itemDTO,
            Authentication authentication) {
        enforceOrderAccess(authentication, orderId);
        return ResponseEntity.ok(orderService.addOrderItem(orderId, itemDTO));
    }

    @PutMapping("/items/{itemId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public ResponseEntity<OrderItemDTO> updateOrderItem(
            @PathVariable UUID itemId,
            @Valid @RequestBody OrderItemDTO itemDTO,
            Authentication authentication) {
        enforceOrderItemAccess(authentication, itemId);
        return ResponseEntity.ok(orderService.updateOrderItem(itemId, itemDTO));
    }

    @DeleteMapping("/items/{itemId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public ResponseEntity<Void> removeOrderItem(@PathVariable UUID itemId, Authentication authentication) {
        enforceOrderItemAccess(authentication, itemId);
        orderService.removeOrderItem(itemId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{orderId}/items")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public ResponseEntity<List<OrderItemDTO>> getOrderItems(
            @PathVariable String orderId,
            Authentication authentication) {
        enforceOrderAccess(authentication, orderId);
        return ResponseEntity.ok(orderService.getOrderItems(orderId));
    }

    /**
     * Lấy danh sách tất cả đơn hàng
     * 
     * @return danh sách đơn hàng
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    private void enforceCustomerOwnership(Authentication authentication, UUID customerId) {
        if (!isCustomer(authentication)) {
            return;
        }

        UUID authenticatedCustomerId = customerRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new AccessDeniedException("Không xác định được khách hàng hiện tại"))
                .getId();

        if (!authenticatedCustomerId.equals(customerId)) {
            throw new AccessDeniedException("Bạn không có quyền truy cập dữ liệu của khách hàng khác");
        }
    }

    private void enforceOrderAccess(Authentication authentication, String orderId) {
        if (!isCustomer(authentication)) {
            return;
        }

        UUID ownerId = orderRepository.findById(orderId)
                .orElseThrow(() -> new AccessDeniedException("Không tìm thấy đơn hàng hoặc không có quyền truy cập"))
                .getCustomer()
                .getId();

        enforceCustomerOwnership(authentication, ownerId);
    }

    private void enforceOrderItemAccess(Authentication authentication, UUID itemId) {
        if (!isCustomer(authentication)) {
            return;
        }

        String orderId = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new AccessDeniedException("Không tìm thấy chi tiết đơn hoặc không có quyền truy cập"))
                .getOrder()
                .getId();

        enforceOrderAccess(authentication, orderId);
    }

    private boolean isCustomer(Authentication authentication) {
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_CUSTOMER".equals(authority.getAuthority()));
    }
}
