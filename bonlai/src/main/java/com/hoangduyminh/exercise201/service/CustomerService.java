package com.hoangduyminh.exercise201.service;

import com.hoangduyminh.exercise201.dto.CustomerDTO;
import com.hoangduyminh.exercise201.dto.request.CustomerRequest;
import com.hoangduyminh.exercise201.dto.response.CustomerResponse;
import java.util.List;
import java.util.UUID;

/**
 * Service interface để quản lý khách hàng
 */
public interface CustomerService {

    /**
     * Method cũ - Giữ nguyên
     */
    CustomerDTO createCustomer(CustomerDTO customerDTO);

    CustomerDTO updateCustomer(UUID id, CustomerDTO customerDTO);

    void deleteCustomer(UUID id);

    CustomerDTO getCustomerById(UUID id);

    List<CustomerDTO> getAllCustomers();

    /**
     * Method mới thêm vào - Sử dụng Request/Response DTOs
     */

    /**
     * Tạo mới khách hàng từ request
     * 
     * @param request thông tin khách hàng
     * @return thông tin chi tiết khách hàng đã tạo
     */
    CustomerResponse createCustomerFromRequest(CustomerRequest request);

    /**
     * Cập nhật khách hàng từ request
     * 
     * @param id      id khách hàng
     * @param request thông tin cập nhật
     * @return thông tin chi tiết sau khi cập nhật
     */
    CustomerResponse updateCustomerFromRequest(UUID id, CustomerRequest request);

    /**
     * Lấy thông tin chi tiết khách hàng
     * 
     * @param id id khách hàng
     * @return thông tin chi tiết khách hàng
     */
    CustomerResponse getCustomerDetailById(UUID id);

    /**
     * Lấy danh sách khách hàng với thông tin chi tiết
     * 
     * @return danh sách khách hàng
     */
    List<CustomerResponse> getAllCustomerDetails();

    /**
     * Tìm kiếm khách hàng
     * 
     * @param keyword từ khóa tìm kiếm (tên, email, phone)
     * @return danh sách khách hàng phù hợp
     */
    List<CustomerResponse> searchCustomers(String keyword);

    /**
     * Cập nhật trạng thái active
     * 
     * @param id       id khách hàng
     * @param isActive trạng thái mới
     * @return thông tin sau khi cập nhật
     */
    CustomerResponse updateStatus(UUID id, Boolean isActive);

    /**
     * Tính toán lại điểm tích lũy
     * 
     * @param id id khách hàng
     * @return thông tin sau khi cập nhật
     */
    CustomerResponse recalculateLoyaltyPoints(UUID id);

    /**
     * Thêm địa chỉ cho khách hàng
     * 
     * @param id      id khách hàng
     * @param address thông tin địa chỉ mới
     * @return thông tin sau khi thêm địa chỉ
     */
    CustomerResponse addAddress(UUID id, CustomerRequest address);

    /**
     * Cập nhật địa chỉ
     * 
     * @param customerId id khách hàng
     * @param addressId  id địa chỉ
     * @param address    thông tin cập nhật
     * @return thông tin sau khi cập nhật
     */
    CustomerResponse updateAddress(UUID customerId, UUID addressId, CustomerRequest address);

    /**
     * Xóa địa chỉ
     * 
     * @param customerId id khách hàng
     * @param addressId  id địa chỉ
     * @return thông tin sau khi xóa
     */
    CustomerResponse removeAddress(UUID customerId, UUID addressId);

    /**
     * Lấy danh sách khách hàng mới đăng ký trong khoảng thời gian gần nhất
     * 
     * @param days số ngày gần nhất (mặc định 30 ngày)
     * @return danh sách khách hàng mới đăng ký
     */
    List<CustomerResponse> getRecentCustomers(Integer days);

    /**
     * Đặt địa chỉ mặc định
     * 
     * @param customerId id khách hàng
     * @param addressId  id địa chỉ
     * @return thông tin sau khi cập nhật
     */
    CustomerResponse setDefaultAddress(UUID customerId, UUID addressId);
}