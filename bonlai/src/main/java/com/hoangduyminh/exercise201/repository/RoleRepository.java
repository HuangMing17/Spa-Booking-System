package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository cho Role entity
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {

    /**
     * Tìm role theo tên
     */
    Optional<Role> findByRoleName(String roleName);

    /**
     * Kiểm tra role name đã tồn tại chưa
     */
    boolean existsByRoleName(String roleName);

    /**
     * Đếm số lượng staff account đang sử dụng role
     */
    @Query("SELECT COUNT(s) FROM StaffAccount s WHERE s.role.id = :roleId")
    Long countStaffAccountsByRoleId(@Param("roleId") UUID roleId);

    /**
     * Tìm kiếm role theo keyword
     */
    @Query("SELECT r FROM Role r WHERE LOWER(r.roleName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Role> searchRoles(@Param("keyword") String keyword);

    /**
     * Lấy danh sách role của một staff account
     */
    @Query("SELECT r FROM Role r INNER JOIN StaffAccount s ON r.id = s.role.id WHERE s.id = :staffId")
    List<Role> findByStaffId(@Param("staffId") UUID staffId);
}