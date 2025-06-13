package com.hoangduyminh.exercise201.service;

import com.hoangduyminh.exercise201.dto.StaffAccountDTO;
import com.hoangduyminh.exercise201.dto.request.StaffRequest;
import com.hoangduyminh.exercise201.dto.response.StaffResponse;
import java.util.List;
import java.util.UUID;

/**
 * Service interface để quản lý nhân viên
 */
public interface StaffAccountService {

    /**
     * Method cũ - Giữ nguyên
     */
    StaffAccountDTO createStaffAccount(StaffAccountDTO staffAccountDTO);

    StaffAccountDTO updateStaffAccount(UUID id, StaffAccountDTO staffAccountDTO);

    void deleteStaffAccount(UUID id);

    StaffAccountDTO getStaffAccountById(UUID id);

    List<StaffAccountDTO> getAllStaffAccounts();

    /**
     * Method mới thêm vào - Sử dụng Request/Response DTOs
     */

    /**
     * Tạo mới tài khoản nhân viên từ request
     * 
     * @param request thông tin nhân viên
     * @return thông tin chi tiết nhân viên đã tạo
     */
    StaffResponse createStaffFromRequest(StaffRequest request);

    /**
     * Cập nhật thông tin nhân viên từ request
     * 
     * @param id      id nhân viên
     * @param request thông tin cập nhật
     * @return thông tin chi tiết sau khi cập nhật
     */
    StaffResponse updateStaffFromRequest(UUID id, StaffRequest request);

    /**
     * Lấy thông tin chi tiết nhân viên
     * 
     * @param id id nhân viên
     * @return thông tin chi tiết nhân viên
     */
    StaffResponse getStaffDetailById(UUID id);

    /**
     * Lấy danh sách nhân viên với thông tin chi tiết
     * 
     * @return danh sách nhân viên
     */
    List<StaffResponse> getAllStaffDetails();

    /**
     * Tìm kiếm nhân viên
     * 
     * @param keyword từ khóa tìm kiếm (tên, email, phone)
     * @return danh sách nhân viên phù hợp
     */
    List<StaffResponse> searchStaff(String keyword);

    /**
     * Cập nhật trạng thái active
     * 
     * @param id       id nhân viên
     * @param isActive trạng thái mới
     * @return thông tin sau khi cập nhật
     */
    StaffResponse updateStatus(UUID id, Boolean isActive);

    /**
     * Gán role cho nhân viên
     * 
     * @param staffId id nhân viên
     * @param roleIds danh sách id role
     * @return thông tin sau khi gán role
     */
    StaffResponse assignRoles(UUID staffId, List<UUID> roleIds);

    /**
     * Gỡ role khỏi nhân viên
     * 
     * @param staffId id nhân viên
     * @param roleId  id role cần gỡ
     * @return thông tin sau khi gỡ role
     */
    StaffResponse removeRole(UUID staffId, UUID roleId);

    /**
     * Đổi mật khẩu
     * 
     * @param id          id nhân viên
     * @param oldPassword mật khẩu cũ
     * @param newPassword mật khẩu mới
     * @return thông tin sau khi đổi mật khẩu
     */
    StaffResponse changePassword(UUID id, String oldPassword, String newPassword);

    /**
     * Reset mật khẩu
     * 
     * @param id id nhân viên
     * @return mật khẩu mới
     */
    String resetPassword(UUID id);

    /**
     * Lấy danh sách nhân viên theo role
     * 
     * @param roleId id role
     * @return danh sách nhân viên có role
     */
    List<StaffResponse> getStaffByRole(UUID roleId);

    /**
     * Lấy danh sách nhân viên theo phòng ban
     * 
     * @param department tên phòng ban
     * @return danh sách nhân viên thuộc phòng ban
     */
    List<StaffResponse> getStaffByDepartment(String department);
}