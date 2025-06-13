package com.hoangduyminh.exercise201.service.impl;

import com.hoangduyminh.exercise201.dto.CouponDTO;
import com.hoangduyminh.exercise201.dto.request.CouponRequest;
import com.hoangduyminh.exercise201.dto.response.CouponResponse;
import com.hoangduyminh.exercise201.entity.Coupon;
import com.hoangduyminh.exercise201.entity.Order;
import com.hoangduyminh.exercise201.exception.BusinessException;
import com.hoangduyminh.exercise201.exception.ResourceNotFoundException;
import com.hoangduyminh.exercise201.repository.CouponRepository;
import com.hoangduyminh.exercise201.repository.OrderRepository;
import com.hoangduyminh.exercise201.service.CouponService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation của CouponService để quản lý mã giảm giá
 * Sử dụng Coupon entity có sẵn, không thay đổi cấu trúc
 */
@Service
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final OrderRepository orderRepository;

    public CouponServiceImpl(CouponRepository couponRepository,
            OrderRepository orderRepository) {
        this.couponRepository = couponRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional
    public CouponDTO createCoupon(CouponDTO couponDTO) {
        // Validate code trùng lặp
        if (couponRepository.existsByCode(couponDTO.getCode())) {
            throw new BusinessException("Mã giảm giá đã tồn tại");
        }

        // Validate thời gian
        if (couponDTO.getStartDate().after(couponDTO.getEndDate())) {
            throw new BusinessException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        // Tạo mới coupon
        Coupon coupon = new Coupon();
        coupon.setId(UUID.randomUUID());
        updateCouponFromDTO(coupon, couponDTO);

        Coupon savedCoupon = couponRepository.save(coupon);
        return convertToDTO(savedCoupon);
    }

    @Override
    @Transactional
    public CouponDTO updateCoupon(UUID id, CouponDTO couponDTO) {
        Coupon existingCoupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mã giảm giá", "id", id));

        // Kiểm tra code trùng với coupon khác
        couponRepository.findByCode(couponDTO.getCode())
                .filter(c -> !c.getId().equals(id))
                .ifPresent(c -> {
                    throw new BusinessException("Mã giảm giá đã tồn tại");
                });

        // Validate thời gian
        if (couponDTO.getStartDate().after(couponDTO.getEndDate())) {
            throw new BusinessException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        updateCouponFromDTO(existingCoupon, couponDTO);
        Coupon updatedCoupon = couponRepository.save(existingCoupon);
        return convertToDTO(updatedCoupon);
    }

    @Override
    @Transactional
    public void deleteCoupon(UUID id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mã giảm giá", "id", id));

        // Kiểm tra có đơn hàng đang sử dụng không
        if (orderRepository.existsByCouponId(id)) {
            throw new BusinessException("Không thể xóa mã giảm giá đã được sử dụng");
        }

        couponRepository.delete(coupon);
    }

    @Override
    public CouponDTO getCouponById(UUID id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mã giảm giá", "id", id));
        return convertToDTO(coupon);
    }

    @Override
    public List<CouponDTO> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CouponResponse createCouponFromRequest(CouponRequest request) {
        // Validate code trùng lặp
        if (couponRepository.existsByCode(request.getCode())) {
            throw new BusinessException("Mã giảm giá đã tồn tại");
        }

        // Validate thời gian
        if (request.getStartDate().after(request.getEndDate())) {
            throw new BusinessException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        // Tạo mới coupon
        Coupon coupon = new Coupon();
        coupon.setId(UUID.randomUUID());
        updateCouponFromRequest(coupon, request);

        Coupon savedCoupon = couponRepository.save(coupon);
        return convertToResponse(savedCoupon);
    }

    @Override
    public CouponResponse updateCouponFromRequest(UUID id, CouponRequest request) {
        Coupon existingCoupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mã giảm giá", "id", id));

        // Kiểm tra code trùng với coupon khác
        couponRepository.findByCode(request.getCode())
                .filter(c -> !c.getId().equals(id))
                .ifPresent(c -> {
                    throw new BusinessException("Mã giảm giá đã tồn tại");
                });

        // Validate thời gian
        if (request.getStartDate().after(request.getEndDate())) {
            throw new BusinessException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        updateCouponFromRequest(existingCoupon, request);
        Coupon updatedCoupon = couponRepository.save(existingCoupon);
        return convertToResponse(updatedCoupon);
    }

    @Override
    public CouponResponse getCouponDetailById(UUID id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mã giảm giá", "id", id));
        return convertToResponse(coupon);
    }

    @Override
    public List<CouponResponse> getAllCouponDetails() {
        return couponRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CouponResponse> searchCoupons(String keyword) {
        return couponRepository.searchCoupons(keyword).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CouponResponse> getValidCoupons() {
        return couponRepository.findValidCoupons().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CouponResponse> getExpiringCoupons(Integer days) {
        Calendar cal = Calendar.getInstance();
        Date start = cal.getTime();

        cal.add(Calendar.DATE, days);
        Date end = cal.getTime();

        return couponRepository.findExpiringCoupons(start, end).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }    @Override
    public CouponResponse validateCoupon(String code, UUID orderId, UUID customerId) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Mã giảm giá", "code", code));

        // Kiểm tra thời gian hiệu lực
        Date now = new Date();
        if (now.before(coupon.getCouponStartDate()) || now.after(coupon.getCouponEndDate())) {
            throw new BusinessException("Mã giảm giá đã hết hạn");
        }

        // Kiểm tra số lần sử dụng
        if (coupon.getMaxUsage() != null &&
                coupon.getTimesUsed().compareTo(coupon.getMaxUsage()) >= 0) {
            throw new BusinessException("Mã giảm giá đã hết lượt sử dụng");
        }

        // Kiểm tra khách hàng đã sử dụng chưa - chỉ kiểm tra nếu customerId không null
        if (customerId != null && couponRepository.hasCustomerUsedCoupon(customerId, code)) {
            throw new BusinessException("Bạn đã sử dụng mã giảm giá này");
        }

        return convertToResponse(coupon);
    }

    @Override
    public CouponResponse applyCoupon(String code, UUID orderId, UUID customerId) {
        // Validate coupon
        CouponResponse validatedCoupon = validateCoupon(code, orderId, customerId);
        Coupon coupon = couponRepository.findByCode(code).get();

        // Tăng số lần sử dụng
        coupon.setTimesUsed(coupon.getTimesUsed().add(BigDecimal.ONE));
        couponRepository.save(coupon);

        return validatedCoupon;
    }

    @Override
    public CouponResponse removeCoupon(UUID orderId) {
        Order order = orderRepository.findById(orderId.toString())
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", "id", orderId));

        if (order.getCoupon() == null) {
            throw new BusinessException("Đơn hàng không sử dụng mã giảm giá");
        }

        Coupon coupon = order.getCoupon();
        // Giảm số lần sử dụng
        coupon.setTimesUsed(coupon.getTimesUsed().subtract(BigDecimal.ONE));
        couponRepository.save(coupon);

        return convertToResponse(coupon);
    }

    /**
     * Cập nhật thông tin Coupon từ DTO
     * Chỉ cập nhật các trường được phép
     */
    private void updateCouponFromDTO(Coupon coupon, CouponDTO dto) {
        // Update all relevant fields from DTO to entity
        coupon.setCode(dto.getCode());
        coupon.setDiscountType(dto.getType());
        coupon.setDiscountValue(dto.getValue() != null ? BigDecimal.valueOf(dto.getValue()) : null);
        coupon.setCouponStartDate(dto.getStartDate());
        coupon.setCouponEndDate(dto.getEndDate());

        // Optional fields
        if (dto.getUsageLimit() != null) {
            coupon.setMaxUsage(BigDecimal.valueOf(dto.getUsageLimit()));
        }

        if (dto.getMinOrderAmount() != null) {
            coupon.setOrderAmountLimit(BigDecimal.valueOf(dto.getMinOrderAmount()));
        }
    }

    private void updateCouponFromRequest(Coupon coupon, CouponRequest request) {
        coupon.setCode(request.getCode());
        coupon.setDiscountType(request.getDiscountType());
        coupon.setDiscountValue(
                request.getDiscountValue() != null ? BigDecimal.valueOf(request.getDiscountValue()) : null);
        coupon.setCouponStartDate(request.getStartDate());
        coupon.setCouponEndDate(request.getEndDate());

        // Optional fields
        if (request.getMaxUsage() != null) {
            coupon.setMaxUsage(BigDecimal.valueOf(request.getMaxUsage()));
        }

        if (request.getMinimumOrderAmount() != null) {
            coupon.setOrderAmountLimit(BigDecimal.valueOf(request.getMinimumOrderAmount()));
        }
    }

    /**
     * Convert Coupon entity sang DTO
     */
    private CouponDTO convertToDTO(Coupon coupon) {
        if (coupon == null)
            return null;

        CouponDTO dto = new CouponDTO();
        dto.setId(coupon.getId());
        dto.setCode(coupon.getCode());
        dto.setType(coupon.getDiscountType());
        dto.setValue(coupon.getDiscountValue() != null ? coupon.getDiscountValue().doubleValue() : null);
        dto.setStartDate(coupon.getCouponStartDate());
        dto.setEndDate(coupon.getCouponEndDate());

        // Optional fields
        if (coupon.getMaxUsage() != null) {
            dto.setUsageLimit(coupon.getMaxUsage().intValue());
            dto.setUsageCount(coupon.getTimesUsed() != null ? coupon.getTimesUsed().intValue() : 0);
        }

        if (coupon.getOrderAmountLimit() != null) {
            dto.setMinOrderAmount(coupon.getOrderAmountLimit().doubleValue());
        }

        // Add stats
        Long customerCount = couponRepository.countCustomersByCouponId(coupon.getId());
        Double totalDiscount = couponRepository.calculateTotalDiscountByCouponId(coupon.getId());

        dto.setCustomerUsed(customerCount != null ? customerCount.intValue() : 0);
        dto.setTotalDiscountAmount(totalDiscount != null ? totalDiscount : 0.0);

        return dto;
    }

    private CouponResponse convertToResponse(Coupon coupon) {
        if (coupon == null)
            return null;

        CouponResponse response = new CouponResponse();
        response.setId(coupon.getId());
        response.setCode(coupon.getCode());
        response.setDiscountType(coupon.getDiscountType());
        response.setDiscountValue(coupon.getDiscountValue() != null ? coupon.getDiscountValue().doubleValue() : null);
        response.setStartDate(coupon.getCouponStartDate());
        response.setEndDate(coupon.getCouponEndDate());

        // Optional fields
        if (coupon.getMaxUsage() != null) {
            response.setMaxUsage(coupon.getMaxUsage().intValue());
            response.setTotalUsed(coupon.getTimesUsed() != null ? coupon.getTimesUsed().intValue() : 0);
            response.setRemainingUsage(response.getMaxUsage() - response.getTotalUsed());
        }

        if (coupon.getOrderAmountLimit() != null) {
            response.setMinimumOrderAmount(coupon.getOrderAmountLimit().doubleValue());
        }

        // Add stats (calculated fields)
        Double totalDiscount = couponRepository.calculateTotalDiscountByCouponId(coupon.getId());
        response.setTotalDiscountAmount(totalDiscount != null ? totalDiscount : 0.0);
        
        Long totalOrders = couponRepository.countUsage(coupon.getId());
        response.setTotalOrders(totalOrders != null ? totalOrders.intValue() : 0);
        
        response.setIsExpired(new Date().after(coupon.getCouponEndDate()));

        // Calculate days until expiry
        if (!response.getIsExpired()) {
            long diff = coupon.getCouponEndDate().getTime() - new Date().getTime();
            response.setDaysUntilExpiry(diff / (24 * 60 * 60 * 1000));
        }

        return response;
    }
}