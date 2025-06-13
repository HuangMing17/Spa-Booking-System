package com.hoangduyminh.exercise201.controller;

import com.hoangduyminh.exercise201.dto.request.CustomerRequest;
import com.hoangduyminh.exercise201.dto.response.CustomerResponse;
import com.hoangduyminh.exercise201.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller cho quản lý khách hàng
 */
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    /**
     * Tạo mới khách hàng
     * 
     * @param request thông tin khách hàng
     * @return thông tin khách hàng đã tạo
     */
    @PostMapping

    public ResponseEntity<CustomerResponse> createCustomer(
            @Valid @RequestBody CustomerRequest request) {
        CustomerResponse response = customerService.createCustomerFromRequest(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Cập nhật khách hàng
     * 
     * @param id      id khách hàng
     * @param request thông tin cập nhật
     * @return thông tin sau khi cập nhật
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('STAFF')")
    public ResponseEntity<CustomerResponse> updateCustomer(
            @PathVariable UUID id,
            @Valid @RequestBody CustomerRequest request) {
        CustomerResponse response = customerService.updateCustomerFromRequest(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa khách hàng
     * 
     * @param id id khách hàng
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<Void> deleteCustomer(@PathVariable UUID id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy thông tin chi tiết khách hàng
     * 
     * @param id id khách hàng
     * @return thông tin khách hàng
     */
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomer(@PathVariable UUID id) {
        CustomerResponse response = customerService.getCustomerDetailById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách khách hàng
     * 
     * @return danh sách khách hàng
     */
    @GetMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        List<CustomerResponse> responses = customerService.getAllCustomerDetails();
        return ResponseEntity.ok(responses);
    }

    /**
     * Tìm kiếm khách hàng
     * 
     * @param keyword từ khóa tìm kiếm
     * @return danh sách khách hàng phù hợp
     */
    @GetMapping("/search")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<CustomerResponse>> searchCustomers(
            @RequestParam(required = false) String keyword) {
        List<CustomerResponse> responses = customerService.searchCustomers(keyword);
        return ResponseEntity.ok(responses);
    }

    /**
     * Lấy danh sách khách hàng mới đăng ký (trong vòng 30 ngày gần nhất)
     * 
     * @param days số ngày gần nhất (mặc định 30 ngày)
     * @return danh sách khách hàng mới
     */
    @GetMapping("/recent")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<CustomerResponse>> getRecentCustomers(
            @RequestParam(defaultValue = "30") Integer days) {
        List<CustomerResponse> responses = customerService.getRecentCustomers(days);
        return ResponseEntity.ok(responses);
    }

    /**
     * Cập nhật trạng thái active
     * 
     * @param id       id khách hàng
     * @param isActive trạng thái mới
     * @return thông tin sau khi cập nhật
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<CustomerResponse> updateStatus(
            @PathVariable UUID id,
            @RequestParam Boolean isActive) {
        CustomerResponse response = customerService.updateStatus(id, isActive);
        return ResponseEntity.ok(response);
    }

    /**
     * Thêm địa chỉ mới
     * 
     * @param id      id khách hàng
     * @param request thông tin địa chỉ
     * @return thông tin sau khi thêm
     */
    @PostMapping("/{id}/addresses")
    public ResponseEntity<CustomerResponse> addAddress(
            @PathVariable UUID id,
            @Valid @RequestBody CustomerRequest request) {
        CustomerResponse response = customerService.addAddress(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Cập nhật địa chỉ
     * 
     * @param id        id khách hàng
     * @param addressId id địa chỉ
     * @param request   thông tin cập nhật
     * @return thông tin sau khi cập nhật
     */
    @PutMapping("/{id}/addresses/{addressId}")
    public ResponseEntity<CustomerResponse> updateAddress(
            @PathVariable UUID id,
            @PathVariable UUID addressId,
            @Valid @RequestBody CustomerRequest request) {
        CustomerResponse response = customerService.updateAddress(id, addressId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa địa chỉ
     * 
     * @param id        id khách hàng
     * @param addressId id địa chỉ
     */
    @DeleteMapping("/{id}/addresses/{addressId}")
    public ResponseEntity<CustomerResponse> removeAddress(
            @PathVariable UUID id,
            @PathVariable UUID addressId) {
        CustomerResponse response = customerService.removeAddress(id, addressId);
        return ResponseEntity.ok(response);
    }

    /**
     * Đặt địa chỉ mặc định
     * 
     * @param id        id khách hàng
     * @param addressId id địa chỉ
     * @return thông tin sau khi cập nhật
     */
    @PutMapping("/{id}/addresses/{addressId}/default")
    public ResponseEntity<CustomerResponse> setDefaultAddress(
            @PathVariable UUID id,
            @PathVariable UUID addressId) {
        CustomerResponse response = customerService.setDefaultAddress(id, addressId);
        return ResponseEntity.ok(response);
    }
}