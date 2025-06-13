package com.hoangduyminh.exercise201.controller;

import com.hoangduyminh.exercise201.dto.request.CouponRequest;
import com.hoangduyminh.exercise201.dto.response.CouponResponse;
import com.hoangduyminh.exercise201.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller cho quản lý mã giảm giá
 */
@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    /**
     * Tạo mới mã giảm giá
     * 
     * @param request thông tin mã giảm giá
     * @return thông tin mã đã tạo
     */
    @PostMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<CouponResponse> createCoupon(
            @Valid @RequestBody CouponRequest request) {
        CouponResponse response = couponService.createCouponFromRequest(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Cập nhật mã giảm giá
     * 
     * @param id      id mã giảm giá
     * @param request thông tin cập nhật
     * @return thông tin sau khi cập nhật
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<CouponResponse> updateCoupon(
            @PathVariable UUID id,
            @Valid @RequestBody CouponRequest request) {
        CouponResponse response = couponService.updateCouponFromRequest(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa mã giảm giá
     * 
     * @param id id mã giảm giá
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<Void> deleteCoupon(@PathVariable UUID id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }    /**
     * Lấy thông tin chi tiết mã giảm giá
     * 
     * @param id id mã giảm giá
     * @return thông tin mã giảm giá
     */
    @GetMapping("/{id}")
    @PreAuthorize("permitAll()") // Cho phép tất cả người dùng truy cập
    public ResponseEntity<CouponResponse> getCoupon(@PathVariable UUID id) {
        CouponResponse response = couponService.getCouponDetailById(id);
        return ResponseEntity.ok(response);
    }    /**
     * Lấy danh sách mã giảm giá
     * 
     * @return danh sách mã giảm giá
     */
    @GetMapping
    @PreAuthorize("permitAll()") // Cho phép tất cả người dùng truy cập
    public ResponseEntity<List<CouponResponse>> getAllCoupons() {
        List<CouponResponse> responses = couponService.getAllCouponDetails();
        return ResponseEntity.ok(responses);
    }    /**
     * Tìm kiếm mã giảm giá
     * 
     * @param keyword từ khóa tìm kiếm
     * @return danh sách mã phù hợp
     */
    @GetMapping("/search")
    @PreAuthorize("permitAll()") // Cho phép tất cả người dùng truy cập
    public ResponseEntity<List<CouponResponse>> searchCoupons(
            @RequestParam(required = false) String keyword) {
        List<CouponResponse> responses = couponService.searchCoupons(keyword);
        return ResponseEntity.ok(responses);
    }    /**
     * Lấy danh sách mã còn hiệu lực
     * 
     * @return danh sách mã còn hiệu lực
     */
    @GetMapping("/valid")
    @PreAuthorize("permitAll()") // Cho phép tất cả người dùng truy cập
    public ResponseEntity<List<CouponResponse>> getValidCoupons() {
        List<CouponResponse> responses = couponService.getValidCoupons();
        return ResponseEntity.ok(responses);
    }    /**
     * Lấy danh sách mã sắp hết hạn
     * 
     * @param days số ngày sắp hết hạn
     * @return danh sách mã sắp hết hạn
     */
    @GetMapping("/expiring")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<CouponResponse>> getExpiringCoupons(
            @RequestParam(defaultValue = "7") Integer days) {
        List<CouponResponse> responses = couponService.getExpiringCoupons(days);
        return ResponseEntity.ok(responses);
    }    /**
     * Kiểm tra mã giảm giá hợp lệ
     * 
     * @param code         mã giảm giá
     * @param orderId      id đơn hàng (tùy chọn)
     * @param customerId   id khách hàng (tùy chọn)
     * @param orderAmount  giá trị đơn hàng (tùy chọn)
     * @return kết quả kiểm tra và thông tin mã
     */
    @GetMapping("/validate")
    @PreAuthorize("permitAll()") // Cho phép tất cả người dùng truy cập
    public ResponseEntity<CouponResponse> validateCoupon(
            @RequestParam String code,
            @RequestParam(required = false) UUID orderId,
            @RequestParam(required = false) UUID customerId,
            @RequestParam(required = false) Double orderAmount) {
        CouponResponse response = couponService.validateCoupon(code, orderId, customerId);
        return ResponseEntity.ok(response);
    }/**
     * Áp dụng mã giảm giá
     * 
     * @param code       mã giảm giá
     * @param orderId    id đơn hàng
     * @param customerId id khách hàng
     * @return thông tin sau khi áp dụng
     */
    @PostMapping("/apply")
    @PreAuthorize("hasRole('STAFF') or hasRole('CUSTOMER')")
    public ResponseEntity<CouponResponse> applyCoupon(
            @RequestParam String code,
            @RequestParam UUID orderId,
            @RequestParam UUID customerId) {
        CouponResponse response = couponService.applyCoupon(code, orderId, customerId);
        return ResponseEntity.ok(response);
    }    /**
     * Hủy áp dụng mã giảm giá
     * 
     * @param orderId id đơn hàng
     * @return thông tin sau khi hủy
     */
    @DeleteMapping("/remove")
    @PreAuthorize("hasRole('STAFF') or hasRole('CUSTOMER')")
    public ResponseEntity<CouponResponse> removeCoupon(
            @RequestParam UUID orderId) {
        CouponResponse response = couponService.removeCoupon(orderId);
        return ResponseEntity.ok(response);
    }
}