package com.hoangduyminh.exercise201.service;

import com.hoangduyminh.exercise201.dto.RoleDTO;
import java.util.List;
import java.util.UUID;

/**
 * Service interface để quản lý phân quyền trong hệ thống
 */
public interface RoleService {

    /**
     * Tạo mới role
     * 
     * @param roleDTO thông tin role
     * @return role đã tạo
     * @throws BusinessException nếu role name đã tồn tại
     */
    RoleDTO createRole(RoleDTO roleDTO);

    /**
     * Cập nhật thông tin role
     * 
     * @param id      id role
     * @param roleDTO thông tin cập nhật
     * @return role sau khi cập nhật
     * @throws ResourceNotFoundException nếu không tìm thấy role
     * @throws BusinessException         nếu role name đã tồn tại
     */
    RoleDTO updateRole(UUID id, RoleDTO roleDTO);

    /**
     * Xóa role
     * 
     * @param id id role cần xóa
     * @throws ResourceNotFoundException nếu không tìm thấy role
     * @throws BusinessException         nếu role đang được sử dụng
     */
    void deleteRole(UUID id);

    /**
     * Lấy thông tin role theo id
     * 
     * @param id id role
     * @return thông tin role
     * @throws ResourceNotFoundException nếu không tìm thấy role
     */
    RoleDTO getRoleById(UUID id);

    /**
     * Lấy thông tin role theo tên
     * 
     * @param roleName tên của role
     * @return thông tin role
     * @throws ResourceNotFoundException nếu không tìm thấy role
     */
    RoleDTO getRoleByName(String roleName);

    /**
     * Tìm kiếm role theo từ khóa
     * 
     * @param keyword từ khóa tìm kiếm (tên)
     * @return danh sách role phù hợp
     */
    List<RoleDTO> searchRoles(String keyword);

    /**
     * Lấy danh sách role của một tài khoản
     * 
     * @param staffAccountId id tài khoản
     * @return danh sách role
     */
    List<RoleDTO> getRolesByStaffAccount(UUID staffAccountId);

    /**
     * Lấy danh sách tất cả role
     * 
     * @return danh sách role
     */
    List<RoleDTO> getAllRoles();
}