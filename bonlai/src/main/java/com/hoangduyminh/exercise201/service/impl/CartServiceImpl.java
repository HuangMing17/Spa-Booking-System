package com.hoangduyminh.exercise201.service.impl;

import com.hoangduyminh.exercise201.dto.CartDTO;
import com.hoangduyminh.exercise201.dto.CartItemDTO;
import com.hoangduyminh.exercise201.dto.request.CartRequest;
import com.hoangduyminh.exercise201.dto.request.CartItemRequest;
import com.hoangduyminh.exercise201.dto.response.CartResponse;
import com.hoangduyminh.exercise201.dto.response.CartItemResponse;
import com.hoangduyminh.exercise201.entity.*;
import com.hoangduyminh.exercise201.exception.BusinessException;
import com.hoangduyminh.exercise201.exception.ResourceNotFoundException;
import com.hoangduyminh.exercise201.repository.*;
import com.hoangduyminh.exercise201.service.CartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation của CartService để quản lý giỏ hàng/đặt lịch tạm thời
 * Sử dụng Cart entity để lưu trữ giỏ hàng
 * Sử dụng CartItem entity để lưu chi tiết dịch vụ trong giỏ
 */
@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final VariantValueRepository variantValueRepository;
    private final ProductAttributeValueRepository productAttributeValueRepository;

    public CartServiceImpl(CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            CustomerRepository customerRepository,
            ProductRepository productRepository,
            CouponRepository couponRepository,
            VariantValueRepository variantValueRepository,
            ProductAttributeValueRepository productAttributeValueRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.couponRepository = couponRepository;
        this.variantValueRepository = variantValueRepository;
        this.productAttributeValueRepository = productAttributeValueRepository;
    }

    @Override
    @Transactional
    public CartDTO createCart(CartDTO cartDTO) {
        // Validate customer
        Customer customer = customerRepository.findById(cartDTO.getCustomerId())
                .orElseThrow(() -> new BusinessException("Khách hàng không tồn tại"));

        // Create new cart
        Cart cart = new Cart();
        cart.setId(UUID.randomUUID());
        cart.setCustomerId(customer.getId());

        Cart savedCart = cartRepository.save(cart);
        return convertToCartDTO(savedCart);
    }

    @Override
    @Transactional
    public CartDTO updateCart(UUID id, CartDTO cartDTO) {
        // Find existing cart
        Cart existingCart = cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng", "id", id));

        Cart updatedCart = cartRepository.save(existingCart);
        return convertToCartDTO(updatedCart);
    }

    @Override
    @Transactional
    public void deleteCart(UUID id) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng", "id", id));

        cartRepository.delete(cart);
    }

    @Override
    public CartDTO getCartById(UUID id) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng", "id", id));
        return convertToCartDTO(cart);
    }

    @Override
    public List<CartDTO> getAllCarts() {
        return cartRepository.findAll().stream()
                .map(this::convertToCartDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CartResponse createCartFromRequest(CartRequest request) {
        // Validate customer
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new BusinessException("Khách hàng không tồn tại"));

        // Create new cart
        Cart cart = new Cart();
        cart.setId(UUID.randomUUID());
        cart.setCustomerId(customer.getId());

        // Save cart
        Cart savedCart = cartRepository.save(cart);

        // Add items if any
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (CartItemRequest itemRequest : request.getItems()) {
                addItem(savedCart.getId(),
                        itemRequest.getProductId(),
                        itemRequest.getQuantity(),
                        itemRequest.getVariantValueId(),
                        itemRequest.getAttributeValueId(),
                        itemRequest.getAppointmentDate());
            }
        }

        // Apply coupon if any
        if (request.getCouponCode() != null && !request.getCouponCode().isEmpty()) {
            applyCoupon(savedCart.getId(), request.getCouponCode());
        }

        return convertToResponse(savedCart);
    }

    @Override
    public CartResponse updateCartFromRequest(UUID id, CartRequest request) {
        // Find existing cart
        Cart existingCart = cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng", "id", id));

        // Update items if any
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            // Clear existing items
            cartItemRepository.deleteByCart_Id(id);

            // Add new items
            for (CartItemRequest itemRequest : request.getItems()) {
                addItem(id,
                        itemRequest.getProductId(),
                        itemRequest.getQuantity(),
                        itemRequest.getVariantValueId(),
                        itemRequest.getAttributeValueId(),
                        itemRequest.getAppointmentDate());
            }
        }

        // Update coupon if changed
        if (request.getCouponCode() != null && !request.getCouponCode().equals(existingCart.getCouponCode())) {
            if (request.getCouponCode().isEmpty()) {
                removeCoupon(id);
            } else {
                applyCoupon(id, request.getCouponCode());
            }
        }

        Cart updatedCart = cartRepository.save(existingCart);
        return convertToResponse(updatedCart);
    }

    @Override
    public CartResponse getCartDetailById(UUID id) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng", "id", id));
        return convertToResponse(cart);
    }

    @Override
    public CartResponse getCartByCustomer(UUID customerId) {
        // Find active cart or create new one
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    Customer customer = customerRepository.findById(customerId)
                            .orElseThrow(() -> new BusinessException("Khách hàng không tồn tại"));

                    Cart newCart = new Cart();
                    newCart.setId(UUID.randomUUID());
                    newCart.setCustomerId(customer.getId());
                    return cartRepository.save(newCart);
                });

        return convertToResponse(cart);
    }

    @Override
    public CartResponse addItem(UUID id, UUID productId, Integer quantity, UUID variantValueId, UUID attributeValueId,
            Date appointmentDate) {
        // Validate cart and product
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng", "id", id));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new BusinessException("Sản phẩm không tồn tại"));

        // Validate variant and attribute if provided
        if (variantValueId != null) {
            VariantValue variantValue = variantValueRepository.findById(variantValueId)
                    .orElseThrow(() -> new BusinessException("Phiên bản dịch vụ không tồn tại"));
            if (!variantValue.getVariant().getProduct().getId().equals(productId)) {
                throw new BusinessException("Phiên bản dịch vụ không hợp lệ");
            }
        }

        if (attributeValueId != null) {
            ProductAttributeValue productAttributeValue = productAttributeValueRepository.findById(attributeValueId)
                    .orElseThrow(() -> new BusinessException("Thuộc tính dịch vụ không tồn tại"));
            if (!productAttributeValue.getProductAttribute().getProduct().getId().equals(productId)) {
                throw new BusinessException("Thuộc tính dịch vụ không hợp lệ");
            }
        }

        // Check for overlapping appointments
        if (appointmentDate != null
                && cartItemRepository.existsOverlappingAppointment(appointmentDate, productId, id)) {
            throw new BusinessException("Đã có lịch hẹn trùng thời gian này");
        }

        // Check if product already in cart with same variant/attribute
        CartItem existingItem = cartItemRepository.findByCart_IdAndProductId(id, productId)
                .orElse(null);

        if (existingItem != null) {
            // Update quantity
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
        } else {
            // Create new item
            CartItem item = new CartItem();
            item.setId(UUID.randomUUID());
            item.setCart(cart);
            item.setProductId(productId);
            item.setQuantity(quantity);

            // Set variant and attribute
            if (variantValueId != null) {
                item.getVariantValueIds().add(variantValueId);
            }
            if (attributeValueId != null) {
                item.getAttributeValueIds().add(attributeValueId);
            }

            // Set appointment date and duration
            item.setAppointmentDate(appointmentDate);
            if (variantValueId != null) {
                VariantValue variantValue = variantValueRepository.findById(variantValueId).orElse(null);
                if (variantValue != null) {
                    item.setDuration(variantValue.getVariant().getVariantOption().getDuration());
                }
            }

            // Calculate price
            BigDecimal unitPrice = product.getSalePrice();
            if (variantValueId != null) {
                VariantValue variantValue = variantValueRepository.findById(variantValueId).orElse(null);
                if (variantValue != null) {
                    unitPrice = variantValue.getVariant().getVariantOption().getSale_price();
                }
            }
            item.setUnitPrice(unitPrice.doubleValue());
            item.setSubtotal(unitPrice.multiply(BigDecimal.valueOf(quantity)).doubleValue());
            item.setTotal(item.getSubtotal() - item.getDiscount());

            cartItemRepository.save(item);
        }

        return convertToResponse(cart);
    }

    @Override
    public CartResponse updateItemQuantity(UUID id, UUID itemId, Integer quantity) {
        // Validate cart and item
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng", "id", id));

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Chi tiết giỏ hàng", "id", itemId));

        // Update quantity
        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return convertToResponse(cart);
    }

    @Override
    public CartResponse removeItem(UUID id, UUID itemId) {
        // Validate cart and item
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng", "id", id));

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Chi tiết giỏ hàng", "id", itemId));

        // Remove item
        cartItemRepository.delete(item);

        return convertToResponse(cart);
    }

    @Override
    public CartResponse applyCoupon(UUID id, String couponCode) {
        // Validate cart
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng", "id", id));

        // Validate coupon
        Coupon coupon = couponRepository.findByCode(couponCode)
                .orElseThrow(() -> new BusinessException("Mã giảm giá không tồn tại"));

        // Apply coupon
        cart.setCouponCode(couponCode);
        Cart updatedCart = cartRepository.save(cart);

        return convertToResponse(updatedCart);
    }

    @Override
    public CartResponse removeCoupon(UUID id) {
        // Validate cart
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng", "id", id));

        // Remove coupon
        cart.setCouponCode(null);
        Cart updatedCart = cartRepository.save(cart);

        return convertToResponse(updatedCart);
    }

    @Override
    public CartResponse clearCart(UUID id) {
        // Validate cart
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng", "id", id));

        // Remove all items
        cartItemRepository.deleteByCart_Id(id);

        // Remove coupon
        cart.setCouponCode(null);
        Cart updatedCart = cartRepository.save(cart);

        return convertToResponse(updatedCart);
    }

    /**
     * Convert Cart entity to CartDTO
     */
    private CartDTO convertToCartDTO(Cart cart) {
        if (cart == null)
            return null;

        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());

        // Convert basic info
        dto.setTotalAmount(0.0); // Calculate from items
        dto.setDiscountAmount(0.0); // Calculate from coupon
        dto.setFinalAmount(0.0); // Calculate total - discount

        return dto;
    }

    private CartResponse convertToResponse(Cart cart) {
        if (cart == null)
            return null;

        CartResponse response = new CartResponse();
        response.setId(cart.getId());

        // Set customer info
        if (cart.getCustomerId() != null) {
            Customer customer = customerRepository.findById(cart.getCustomerId())
                    .orElse(null);
            if (customer != null) {
                response.setCustomerId(customer.getId());
                response.setCustomerName(customer.getFirst_name() + " " + customer.getLast_name());
                response.setCustomerEmail(customer.getEmail());
            }
        }

        // Set basic info
        response.setCouponCode(cart.getCouponCode());

        // Get items
        List<CartItem> items = cartItemRepository.findByCart_Id(cart.getId());
        response.setItems(items.stream()
                .map(this::convertToItemResponse)
                .collect(Collectors.toList()));

        // Calculate totals
        double subtotal = items.stream()
                .mapToDouble(item -> {
                    Product product = productRepository.findById(item.getProductId()).orElse(null);
                    return product != null ? product.getSalePrice().doubleValue() * item.getQuantity() : 0.0;
                })
                .sum();
        response.setSubtotal(subtotal);

        // Calculate discount if coupon exists
        if (cart.getCouponCode() != null) {
            Coupon coupon = couponRepository.findByCode(cart.getCouponCode()).orElse(null);
            if (coupon != null) {
                double discount = calculateDiscount(subtotal, coupon);
                response.setDiscount(discount);
                response.setCouponDiscount(discount);
            }
        }

        // Calculate final total
        response.setTotal(response.getSubtotal() - response.getDiscount());

        // Set item counts
        response.setTotalItems(items.size());
        response.setTotalQuantity(items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum());

        return response;
    }

    private CartItemResponse convertToItemResponse(CartItem item) {
        if (item == null)
            return null;

        CartItemResponse response = new CartItemResponse();
        response.setId(item.getId());
        response.setProductId(item.getProductId());

        Product product = productRepository.findById(item.getProductId()).orElse(null);
        if (product != null) {
            response.setProductName(product.getProductName());

            // Add variant info
            if (!item.getVariantValueIds().isEmpty()) {
                UUID variantValueId = item.getVariantValueIds().get(0);
                VariantValue variantValue = variantValueRepository.findById(variantValueId).orElse(null);
                if (variantValue != null) {
                    Variant variant = variantValue.getVariant();
                    VariantOption variantOption = variant.getVariantOption();
                    response.setVariantName(variantOption.getTitle());
                    response.setVariantPrice(variantOption.getSale_price().doubleValue());
                    response.setDuration(variantOption.getDuration());
                }
            }

            // Add attribute info
            if (!item.getAttributeValueIds().isEmpty()) {
                UUID attributeValueId = item.getAttributeValueIds().get(0);
                ProductAttributeValue productAttributeValue = productAttributeValueRepository.findById(attributeValueId)
                        .orElse(null);
                if (productAttributeValue != null) {
                    AttributeValue attributeValue = productAttributeValue.getAttributeValue();
                    Attribute attribute = attributeValue.getAttribute();
                    response.setAttributeName(attribute.getAttributeName());
                    response.setAttributeValue(attributeValue.getAttributeValue());
                }
            }
        }

        response.setQuantity(item.getQuantity());
        response.setUnitPrice(item.getUnitPrice());
        response.setSubtotal(item.getSubtotal());
        response.setAppointmentDate(item.getAppointmentDate());
        response.setDuration(item.getDuration());
        response.setNote(item.getNote());

        return response;
    }

    private double calculateDiscount(double subtotal, Coupon coupon) {
        if (coupon == null)
            return 0;

        if ("PERCENTAGE".equals(coupon.getDiscountType())) {
            return subtotal * (coupon.getDiscountValue().doubleValue() / 100);
        } else {
            return coupon.getDiscountValue().doubleValue();
        }
    }
}