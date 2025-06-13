package com.hoangduyminh.exercise201.service.impl;

import com.hoangduyminh.exercise201.dto.StaffAccountDTO;
import com.hoangduyminh.exercise201.entity.StaffAccount;
import com.hoangduyminh.exercise201.entity.Role;
import com.hoangduyminh.exercise201.exception.BusinessException;
import com.hoangduyminh.exercise201.exception.ResourceNotFoundException;
import com.hoangduyminh.exercise201.repository.StaffAccountRepository;
import com.hoangduyminh.exercise201.repository.RoleRepository;
import com.hoangduyminh.exercise201.service.StaffAccountService;
import com.hoangduyminh.exercise201.dto.request.StaffRequest;
import com.hoangduyminh.exercise201.dto.response.StaffResponse;
// import com.hoangduyminh.exercise201.dto.response.RoleResponse;
import com.hoangduyminh.exercise201.dto.RoleDTO;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation của StaffAccountService để quản lý tài khoản nhân viên spa
 * Sử dụng StaffAccount entity có sẵn, không thay đổi cấu trúc
 */
@Service
public class StaffAccountServiceImpl implements StaffAccountService {

    private final StaffAccountRepository staffAccountRepository;
    private final RoleRepository roleRepository;

    public StaffAccountServiceImpl(StaffAccountRepository staffAccountRepository,
            RoleRepository roleRepository) {
        this.staffAccountRepository = staffAccountRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional
    public StaffAccountDTO createStaffAccount(StaffAccountDTO staffAccountDTO) { // Validate username/email trùng lặp
        if (staffAccountRepository.existsByUserName(staffAccountDTO.getUsername())) {
            throw new BusinessException("Username đã được sử dụng");
        }
        if (staffAccountRepository.existsByEmail(staffAccountDTO.getEmail())) {
            throw new BusinessException("Email đã được sử dụng");
        }

        // Tạo mới tài khoản
        StaffAccount staffAccount = new StaffAccount();
        staffAccount.setId(UUID.randomUUID());
        updateStaffFromDTO(staffAccount, staffAccountDTO);

        StaffAccount savedStaff = staffAccountRepository.save(staffAccount);
        return convertToDTO(savedStaff);
    }

    @Override
    @Transactional
    public StaffAccountDTO updateStaffAccount(UUID id, StaffAccountDTO staffAccountDTO) {
        StaffAccount existingStaff = staffAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản", "id", id)); // Kiểm tra username/email
                                                                                          // trùng với tài khoản khác
        staffAccountRepository.findByUserName(staffAccountDTO.getUsername())
                .filter(s -> !s.getId().equals(id))
                .ifPresent(s -> {
                    throw new BusinessException("Username đã được sử dụng");
                });

        staffAccountRepository.findByEmail(staffAccountDTO.getEmail())
                .filter(s -> !s.getId().equals(id))
                .ifPresent(s -> {
                    throw new BusinessException("Email đã được sử dụng");
                });

        updateStaffFromDTO(existingStaff, staffAccountDTO);
        StaffAccount updatedStaff = staffAccountRepository.save(existingStaff);
        return convertToDTO(updatedStaff);
    }

    @Override
    @Transactional
    public void deleteStaffAccount(UUID id) {
        StaffAccount staffAccount = staffAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản", "id", id));

        // TODO: Implement a way to check if staff has orders
        // For now, we'll just delete the account

        staffAccountRepository.delete(staffAccount);
    }

    @Override
    public StaffAccountDTO getStaffAccountById(UUID id) {
        StaffAccount staffAccount = staffAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản", "id", id));
        return convertToDTO(staffAccount);
    } // These methods have been removed as they are not in the interface @Override

    @Transactional
    public StaffResponse removeRole(UUID id, UUID roleId) {
        StaffAccount staffAccount = staffAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản", "id", id));

        // Check if role exists
        roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", roleId));

        if (staffAccount.getRole() != null && staffAccount.getRole().getId().equals(roleId)) {
            staffAccount.setRole(null);
            staffAccount.setUpdatedAt(new Date());
            StaffAccount updatedStaff = staffAccountRepository.save(staffAccount);
            return convertToResponse(updatedStaff);
        }

        return convertToResponse(staffAccount);
    }

    @Override
    public List<StaffAccountDTO> getAllStaffAccounts() {
        return staffAccountRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StaffResponse getStaffDetailById(UUID id) {
        StaffAccount staffAccount = staffAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản", "id", id));
        return convertToResponse(staffAccount);
    }

    @Override
    public List<StaffResponse> getAllStaffDetails() {
        return staffAccountRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StaffResponse> getStaffByRole(UUID roleId) {
        // TODO: Implement proper role-based filtering
        return staffAccountRepository.findAll().stream()
                .filter(s -> s.getRole() != null && s.getRole().getId().equals(roleId))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StaffResponse> getStaffByDepartment(String department) {
        // TODO: Implement department-based filtering when department field is added to
        // entity
        return staffAccountRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StaffResponse> searchStaff(String keyword) {
        // TODO: Implement proper search when repository method is available
        return staffAccountRepository.findAll().stream()
                .filter(s -> (s.getUserName() != null && s.getUserName().contains(keyword)) ||
                        (s.getEmail() != null && s.getEmail().contains(keyword)) ||
                        (s.getFirst_name() != null && s.getFirst_name().contains(keyword)) ||
                        (s.getLast_name() != null && s.getLast_name().contains(keyword)) ||
                        (s.getPhone_number() != null && s.getPhone_number().contains(keyword)))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StaffResponse updateStatus(UUID id, Boolean isActive) {
        StaffAccount staffAccount = staffAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản", "id", id));
        staffAccount.setActive(isActive);
        staffAccount.setUpdatedAt(new Date());
        StaffAccount updatedStaff = staffAccountRepository.save(staffAccount);
        return convertToResponse(updatedStaff);
    }

    @Override
    @Transactional
    public StaffResponse updateStaffFromRequest(UUID id, StaffRequest request) {
        StaffAccount staffAccount = staffAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản", "id", id));

        // Kiểm tra username/email trùng với tài khoản khác
        staffAccountRepository.findByUserName(request.getUsername())
                .filter(s -> !s.getId().equals(id))
                .ifPresent(s -> {
                    throw new BusinessException("Username đã được sử dụng");
                });

        staffAccountRepository.findByEmail(request.getEmail())
                .filter(s -> !s.getId().equals(id))
                .ifPresent(s -> {
                    throw new BusinessException("Email đã được sử dụng");
                });

        updateStaffFromRequest(staffAccount, request);
        StaffAccount updatedStaff = staffAccountRepository.save(staffAccount);
        return convertToResponse(updatedStaff);
    }

    @Override
    @Transactional
    public StaffResponse changePassword(UUID id, String oldPassword, String newPassword) {
        StaffAccount staffAccount = staffAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản", "id", id));

        // TODO: Implement password validation and hashing
        staffAccount.setPassword_hash(newPassword);
        staffAccount.setUpdatedAt(new Date());
        StaffAccount updatedStaff = staffAccountRepository.save(staffAccount);
        return convertToResponse(updatedStaff);
    }

    @Override
    @Transactional
    public String resetPassword(UUID id) {
        StaffAccount staffAccount = staffAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản", "id", id));

        // TODO: Implement password reset logic
        String defaultPassword = "123456"; // Should be configurable
        staffAccount.setPassword_hash(defaultPassword);
        staffAccount.setUpdatedAt(new Date());
        staffAccountRepository.save(staffAccount);
        return defaultPassword;
    }

    @Override
    @Transactional
    public StaffResponse assignRoles(UUID id, List<UUID> roleIds) {
        StaffAccount staffAccount = staffAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản", "id", id));

        // TODO: Implement multiple role assignment
        if (!roleIds.isEmpty()) {
            Role role = roleRepository.findById(roleIds.get(0))
                    .orElseThrow(() -> new ResourceNotFoundException("Role", "id", roleIds.get(0)));
            staffAccount.setRole(role);
        }

        staffAccount.setUpdatedAt(new Date());
        StaffAccount updatedStaff = staffAccountRepository.save(staffAccount);
        return convertToResponse(updatedStaff);
    }

    @Override
    @Transactional
    public StaffResponse createStaffFromRequest(StaffRequest request) {
        // Kiểm tra username/email đã tồn tại
        staffAccountRepository.findByUserName(request.getUsername())
                .ifPresent(s -> {
                    throw new BusinessException("Username đã được sử dụng");
                });

        staffAccountRepository.findByEmail(request.getEmail())
                .ifPresent(s -> {
                    throw new BusinessException("Email đã được sử dụng");
                });

        StaffAccount staffAccount = new StaffAccount();
        updateStaffFromRequest(staffAccount, request);
        staffAccount.setCreatedAt(new Date());
        staffAccount.setUpdatedAt(new Date());

        // TODO: Implement password hashing
        staffAccount.setPassword_hash(request.getPassword());

        StaffAccount savedStaff = staffAccountRepository.save(staffAccount);
        return convertToResponse(savedStaff);
    }

    /**
     * Cập nhật thông tin StaffAccount từ DTO
     * Chỉ cập nhật các trường được phép
     */
    private void updateStaffFromDTO(StaffAccount staffAccount, StaffAccountDTO dto) {
        staffAccount.setUserName(dto.getUsername());
        staffAccount.setEmail(dto.getEmail());
        // Tách fullName thành first_name và last_name nếu có
        if (dto.getFullName() != null) {
            String[] parts = dto.getFullName().split(" ", 2);
            staffAccount.setFirst_name(parts[0]);
            if (parts.length > 1)
                staffAccount.setLast_name(parts[1]);
        }
        staffAccount.setPhone_number(dto.getPhone());
        staffAccount.setActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        staffAccount.setUpdatedAt(new Date());
    }

    /**
     * Convert StaffAccount entity sang DTO
     */
    private StaffAccountDTO convertToDTO(StaffAccount staffAccount) {
        if (staffAccount == null)
            return null;

        StaffAccountDTO dto = new StaffAccountDTO();
        dto.setId(staffAccount.getId());
        dto.setUsername(staffAccount.getUserName());
        dto.setEmail(staffAccount.getEmail());
        dto.setFullName(staffAccount.getFirst_name() + " " + staffAccount.getLast_name());
        dto.setPhone(staffAccount.getPhone_number());
        dto.setIsActive(staffAccount.isActive());

        // Add role information
        if (staffAccount.getRole() != null) {
            RoleDTO roleDTO = new RoleDTO();
            roleDTO.setId(staffAccount.getRole().getId());
            roleDTO.setRoleName(staffAccount.getRole().getRoleName());
            dto.setRoles(List.of(roleDTO));
        }

        // TODO: Implement proper stats calculation
        dto.setTotalOrders(0);
        dto.setTotalRevenue(0.0);

        return dto;
    }

    private StaffResponse convertToResponse(StaffAccount staffAccount) {
        if (staffAccount == null)
            return null;

        StaffResponse response = new StaffResponse();
        response.setId(staffAccount.getId());
        response.setUsername(staffAccount.getUserName());
        response.setEmail(staffAccount.getEmail());
        response.setFullName(staffAccount.getFirst_name() + " " + staffAccount.getLast_name());
        response.setPhone(staffAccount.getPhone_number());
        response.setIsActive(staffAccount.isActive());
        response.setCreatedAt(staffAccount.getCreatedAt());
        response.setUpdatedAt(staffAccount.getUpdatedAt());

        // TODO: Add role information when RoleResponse is properly defined

        // TODO: Implement proper stats calculation
        response.setTotalOrders(0);
        response.setTotalRevenue(0.0);

        return response;
    }

    private void updateStaffFromRequest(StaffAccount staffAccount, StaffRequest request) {
        staffAccount.setUserName(request.getUsername());
        staffAccount.setEmail(request.getEmail());
        // Split fullName into first_name and last_name
        if (request.getFullName() != null) {
            String[] parts = request.getFullName().split(" ", 2);
            staffAccount.setFirst_name(parts[0]);
            if (parts.length > 1)
                staffAccount.setLast_name(parts[1]);
        }
        staffAccount.setPhone_number(request.getPhone());
        staffAccount.setActive(request.getIsActive());
        staffAccount.setUpdatedAt(new Date());
    }
}