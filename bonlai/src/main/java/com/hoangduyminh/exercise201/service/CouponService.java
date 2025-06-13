package com.hoangduyminh.exercise201.service;

import com.hoangduyminh.exercise201.dto.CouponDTO;
import com.hoangduyminh.exercise201.dto.request.CouponRequest;
import com.hoangduyminh.exercise201.dto.response.CouponResponse;
import java.util.List;
import java.util.UUID;

/**
 * Service interface để quản lý mã giảm giá
 */
public interface CouponService {

    /**
     * Method cũ - Giữ nguyên
     */
    CouponDTO createCoupon(CouponDTO couponDTO);

    CouponDTO updateCoupon(UUID id, CouponDTO couponDTO);

    void deleteCoupon(UUID id);

    CouponDTO getCouponById(UUID id);

    List<CouponDTO> getAllCoupons();

    /**
     * Method mới thêm vào - Sử dụng Request/Response DTOs
     */

    /**
     * Tạo mới mã giảm giá từ request
     * 
     * @param request thông tin mã giảm giá
     * @return thông tin chi tiết mã đã tạo
     */
    CouponResponse createCouponFromRequest(CouponRequest request);

    /**
     * Cập nhật mã giảm giá từ request
     * 
     * @param id      id mã giảm giá
     * @param request thông tin cập nhật
     * @return thông tin chi tiết sau khi cập nhật
     */
    CouponResponse updateCouponFromRequest(UUID id, CouponRequest request);

    /**
     * Lấy thông tin chi tiết mã giảm giá
     * 
     * @param id id mã giảm giá
     * @return thông tin chi tiết mã giảm giá
     */
    CouponResponse getCouponDetailById(UUID id);

    /**
     * Lấy danh sách mã giảm giá với thông tin chi tiết
     * 
     * @return danh sách mã giảm giá
     */
    List<CouponResponse> getAllCouponDetails();

    /**
     * Tìm kiếm mã giảm giá
     * 
     * @param keyword từ khóa tìm kiếm (code, name)
     * @return danh sách mã giảm giá phù hợp
     */
    List<CouponResponse> searchCoupons(String keyword);

    /**
     * Lấy danh sách mã còn hiệu lực
     * 
     * @return danh sách mã còn hiệu lực
     */
    List<CouponResponse> getValidCoupons();

    /**
     * Lấy danh sách mã sắp hết hạn
     * 
     * @param days số ngày sắp hết hạn
     * @return danh sách mã sắp hết hạn
     */
    List<CouponResponse> getExpiringCoupons(Integer days);    /**
     * Kiểm tra mã giảm giá hợp lệ
     * 
     * @param code         mã giảm giá
     * @param orderId      id đơn hàng (tùy chọn)
     * @param customerId   id khách hàng (tùy chọn)
     * @return kết quả kiểm tra và thông tin mã
     */
    CouponResponse validateCoupon(String code, UUID orderId, UUID customerId);/**
    
     * Áp dụng mã giảm giá
     * 
     * @param code       mã giảm giá
     * @param orderId    id đơn hàng
     * @param customerId id khách hàng
     * @return thông tin sau khi áp dụng
     */
    CouponResponse applyCoupon(String code, UUID orderId, UUID customerId);

    /**
     * Hủy áp dụng mã giảm giá
     * 
     * @param orderId id đơn hàng
     * @return thông tin sau khi hủy
     */
    CouponResponse removeCoupon(UUID orderId);
}