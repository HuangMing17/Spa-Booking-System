package com.hoangduyminh.exercise201.service;

import com.hoangduyminh.exercise201.dto.CustomerAddressDTO;
import java.util.List;
import java.util.UUID;

/**
 * Service interface để quản lý địa chỉ của khách hàng
 */
public interface CustomerAddressService {

    /**
     * Thêm địa chỉ mới cho khách hàng
     * 
     * @param customerAddressDTO thông tin địa chỉ
     * @return địa chỉ đã thêm
     * @throws ResourceNotFoundException nếu không tìm thấy khách hàng
     */
    CustomerAddressDTO createAddress(CustomerAddressDTO customerAddressDTO);

    /**
     * Cập nhật thông tin địa chỉ
     * 
     * @param id                 id địa chỉ
     * @param customerAddressDTO thông tin cập nhật
     * @return địa chỉ sau khi cập nhật
     * @throws ResourceNotFoundException nếu không tìm thấy địa chỉ
     */
    CustomerAddressDTO updateAddress(UUID id, CustomerAddressDTO customerAddressDTO);

    /**
     * Xóa địa chỉ
     * 
     * @param id id địa chỉ cần xóa
     * @throws ResourceNotFoundException nếu không tìm thấy địa chỉ
     */
    void deleteAddress(UUID id);

    /**
     * Lấy thông tin địa chỉ theo id
     * 
     * @param id id địa chỉ
     * @return thông tin địa chỉ
     * @throws ResourceNotFoundException nếu không tìm thấy địa chỉ
     */
    CustomerAddressDTO getAddressById(UUID id);

    /**
     * Lấy danh sách địa chỉ của khách hàng
     * 
     * @param customerId id khách hàng
     * @return danh sách địa chỉ
     */
    List<CustomerAddressDTO> getAddressesByCustomer(UUID customerId);

}