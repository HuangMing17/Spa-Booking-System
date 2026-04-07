package com.hoangduyminh.exercise201.service.impl;

import com.hoangduyminh.exercise201.constant.OrderStatusConstant;
import com.hoangduyminh.exercise201.dto.OrderDTO;
import com.hoangduyminh.exercise201.dto.OrderItemDTO;
import com.hoangduyminh.exercise201.entity.*;
import com.hoangduyminh.exercise201.exception.BusinessException;
import com.hoangduyminh.exercise201.exception.ResourceNotFoundException;
import com.hoangduyminh.exercise201.repository.*;
import com.hoangduyminh.exercise201.service.EmailService;
import com.hoangduyminh.exercise201.service.OrderService;
import com.hoangduyminh.exercise201.util.OrderUtils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final GalleryRepository galleryRepository;
    private final VariantOptionRepository variantOptionRepository;
    private final EmailService emailService;

    public OrderServiceImpl(OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            OrderStatusRepository orderStatusRepository,
            CustomerRepository customerRepository,
            ProductRepository productRepository,
            GalleryRepository galleryRepository,
            VariantOptionRepository variantOptionRepository,
            EmailService emailService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderStatusRepository = orderStatusRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.galleryRepository = galleryRepository;
        this.variantOptionRepository = variantOptionRepository;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public OrderDTO createOrder(OrderDTO orderDTO) {
        // Kiểm tra khách hàng
        Customer customer = customerRepository.findById(orderDTO.getCustomerId())
                .orElseThrow(() -> new BusinessException.CustomerNotAvailable("Khách hàng không tồn tại"));

        // Tìm trạng thái đầu tiên
        OrderStatus initialStatus = orderStatusRepository.findByStatusName(OrderStatusConstant.PENDING)
                .orElseThrow(() -> new IllegalStateException("Chưa cấu hình trạng thái đơn hàng"));

        // Kiểm tra trùng lịch hẹn TRƯỚC khi save
        if (orderDTO.getItems() != null && !orderDTO.getItems().isEmpty()) {
            for (OrderItemDTO itemDTO : orderDTO.getItems()) {
                if (orderRepository.existsBySlot(itemDTO.getProductId(), orderDTO.getAppointmentDate())) {
                    throw new BusinessException.TimeSlotNotAvailable("Khung giờ này đã được đặt. Vui lòng chọn giờ khác!");
                }
            }
        }

        Order order = new Order();
        order.setId(UUID.randomUUID().toString());
        order.setCustomer(customer);
        order.setOrderStatus(initialStatus);
        order.setAppointmentDate(orderDTO.getAppointmentDate());
        order.setTotalPrice(BigDecimal.ZERO);
        
        // Handle VNPay integration fields mapping during creation
        if (orderDTO.getPaymentMethod() != null) {
            order.setPaymentMethod(orderDTO.getPaymentMethod());
        }

        // Lưu order trước để có ID
        Order savedOrder = orderRepository.save(order);

        // Xử lý các order items nếu có
        if (orderDTO.getItems() != null && !orderDTO.getItems().isEmpty()) {
            for (OrderItemDTO itemDTO : orderDTO.getItems()) {
                Product product = productRepository.findById(itemDTO.getProductId())
                        .orElseThrow(() -> new BusinessException.ServiceNotAvailable("Dịch vụ không tồn tại"));

                // Kiểm tra variant có hợp lệ không
                if (itemDTO.getVariantId() != null) {
                    VariantOption variantOption = variantOptionRepository.findById(itemDTO.getVariantId())
                            .orElseThrow(() -> new BusinessException.InvalidVariant("Biến thể không tồn tại"));

                    // Kiểm tra variant có thuộc về sản phẩm không
                    if (!variantOption.getProduct().getId().equals(product.getId())) {
                        throw new BusinessException.InvalidVariant("Biến thể không thuộc về sản phẩm này");
                    }

                    // Set giá và thời lượng theo variant
                    itemDTO.setUnitPrice(variantOption.getSale_price().doubleValue());
                    itemDTO.setDuration(variantOption.getDuration());
                    itemDTO.setVariantName(variantOption.getTitle());
                }

                OrderItem item = new OrderItem();
                item.setId(UUID.randomUUID());
                item.setOrder(savedOrder);
                item.setProduct(product);
                item.setQuantity(itemDTO.getQuantity() != null ? itemDTO.getQuantity() : 1);
                item.setPrice(BigDecimal.valueOf(itemDTO.getUnitPrice() != null ? itemDTO.getUnitPrice() : 0.0));
                item.setVariantId(itemDTO.getVariantId());
                item.setVariantName(itemDTO.getVariantName());
                item.setDuration(itemDTO.getDuration());

                orderItemRepository.save(item);
            }

            // Tính lại tổng tiền
            calculateAndUpdateTotalPrice(savedOrder);
        }

        // Refresh order từ database để có đầy đủ dữ liệu
        Order refreshedOrder = orderRepository.findById(savedOrder.getId())
                .orElse(savedOrder);

        OrderDTO result = toDTO(refreshedOrder);

        // Đảm bảo có đầy đủ dữ liệu trước khi gửi email
        if (result.getCustomerEmail() != null && !result.getCustomerEmail().trim().isEmpty()) {
            try {
                log.info("Sending booking confirmation email for order: {} to customer: {}",
                        result.getId(), result.getCustomerEmail());
                emailService.sendBookingConfirmationEmail(result);
                log.info("Booking confirmation email queued successfully for order: {}", result.getId());
            } catch (Exception e) {
                log.error("Failed to send booking confirmation email for order: {}", result.getId(), e);
                // Không throw exception để không ảnh hưởng đến việc tạo order
            }
        } else {
            log.warn("Cannot send booking confirmation email: customer email is null or empty for order {}",
                    result.getId());
        }

        return result;
    }

    @Override
    @Transactional
    public OrderDTO updateOrder(String id, OrderDTO orderDTO) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn đặt lịch", "id", id));

        // Kiểm tra trạng thái có cho phép cập nhật
        OrderStatus status = existingOrder.getOrderStatus();
        OrderUtils.validateOrderUpdatable(status.toString());

        // Cập nhật appointmentDate nếu có
        if (orderDTO.getAppointmentDate() != null) {
            existingOrder.setAppointmentDate(orderDTO.getAppointmentDate());
        }

        Order updatedOrder = orderRepository.save(existingOrder);
        return toDTO(updatedOrder);
    }

    @Override
    @Transactional
    public void cancelOrder(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn đặt lịch", "id", id));

        OrderStatus status = order.getOrderStatus();
        OrderUtils.validateOrderCancellable(status.toString());

        OrderStatus cancelStatus = orderStatusRepository.findByStatusName(OrderStatusConstant.CANCELLED)
                .orElseThrow(() -> new IllegalStateException("Chưa cấu hình trạng thái hủy đơn"));

        order.setOrderStatus(cancelStatus);
        orderRepository.save(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDTO getOrderById(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn đặt lịch", "id", id));
        return toDTO(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> searchOrders(String keyword) {
        return orderRepository
                .findByCustomer_first_nameContainingIgnoreCaseOrCustomer_last_nameContainingIgnoreCaseOrIdContainingIgnoreCase(
                        keyword)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByCustomer(UUID customerId) {
        return orderRepository.findByCustomerId(customerId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByStatus(String statusCode) {
        OrderStatus status = orderStatusRepository.findByStatusName(statusCode)
                .orElseThrow(() -> new ResourceNotFoundException("Trạng thái", "code", statusCode));

        return orderRepository.findByOrderStatus_Id(status.getId())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderDTO updateOrderStatus(String id, String statusCode) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn đặt lịch", "id", id));

        OrderStatus oldStatus = order.getOrderStatus();
        OrderStatus newStatus = orderStatusRepository.findByStatusName(statusCode)
                .orElseThrow(() -> new ResourceNotFoundException("Trạng thái", "code", statusCode));

        OrderUtils.validateStatusTransition(
                oldStatus.getStatusName(),
                newStatus.getStatusName());

        order.setOrderStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);
        OrderDTO result = toDTO(updatedOrder);

        // Gửi email thông báo cập nhật trạng thái (nếu có thay đổi thực sự)
        if (!oldStatus.getStatusName().equals(newStatus.getStatusName())) {
            try {
                log.info("Sending order status update email for order: {} from {} to {}",
                        result.getId(), oldStatus.getStatusName(), newStatus.getStatusName());
                emailService.sendOrderStatusUpdateEmail(result);
            } catch (Exception e) {
                log.error("Failed to send order status update email for order: {}", result.getId(), e);
                // Không throw exception để không ảnh hưởng đến việc cập nhật trạng thái
            }
        }

        return result;
    }

    @Override
    @Transactional
    public OrderDTO updatePaymentStatus(String orderId, String transactionId, String paymentStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn đặt lịch", "id", orderId));

        order.setPaymentStatus(paymentStatus);
        
        // Nếu thanh toán VNPay gửi về Transaction ID thật, lưu vào để đối soát
        if (transactionId != null && !transactionId.trim().isEmpty()) {
            order.setTransactionId(transactionId);
        }
        
        // Tích hợp Task 2.5: Đổi trạng thái toàn bộ hoá đơn thành CONFIRMED
        if ("PAID".equals(paymentStatus)) {
            OrderStatus confirmedStatus = orderStatusRepository.findByStatusName(OrderStatusConstant.CONFIRMED)
                    .orElseThrow(() -> new IllegalStateException("Chưa cấu hình trạng thái CONFIRMED"));
            order.setOrderStatus(confirmedStatus);
        }

        Order updatedOrder = orderRepository.save(order);
        return toDTO(updatedOrder);
    }

    @Override
    @Transactional
    public OrderItemDTO addOrderItem(String orderId, OrderItemDTO itemDTO) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn đặt lịch", "id", orderId));

        OrderUtils.validateOrderUpdatable(order.getOrderStatus().toString());

        Product product = productRepository.findById(itemDTO.getProductId())
                .orElseThrow(() -> new BusinessException.ServiceNotAvailable("Dịch vụ không tồn tại"));

        // Kiểm tra variant có hợp lệ không
        if (itemDTO.getVariantId() != null) {
            VariantOption variantOption = variantOptionRepository.findById(itemDTO.getVariantId())
                    .orElseThrow(() -> new BusinessException.InvalidVariant("Biến thể không tồn tại"));

            // Kiểm tra variant có thuộc về sản phẩm không
            if (!variantOption.getProduct().getId().equals(product.getId())) {
                throw new BusinessException.InvalidVariant("Biến thể không thuộc về sản phẩm này");
            }

            // Set giá và thời lượng theo variant
            itemDTO.setUnitPrice(variantOption.getSale_price().doubleValue());
            itemDTO.setDuration(variantOption.getDuration());
            itemDTO.setVariantName(variantOption.getTitle());
        }

        if (orderItemRepository.existsByOrderIdAndProduct_Id(orderId, itemDTO.getProductId())) {
            throw new BusinessException.DuplicateService("Dịch vụ đã có trong đơn");
        }

        OrderItem item = new OrderItem();
        item.setId(UUID.randomUUID());
        item.setOrder(order);
        item.setProduct(product);
        item.setQuantity(itemDTO.getQuantity());
        item.setPrice(BigDecimal.valueOf(itemDTO.getUnitPrice()));
        item.setVariantId(itemDTO.getVariantId());
        item.setVariantName(itemDTO.getVariantName());
        item.setDuration(itemDTO.getDuration());

        OrderItem savedItem = orderItemRepository.save(item);

        // Calculate and update total price
        calculateAndUpdateTotalPrice(order);

        return toItemDTO(savedItem);
    }

    @Override
    @Transactional
    public OrderItemDTO updateOrderItem(UUID itemId, OrderItemDTO itemDTO) {
        OrderItem existingItem = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Chi tiết đơn", "id", itemId));

        OrderUtils.validateOrderUpdatable(existingItem.getOrder().getOrderStatus().toString());
        existingItem.setQuantity(itemDTO.getQuantity());

        OrderItem updatedItem = orderItemRepository.save(existingItem);

        // Calculate and update total price
        calculateAndUpdateTotalPrice(existingItem.getOrder());

        return toItemDTO(updatedItem);
    }

    @Override
    @Transactional
    public void removeOrderItem(UUID itemId) {
        OrderItem item = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Chi tiết đơn", "id", itemId));

        OrderUtils.validateOrderUpdatable(item.getOrder().getOrderStatus().toString());

        Order order = item.getOrder();
        orderItemRepository.delete(item);

        // Calculate and update total price
        calculateAndUpdateTotalPrice(order);
    }

    private void calculateAndUpdateTotalPrice(Order order) {
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        BigDecimal totalPrice = items.stream()
                .filter(item -> item.getPrice() != null && item.getQuantity() != null)
                .map(item -> item.getPrice().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalPrice(totalPrice);
        orderRepository.save(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderItemDTO> getOrderItems(String orderId) {
        return orderItemRepository.findByOrderId(orderId)
                .stream()
                .map(this::toItemDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByAppointmentDate(Date appointmentDate) {
        return orderRepository.findByAppointmentDate(appointmentDate)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByAppointmentDateBetween(Date startDate, Date endDate) {
        return orderRepository.findByAppointmentDateBetween(startDate, endDate)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());

        if (order.getCustomer() != null) {
            dto.setCustomerId(order.getCustomer().getId());
            dto.setCustomerName(order.getCustomer().getFirst_name() + " " + order.getCustomer().getLast_name());
            dto.setCustomerPhone(order.getCustomer().getPhone());
            dto.setCustomerEmail(order.getCustomer().getEmail());
        }

        if (order.getOrderStatus() != null) {
            dto.setStatusId(order.getOrderStatus().getId());
            dto.setStatusName(order.getOrderStatus().getStatusName());
            dto.setStatusCode(order.getOrderStatus().getStatusName());
        }


        dto.setAppointmentDate(order.getAppointmentDate());
        dto.setCreatedAt(order.getCreated_at());
        dto.setTotalAmount(order.getTotalPrice() != null ? order.getTotalPrice().doubleValue() : 0.0);
        
        // Map VNPay fields
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setTransactionId(order.getTransactionId());

        dto.setDiscountAmount(0.0);
        dto.setFinalAmount(dto.getTotalAmount());

        // Lấy danh sách order items
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        if (items != null && !items.isEmpty()) {
            dto.setItems(items.stream()
                    .map(this::toItemDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private OrderItemDTO toItemDTO(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(item.getId());
        dto.setOrderId(item.getOrder().getId());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getPrice().doubleValue());
        dto.setTotalPrice(item.getPrice().multiply(new BigDecimal(item.getQuantity())).doubleValue());
        dto.setVariantId(item.getVariantId());
        dto.setVariantName(item.getVariantName());
        dto.setDuration(item.getDuration());

        if (item.getProduct() != null) {
            dto.setProductId(item.getProduct().getId());
            dto.setProductName(item.getProduct().getProductName());
            dto.setServiceName(item.getProduct().getProductName());

            // Lấy ảnh thumbnail từ gallery
            Gallery thumbnail = galleryRepository.findByProductIdAndIsThumbnailTrue(item.getProduct().getId());
            if (thumbnail != null) {
                dto.setProductThumbnail(thumbnail.getImage());
            }
        }

        return dto;
    }

}
