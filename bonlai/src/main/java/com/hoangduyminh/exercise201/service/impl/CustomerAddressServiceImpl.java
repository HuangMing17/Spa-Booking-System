package com.hoangduyminh.exercise201.service.impl;

import com.hoangduyminh.exercise201.dto.CustomerAddressDTO;
import com.hoangduyminh.exercise201.entity.CustomerAddress;
import com.hoangduyminh.exercise201.entity.Customer;
import com.hoangduyminh.exercise201.exception.ResourceNotFoundException;
import com.hoangduyminh.exercise201.repository.CustomerAddressRepository;
import com.hoangduyminh.exercise201.repository.CustomerRepository;
import com.hoangduyminh.exercise201.service.CustomerAddressService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation của CustomerAddressService để quản lý địa chỉ của khách hàng
 * Sử dụng CustomerAddress entity có sẵn, không thay đổi cấu trúc
 */
@Service
public class CustomerAddressServiceImpl implements CustomerAddressService {

    private final CustomerAddressRepository customerAddressRepository;
    private final CustomerRepository customerRepository;

    public CustomerAddressServiceImpl(CustomerAddressRepository customerAddressRepository,
            CustomerRepository customerRepository) {
        this.customerAddressRepository = customerAddressRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public CustomerAddressDTO createAddress(CustomerAddressDTO addressDTO) {
        // Validate customer
        Customer customer = customerRepository.findById(addressDTO.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", addressDTO.getCustomerId()));

        // Create new address
        CustomerAddress address = new CustomerAddress();
        address.setId(UUID.randomUUID());
        updateAddressFromDTO(address, addressDTO);

        CustomerAddress savedAddress = customerAddressRepository.save(address);
        return convertToDTO(savedAddress);
    }

    @Override
    @Transactional
    public CustomerAddressDTO updateAddress(UUID id, CustomerAddressDTO addressDTO) {
        CustomerAddress existingAddress = customerAddressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Địa chỉ", "id", id));

        updateAddressFromDTO(existingAddress, addressDTO);
        CustomerAddress updatedAddress = customerAddressRepository.save(existingAddress);
        return convertToDTO(updatedAddress);
    }

    @Override
    @Transactional
    public void deleteAddress(UUID id) {
        CustomerAddress address = customerAddressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Địa chỉ", "id", id));

        customerAddressRepository.delete(address);
    }

    @Override
    public CustomerAddressDTO getAddressById(UUID id) {
        CustomerAddress address = customerAddressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Địa chỉ", "id", id));
        return convertToDTO(address);
    }

    @Override
    public List<CustomerAddressDTO> getAddressesByCustomer(UUID customerId) {
        // Validate customer exists
        customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", customerId));

        return customerAddressRepository.findByCustomerId(customerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Cập nhật thông tin CustomerAddress từ DTO
     * Chỉ cập nhật các trường được phép
     */
    private void updateAddressFromDTO(CustomerAddress address, CustomerAddressDTO dto) {
        // Only update available fields
        address.setId(dto.getId());
    }

    /**
     * Convert CustomerAddress entity sang DTO
     */
    private CustomerAddressDTO convertToDTO(CustomerAddress address) {
        if (address == null)
            return null;

        CustomerAddressDTO dto = new CustomerAddressDTO();
        dto.setId(address.getId());

        if (address.getCustomer() != null) {
            dto.setCustomerId(address.getCustomer().getId());
        }

        return dto;
    }
}