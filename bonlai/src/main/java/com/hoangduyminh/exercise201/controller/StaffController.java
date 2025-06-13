package com.hoangduyminh.exercise201.controller;

import com.hoangduyminh.exercise201.dto.request.StaffRequest;
import com.hoangduyminh.exercise201.dto.response.StaffResponse;
import com.hoangduyminh.exercise201.service.StaffAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller cho quản lý nhân viên
 */
@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffAccountService staffService;

    /**
     * Tạo mới nhân viên
     * 
     * @param request thông tin nhân viên
     * @return thông tin nhân viên đã tạo
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StaffResponse> createStaff(
            @Valid @RequestBody StaffRequest request) {
        StaffResponse response = staffService.createStaffFromRequest(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Cập nhật thông tin nhân viên
     * 
     * @param id      id nhân viên
     * @param request thông tin cập nhật
     * @return thông tin sau khi cập nhật
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StaffResponse> updateStaff(
            @PathVariable UUID id,
            @Valid @RequestBody StaffRequest request) {
        StaffResponse response = staffService.updateStaffFromRequest(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa nhân viên
     * 
     * @param id id nhân viên
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStaff(@PathVariable UUID id) {
        staffService.deleteStaffAccount(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy thông tin chi tiết nhân viên
     * 
     * @param id id nhân viên
     * @return thông tin nhân viên
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<StaffResponse> getStaff(@PathVariable UUID id) {
        StaffResponse response = staffService.getStaffDetailById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách nhân viên
     * 
     * @return danh sách nhân viên
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<StaffResponse>> getAllStaff() {
        List<StaffResponse> responses = staffService.getAllStaffDetails();
        return ResponseEntity.ok(responses);
    }

    /**
     * Tìm kiếm nhân viên
     * 
     * @param keyword từ khóa tìm kiếm
     * @return danh sách nhân viên phù hợp
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<StaffResponse>> searchStaff(
            @RequestParam(required = false) String keyword) {
        List<StaffResponse> responses = staffService.searchStaff(keyword);
        return ResponseEntity.ok(responses);
    }

    /**
     * Gán role cho nhân viên
     * 
     * @param id      id nhân viên
     * @param roleIds danh sách role
     * @return thông tin sau khi gán role
     */
    @PostMapping("/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StaffResponse> assignRoles(
            @PathVariable UUID id,
            @RequestBody List<UUID> roleIds) {
        StaffResponse response = staffService.assignRoles(id, roleIds);
        return ResponseEntity.ok(response);
    }

    /**
     * Gỡ role khỏi nhân viên
     * 
     * @param id     id nhân viên
     * @param roleId id role
     * @return thông tin sau khi gỡ role
     */
    @DeleteMapping("/{id}/roles/{roleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StaffResponse> removeRole(
            @PathVariable UUID id,
            @PathVariable UUID roleId) {
        StaffResponse response = staffService.removeRole(id, roleId);
        return ResponseEntity.ok(response);
    }

    /**
     * Cập nhật trạng thái active
     * 
     * @param id       id nhân viên
     * @param isActive trạng thái mới
     * @return thông tin sau khi cập nhật
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StaffResponse> updateStatus(
            @PathVariable UUID id,
            @RequestParam Boolean isActive) {
        StaffResponse response = staffService.updateStatus(id, isActive);
        return ResponseEntity.ok(response);
    }

    /**
     * Đổi mật khẩu
     * 
     * @param id          id nhân viên
     * @param oldPassword mật khẩu cũ
     * @param newPassword mật khẩu mới
     * @return thông tin sau khi đổi mật khẩu
     */
    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<StaffResponse> changePassword(
            @PathVariable UUID id,
            @RequestParam String oldPassword,
            @RequestParam String newPassword) {
        StaffResponse response = staffService.changePassword(id, oldPassword, newPassword);
        return ResponseEntity.ok(response);
    }

    /**
     * Reset mật khẩu
     * 
     * @param id id nhân viên
     * @return mật khẩu mới
     */
    @PostMapping("/{id}/password/reset")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> resetPassword(@PathVariable UUID id) {
        String newPassword = staffService.resetPassword(id);
        return ResponseEntity.ok(newPassword);
    }

    /**
     * Lấy danh sách nhân viên theo role
     * 
     * @param roleId id role
     * @return danh sách nhân viên có role
     */
    @GetMapping("/role/{roleId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<StaffResponse>> getStaffByRole(
            @PathVariable UUID roleId) {
        List<StaffResponse> responses = staffService.getStaffByRole(roleId);
        return ResponseEntity.ok(responses);
    }

    /**
     * Lấy danh sách nhân viên theo phòng ban
     * 
     * @param department tên phòng ban
     * @return danh sách nhân viên thuộc phòng ban
     */
    @GetMapping("/department/{department}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<StaffResponse>> getStaffByDepartment(
            @PathVariable String department) {
        List<StaffResponse> responses = staffService.getStaffByDepartment(department);
        return ResponseEntity.ok(responses);
    }
}