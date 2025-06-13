package com.hoangduyminh.exercise201.controller;

import com.hoangduyminh.exercise201.dto.request.CartRequest;
import com.hoangduyminh.exercise201.dto.response.CartResponse;
import com.hoangduyminh.exercise201.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.UUID;

/**
 * REST controller cho quản lý giỏ hàng
 */
@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    /**
     * Tạo mới giỏ hàng
     * 
     * @param request thông tin giỏ hàng
     * @return thông tin giỏ hàng đã tạo
     */
    @PostMapping
    public ResponseEntity<CartResponse> createCart(
            @Valid @RequestBody CartRequest request) {
        CartResponse response = cartService.createCartFromRequest(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Cập nhật giỏ hàng
     * 
     * @param id      id giỏ hàng
     * @param request thông tin cập nhật
     * @return thông tin sau khi cập nhật
     */
    @PutMapping("/{id}")
    public ResponseEntity<CartResponse> updateCart(
            @PathVariable UUID id,
            @Valid @RequestBody CartRequest request) {
        CartResponse response = cartService.updateCartFromRequest(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa giỏ hàng
     * 
     * @param id id giỏ hàng
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCart(@PathVariable UUID id) {
        cartService.deleteCart(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy thông tin chi tiết giỏ hàng
     * 
     * @param id id giỏ hàng
     * @return thông tin giỏ hàng
     */
    @GetMapping("/{id}")
    public ResponseEntity<CartResponse> getCart(@PathVariable UUID id) {
        CartResponse response = cartService.getCartDetailById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy giỏ hàng theo khách hàng
     * 
     * @param customerId id khách hàng
     * @return giỏ hàng của khách
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<CartResponse> getCartByCustomer(
            @PathVariable UUID customerId) {
        CartResponse response = cartService.getCartByCustomer(customerId);
        return ResponseEntity.ok(response);
    }

    /**
     * Thêm sản phẩm vào giỏ
     * 
     * @param id               id giỏ hàng
     * @param productId        id sản phẩm
     * @param quantity         số lượng
     * @param variantValueId   id phiên bản dịch vụ
     * @param attributeValueId id thuộc tính dịch vụ
     * @param appointmentDate  ngày hẹn
     * @return thông tin sau khi thêm
     */
    @PostMapping("/{id}/items")
    public ResponseEntity<CartResponse> addItem(
            @PathVariable UUID id,
            @RequestParam UUID productId,
            @RequestParam Integer quantity,
            @RequestParam(required = false) UUID variantValueId,
            @RequestParam(required = false) UUID attributeValueId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date appointmentDate) {
        CartResponse response = cartService.addItem(id, productId, quantity, variantValueId, attributeValueId,
                appointmentDate);
        return ResponseEntity.ok(response);
    }

    /**
     * Cập nhật số lượng sản phẩm
     * 
     * @param id       id giỏ hàng
     * @param itemId   id item
     * @param quantity số lượng mới
     * @return thông tin sau khi cập nhật
     */
    @PutMapping("/{id}/items/{itemId}")
    public ResponseEntity<CartResponse> updateItemQuantity(
            @PathVariable UUID id,
            @PathVariable UUID itemId,
            @RequestParam Integer quantity) {
        CartResponse response = cartService.updateItemQuantity(id, itemId, quantity);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa sản phẩm khỏi giỏ
     * 
     * @param id     id giỏ hàng
     * @param itemId id item
     * @return thông tin sau khi xóa
     */
    @DeleteMapping("/{id}/items/{itemId}")
    public ResponseEntity<CartResponse> removeItem(
            @PathVariable UUID id,
            @PathVariable UUID itemId) {
        CartResponse response = cartService.removeItem(id, itemId);
        return ResponseEntity.ok(response);
    }

    /**
     * Áp dụng mã giảm giá
     * 
     * @param id         id giỏ hàng
     * @param couponCode mã giảm giá
     * @return thông tin sau khi áp dụng
     */
    @PostMapping("/{id}/coupon")
    public ResponseEntity<CartResponse> applyCoupon(
            @PathVariable UUID id,
            @RequestParam String couponCode) {
        CartResponse response = cartService.applyCoupon(id, couponCode);
        return ResponseEntity.ok(response);
    }

    /**
     * Gỡ bỏ mã giảm giá
     * 
     * @param id id giỏ hàng
     * @return thông tin sau khi gỡ bỏ
     */
    @DeleteMapping("/{id}/coupon")
    public ResponseEntity<CartResponse> removeCoupon(@PathVariable UUID id) {
        CartResponse response = cartService.removeCoupon(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa toàn bộ sản phẩm trong giỏ
     * 
     * @param id id giỏ hàng
     * @return thông tin giỏ hàng trống
     */
    @DeleteMapping("/{id}/items")
    public ResponseEntity<CartResponse> clearCart(@PathVariable UUID id) {
        CartResponse response = cartService.clearCart(id);
        return ResponseEntity.ok(response);
    }
}