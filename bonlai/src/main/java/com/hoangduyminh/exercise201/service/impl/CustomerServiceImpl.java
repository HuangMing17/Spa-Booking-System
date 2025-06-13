package com.hoangduyminh.exercise201.service.impl;

import com.hoangduyminh.exercise201.dto.CustomerDTO;
import com.hoangduyminh.exercise201.dto.request.CustomerRequest;
import com.hoangduyminh.exercise201.dto.response.CustomerResponse;
import com.hoangduyminh.exercise201.entity.Customer;
import com.hoangduyminh.exercise201.exception.BusinessException;
import com.hoangduyminh.exercise201.exception.ResourceNotFoundException;
import com.hoangduyminh.exercise201.repository.CustomerRepository;
import com.hoangduyminh.exercise201.service.CustomerService;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation của CustomerService để quản lý khách hàng spa
 * Sử dụng Customer entity có sẵn, không thay đổi cấu trúc
 */
@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        // Validate email
        if (customerRepository.existsByEmail(customerDTO.getEmail())) {
            throw new BusinessException("Email đã được sử dụng");
        }

        // Create new customer
        Customer customer = convertToEntity(customerDTO);
        customer.setId(UUID.randomUUID());
        customer.setRegistered_at(new Date());
        customer.setUpdated_at(new Date());

        Customer savedCustomer = customerRepository.save(customer);
        return convertToDTO(savedCustomer);
    }

    @Override
    @Transactional
    public CustomerDTO updateCustomer(UUID id, CustomerDTO customerDTO) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", id));

        // Validate email
        customerRepository.findByEmail(customerDTO.getEmail())
                .filter(c -> !c.getId().equals(id))
                .ifPresent(c -> {
                    throw new BusinessException("Email đã được sử dụng");
                });

        BeanUtils.copyProperties(customerDTO, existingCustomer, "id");
        existingCustomer.setUpdated_at(new Date());
        Customer updatedCustomer = customerRepository.save(existingCustomer);
        return convertToDTO(updatedCustomer);
    }

    @Override
    @Transactional
    public void deleteCustomer(UUID id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", id));

        // Kiểm tra khách hàng có đơn đặt lịch không
        Long orderCount = customerRepository.countOrdersByCustomer(id);
        if (orderCount > 0) {
            throw new BusinessException("Không thể xóa khách hàng đã có đơn đặt lịch");
        }

        customerRepository.delete(customer);
    }

    @Override
    public CustomerDTO getCustomerById(UUID id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", id));
        return convertToDTO(customer);
    }

    @Override
    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CustomerResponse createCustomerFromRequest(CustomerRequest request) {
        // Validate email
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email đã được sử dụng");
        }

        // Create new customer
        Customer customer = new Customer();
        customer.setId(UUID.randomUUID());
        updateCustomerFromRequest(customer, request);

        Customer savedCustomer = customerRepository.save(customer);
        return convertToResponse(savedCustomer);
    }

    @Override
    public CustomerResponse updateCustomerFromRequest(UUID id, CustomerRequest request) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", id));

        // Validate email
        customerRepository.findByEmail(request.getEmail())
                .filter(c -> !c.getId().equals(id))
                .ifPresent(c -> {
                    throw new BusinessException("Email đã được sử dụng");
                });

        updateCustomerFromRequest(existingCustomer, request);
        Customer updatedCustomer = customerRepository.save(existingCustomer);
        return convertToResponse(updatedCustomer);
    }

    @Override
    public CustomerResponse getCustomerDetailById(UUID id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", id));
        return convertToResponse(customer);
    }

    @Override
    public List<CustomerResponse> getAllCustomerDetails() {
        return customerRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }    @Override
    public List<CustomerResponse> searchCustomers(String keyword) {
        return customerRepository.searchCustomers(keyword).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerResponse> getRecentCustomers(Integer days) {
        // Default to 30 days if null
        if (days == null || days <= 0) {
            days = 30;
        }
        
        // Calculate the date from which to filter customers
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, -days);
        Date fromDate = calendar.getTime();
        
        // Get customers registered after the calculated date
        List<Customer> recentCustomers = customerRepository.findByRegisteredAtAfter(fromDate);
        
        // Convert to response DTOs
        return recentCustomers.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CustomerResponse updateStatus(UUID id, Boolean isActive) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", id));
        customer.setActive(isActive);
        customer.setUpdated_at(new Date());
        Customer updatedCustomer = customerRepository.save(customer);
        return convertToResponse(updatedCustomer);
    }

    @Override
    public CustomerResponse recalculateLoyaltyPoints(UUID id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", id));
        // TODO: Implement loyalty points tracking in a separate table
        // For now, calculate based on total spent
        Double totalSpent = customerRepository.calculateTotalSpentByCustomer(id);
        int points = (int) (totalSpent != null ? totalSpent / 1000 : 0); // 1 point per 1000 spent
        // TODO: Save points to loyalty points table
        return convertToResponse(customer);
    }

    @Override
    public CustomerResponse addAddress(UUID id, CustomerRequest address) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", id));
        // TODO: Implement address addition
        // For now, just validate the address
        if (address.getAddresses() == null || address.getAddresses().isEmpty()) {
            throw new BusinessException("Địa chỉ không được để trống");
        }
        // TODO: Save address to customer_addresses table
        return convertToResponse(customer);
    }

    @Override
    public CustomerResponse updateAddress(UUID customerId, UUID addressId, CustomerRequest address) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", customerId));
        // TODO: Implement address update
        // For now, just validate the address
        if (address.getAddresses() == null || address.getAddresses().isEmpty()) {
            throw new BusinessException("Địa chỉ không được để trống");
        }
        // TODO: Update address in customer_addresses table
        return convertToResponse(customer);
    }

    @Override
    public CustomerResponse removeAddress(UUID customerId, UUID addressId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", customerId));
        // TODO: Implement address removal
        // For now, just validate the address exists
        // TODO: Remove address from customer_addresses table
        return convertToResponse(customer);
    }

    @Override
    public CustomerResponse setDefaultAddress(UUID customerId, UUID addressId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", customerId));
        // TODO: Implement setting default address
        // For now, just validate the address exists
        // TODO: Update default address in customer_addresses table
        return convertToResponse(customer);
    }

    private Customer convertToEntity(CustomerDTO dto) {
        Customer customer = new Customer();
        BeanUtils.copyProperties(dto, customer);
        return customer;
    }

    private CustomerDTO convertToDTO(Customer customer) {
        if (customer == null)
            return null;

        CustomerDTO dto = new CustomerDTO();
        BeanUtils.copyProperties(customer, dto);
        dto.setIsActive(customer.getActive());

        // Add stats
        Long orderCount = customerRepository.countOrdersByCustomer(customer.getId());
        Double totalSpent = customerRepository.calculateTotalSpentByCustomer(customer.getId());

        dto.setTotalOrders(orderCount != null ? orderCount.intValue() : 0);
        dto.setTotalSpent(totalSpent != null ? totalSpent : 0.0);

        return dto;
    }

    private void updateCustomerFromRequest(Customer customer, CustomerRequest request) {
        String[] nameParts = request.getFullName().split(" ", 2);
        customer.setFirst_name(nameParts[0]);
        customer.setLast_name(nameParts.length > 1 ? nameParts[1] : "");
        customer.setEmail(request.getEmail());
        customer.setUser_name(request.getEmail().split("@")[0]);
        customer.setPassword_hash(""); // TODO: Hash password
        customer.setActive(request.getIsActive() != null ? request.getIsActive() : true);
        customer.setPhone(request.getPhone());
        customer.setRegistered_at(new Date());
        customer.setUpdated_at(new Date());
    }

    private CustomerResponse convertToResponse(Customer customer) {
        if (customer == null)
            return null;

        CustomerResponse response = new CustomerResponse();
        BeanUtils.copyProperties(customer, response);
        response.setFullName(customer.getFirst_name() + " " + customer.getLast_name());
        response.setIsActive(customer.getActive());
        response.setRegisteredAt(customer.getRegistered_at());
        response.setUpdatedAt(customer.getUpdated_at());
        return response;
    }
}