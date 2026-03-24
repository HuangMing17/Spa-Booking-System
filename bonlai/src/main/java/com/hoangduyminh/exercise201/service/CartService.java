package com.hoangduyminh.exercise201.service;

import com.hoangduyminh.exercise201.dto.CartDTO;
import com.hoangduyminh.exercise201.dto.request.CartRequest;
import com.hoangduyminh.exercise201.dto.response.CartResponse;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Service interface để quản lý giỏ hàng
 */
public interface CartService {

    /**
     * Method cũ - Giữ nguyên
     */
    CartDTO createCart(CartDTO cartDTO);

    CartDTO updateCart(UUID id, CartDTO cartDTO);

    void deleteCart(UUID id);

    CartDTO getCartById(UUID id);

    List<CartDTO> getAllCarts();

    /**
     * Method mới thêm vào - Sử dụng Request/Response DTOs
     */

    /**
     * Tạo mới giỏ hàng từ request
     * 
     * @param request thông tin giỏ hàng
     * @return thông tin chi tiết giỏ hàng đã tạo
     */
    CartResponse createCartFromRequest(CartRequest request);

    /**
     * Cập nhật giỏ hàng từ request
     * 
     * @param id      id giỏ hàng
     * @param request thông tin cập nhật
     * @return thông tin chi tiết sau khi cập nhật
     */
    CartResponse updateCartFromRequest(UUID id, CartRequest request);

    /**
     * Lấy thông tin chi tiết giỏ hàng
     * 
     * @param id id giỏ hàng
     * @return thông tin chi tiết giỏ hàng
     */
    CartResponse getCartDetailById(UUID id);

    /**
     * Lấy giỏ hàng theo khách hàng
     * 
     * @param customerId id khách hàng
     * @return giỏ hàng của khách
     */
    CartResponse getCartByCustomer(UUID customerId);

    /**
     * Thêm sản phẩm vào giỏ hàng
     * 
     * @param id        id giỏ hàng
     * @param productId id sản phẩm
     * @param quantity  số lượng
     * @return thông tin sau khi thêm
     */
    CartResponse addItem(UUID id, UUID productId, Integer quantity, UUID variantValueId, UUID attributeValueId,
            Date appointmentDate);

    /**
     * Cập nhật số lượng sản phẩm
     * 
     * @param id       id giỏ hàng
     * @param itemId   id item
     * @param quantity số lượng mới
     * @return thông tin sau khi cập nhật
     */
    CartResponse updateItemQuantity(UUID id, UUID itemId, Integer quantity);

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     * 
     * @param id     id giỏ hàng
     * @param itemId id item cần xóa
     * @return thông tin sau khi xóa
     */
    CartResponse removeItem(UUID id, UUID itemId);

    /**
     * Xóa toàn bộ sản phẩm trong giỏ
     * 
     * @param id id giỏ hàng
     * @return thông tin giỏ hàng trống
     */
    CartResponse clearCart(UUID id);
}