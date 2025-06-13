package com.hoangduyminh.exercise201.service.impl;

import com.hoangduyminh.exercise201.dto.RoleDTO;
import com.hoangduyminh.exercise201.entity.Role;
import com.hoangduyminh.exercise201.exception.BusinessException;
import com.hoangduyminh.exercise201.exception.ResourceNotFoundException;
import com.hoangduyminh.exercise201.repository.RoleRepository;
import com.hoangduyminh.exercise201.service.RoleService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation của RoleService để quản lý phân quyền trong hệ thống
 * Sử dụng Role entity có sẵn, không thay đổi cấu trúc
 */
@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional
    public RoleDTO createRole(RoleDTO roleDTO) {
        // Validate role name trùng lặp
        if (roleRepository.existsByRoleName(roleDTO.getRoleName())) {
            throw new BusinessException("Role name đã tồn tại");
        }

        // Tạo mới role
        Role role = new Role();
        role.setId(UUID.randomUUID());
        updateRoleFromDTO(role, roleDTO);

        Role savedRole = roleRepository.save(role);
        return convertToDTO(savedRole);
    }

    @Override
    @Transactional
    public RoleDTO updateRole(UUID id, RoleDTO roleDTO) {
        Role existingRole = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id));

        // Kiểm tra role name trùng với role khác
        roleRepository.findByRoleName(roleDTO.getRoleName())
                .filter(r -> !r.getId().equals(id))
                .ifPresent(r -> {
                    throw new BusinessException("Role name đã tồn tại");
                });

        // Kiểm tra system role thông qua role name
        if (isSystemRole(existingRole)) {
            throw new BusinessException("Không thể sửa role hệ thống");
        }

        updateRoleFromDTO(existingRole, roleDTO);
        Role updatedRole = roleRepository.save(existingRole);
        return convertToDTO(updatedRole);
    }

    @Override
    @Transactional
    public void deleteRole(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id));

        // Kiểm tra system role
        if (isSystemRole(role)) {
            throw new BusinessException("Không thể xóa role hệ thống");
        }

        // Kiểm tra role đang được sử dụng
        Long accountCount = roleRepository.countStaffAccountsByRoleId(id);
        if (accountCount > 0) {
            throw new BusinessException("Không thể xóa role đang được sử dụng");
        }

        roleRepository.delete(role);
    }

    @Override
    public RoleDTO getRoleById(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id));
        return convertToDTO(role);
    }

    @Override
    public RoleDTO getRoleByName(String roleName) {
        Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", roleName));
        return convertToDTO(role);
    }

    @Override
    public List<RoleDTO> searchRoles(String keyword) {
        return roleRepository.searchRoles(keyword)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoleDTO> getRolesByStaffAccount(UUID staffAccountId) {
        return roleRepository.findByStaffId(staffAccountId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoleDTO> getAllRoles() {
        return roleRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Kiểm tra role có phải system role không dựa vào role name
     */
    private boolean isSystemRole(Role role) {
        List<String> systemRoleNames = List.of("ADMIN", "SYSTEM", "MANAGER");
        return systemRoleNames.contains(role.getRoleName().toUpperCase());
    }

    /**
     * Cập nhật thông tin Role từ DTO
     * Chỉ cập nhật các trường được phép
     */
    private void updateRoleFromDTO(Role role, RoleDTO dto) {
        role.setRoleName(dto.getRoleName());
        role.setPrivileges(dto.getPrivileges());
    }

    /**
     * Convert Role entity sang DTO
     */
    private RoleDTO convertToDTO(Role role) {
        if (role == null)
            return null;

        RoleDTO dto = new RoleDTO();
        dto.setId(role.getId());
        dto.setRoleName(role.getRoleName());
        dto.setPrivileges(role.getPrivileges());

        // Add stats
        Long accountCount = roleRepository.countStaffAccountsByRoleId(role.getId());
        dto.setAccountCount(accountCount != null ? accountCount.intValue() : 0);

        return dto;
    }
}