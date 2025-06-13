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
    private final CouponRepository couponRepository;
    private final GalleryRepository galleryRepository;
    private final VariantOptionRepository variantOptionRepository;
    private final EmailService emailService;

    public OrderServiceImpl(OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            OrderStatusRepository orderStatusRepository,
            CustomerRepository customerRepository,
            ProductRepository productRepository,
            CouponRepository couponRepository,
            GalleryRepository galleryRepository,
            VariantOptionRepository variantOptionRepository,
            EmailService emailService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderStatusRepository = orderStatusRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.couponRepository = couponRepository;
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

        Order order = new Order();
        order.setId(UUID.randomUUID().toString());
        order.setCustomer(customer);
        order.setOrderStatus(initialStatus);
        order.setAppointmentDate(orderDTO.getAppointmentDate());
        order.setTotalPrice(BigDecimal.ZERO);

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
                item.setQuantity(itemDTO.getQuantity());
                item.setPrice(BigDecimal.valueOf(itemDTO.getUnitPrice()));
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
    public OrderDTO getOrderById(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn đặt lịch", "id", id));
        return toDTO(order);
    }

    @Override
    public List<OrderDTO> searchOrders(String keyword) {
        return orderRepository
                .findByCustomer_first_nameContainingIgnoreCaseOrCustomer_last_nameContainingIgnoreCaseOrIdContainingIgnoreCase(
                        keyword)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getOrdersByCustomer(UUID customerId) {
        return orderRepository.findByCustomerId(customerId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
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
                .map(item -> item.getPrice().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalPrice(totalPrice);
        orderRepository.save(order);
    }

    @Override
    public List<OrderItemDTO> getOrderItems(String orderId) {
        return orderItemRepository.findByOrderId(orderId)
                .stream()
                .map(this::toItemDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderDTO applyCoupon(String orderId, String couponCode) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn đặt lịch", "id", orderId));

        OrderUtils.validateOrderUpdatable(order.getOrderStatus().toString());

        Coupon coupon = couponRepository.findByCode(couponCode)
                .orElseThrow(() -> new BusinessException.InvalidCoupon("Mã giảm giá không tồn tại"));

        // Validate coupon trước khi áp dụng
        validateCouponForOrder(coupon, order);

        // Tăng số lần sử dụng coupon
        if (coupon.getTimesUsed() == null) {
            coupon.setTimesUsed(BigDecimal.ONE);
        } else {
            coupon.setTimesUsed(coupon.getTimesUsed().add(BigDecimal.ONE));
        }
        couponRepository.save(coupon);

        order.setCoupon(coupon);
        Order updatedOrder = orderRepository.save(order);
        
        log.info("Đã áp dụng mã giảm giá {} cho đơn hàng {} (lần sử dụng: {})",
                 couponCode, orderId, coupon.getTimesUsed());
        return toDTO(updatedOrder);
    }

    @Override
    @Transactional
    public OrderDTO removeCoupon(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn đặt lịch", "id", orderId));

        OrderUtils.validateOrderUpdatable(order.getOrderStatus().toString());

        Coupon removedCoupon = order.getCoupon();
        order.setCoupon(null);
        Order updatedOrder = orderRepository.save(order);
        
        if (removedCoupon != null) {
            log.info("Đã xóa mã giảm giá {} khỏi đơn hàng {}", removedCoupon.getCode(), orderId);
        }
        
        return toDTO(updatedOrder);
    }

    @Override
    public List<OrderDTO> getOrdersByAppointmentDate(Date appointmentDate) {
        return orderRepository.findByAppointmentDate(appointmentDate)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getOrdersByAppointmentDateBetween(Date startDate, Date endDate) {
        return orderRepository.findByAppointmentDateBetween(startDate, endDate)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
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

        if (order.getCoupon() != null) {
            dto.setCouponId(order.getCoupon().getId());
            dto.setCouponCode(order.getCoupon().getCode());
        }

        dto.setAppointmentDate(order.getAppointmentDate());
        dto.setCreatedAt(order.getCreated_at());
        dto.setTotalAmount(order.getTotalPrice().doubleValue());

        // Tính toán các giá trị liên quan đến giảm giá
        if (order.getCoupon() != null) {
            double discountAmount = calculateDiscountAmount(dto.getTotalAmount(), order.getCoupon());
            dto.setDiscountAmount(discountAmount);
            dto.setCouponId(order.getCoupon().getId());
            dto.setCouponCode(order.getCoupon().getCode());
            dto.setFinalAmount(dto.getTotalAmount() - discountAmount);
        } else {
            dto.setDiscountAmount(0.0);
            dto.setFinalAmount(dto.getTotalAmount());
        }

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

            // Lấy ảnh thumbnail từ gallery
            Gallery thumbnail = galleryRepository.findByProductIdAndIsThumbnailTrue(item.getProduct().getId());
            if (thumbnail != null) {
                dto.setProductThumbnail(thumbnail.getImage());
            }
        }

        return dto;
    }

    /**
     * Validate coupon có thể áp dụng cho đơn hàng hay không
     *
     * @param coupon Mã giảm giá
     * @param order Đơn hàng
     * @throws BusinessException nếu coupon không hợp lệ
     */
    private void validateCouponForOrder(Coupon coupon, Order order) {
        Date now = new Date();
        
        // Kiểm tra thời gian hiệu lực
        if (coupon.getCouponStartDate() != null && now.before(coupon.getCouponStartDate())) {
            throw new BusinessException("Mã giảm giá chưa có hiệu lực");
        }
        
        if (coupon.getCouponEndDate() != null && now.after(coupon.getCouponEndDate())) {
            throw new BusinessException("Mã giảm giá đã hết hạn");
        }
        
        // Kiểm tra số tiền đơn hàng tối thiểu
        if (coupon.getOrderAmountLimit() != null &&
            order.getTotalPrice().doubleValue() < coupon.getOrderAmountLimit().doubleValue()) {
            throw new BusinessException(String.format(
                "Đơn hàng phải có giá trị tối thiểu %,.0f VND để áp dụng mã giảm giá này",
                coupon.getOrderAmountLimit().doubleValue()));
        }
        
        // Kiểm tra số lần sử dụng
        if (coupon.getMaxUsage() != null &&
            coupon.getTimesUsed() != null &&
            coupon.getTimesUsed().compareTo(coupon.getMaxUsage()) >= 0) {
            throw new BusinessException("Mã giảm giá đã hết lượt sử dụng");
        }
        
        // Kiểm tra khách hàng đã sử dụng mã này chưa (nếu có giới hạn)
        if (order.getCustomer() != null &&
            couponRepository.hasCustomerUsedCoupon(order.getCustomer().getId(), coupon.getCode())) {
            throw new BusinessException("Bạn đã sử dụng mã giảm giá này rồi");
        }
    }

    /**
     * Tính toán số tiền giảm giá dựa trên coupon (chỉ hỗ trợ giảm giá theo phần trăm)
     *
     * @param totalAmount Tổng tiền đơn hàng
     * @param coupon Mã giảm giá
     * @return Số tiền được giảm
     */
    private double calculateDiscountAmount(double totalAmount, Coupon coupon) {
        if (coupon == null || coupon.getDiscountValue() == null) {
            return 0.0;
        }

        // Kiểm tra coupon có hết hạn không
        Date now = new Date();
        if (coupon.getCouponEndDate() != null && now.after(coupon.getCouponEndDate())) {
            log.warn("Coupon {} đã hết hạn", coupon.getCode());
            return 0.0;
        }

        if (coupon.getCouponStartDate() != null && now.before(coupon.getCouponStartDate())) {
            log.warn("Coupon {} chưa có hiệu lực", coupon.getCode());
            return 0.0;
        }

        // Kiểm tra số tiền đơn hàng tối thiểu
        if (coupon.getOrderAmountLimit() != null &&
            totalAmount < coupon.getOrderAmountLimit().doubleValue()) {
            log.warn("Đơn hàng chưa đạt số tiền tối thiểu {} để áp dụng coupon {}",
                     coupon.getOrderAmountLimit(), coupon.getCode());
            return 0.0;
        }

        // Tính toán giảm giá theo phần trăm
        double discountPercentage = coupon.getDiscountValue().doubleValue();
        
        // Đảm bảo phần trăm giảm giá hợp lệ (0-100%)
        if (discountPercentage < 0) {
            discountPercentage = 0;
        } else if (discountPercentage > 100) {
            discountPercentage = 100;
        }

        double discountAmount = totalAmount * (discountPercentage / 100.0);
        
        log.debug("Áp dụng coupon {} với giảm giá {}% trên tổng tiền {}, số tiền giảm: {}",
                  coupon.getCode(), discountPercentage, totalAmount, discountAmount);

        return discountAmount;
    }
}