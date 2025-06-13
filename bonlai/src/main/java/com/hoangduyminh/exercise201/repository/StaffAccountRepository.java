package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.StaffAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository cho StaffAccount entity
 */
@Repository
public interface StaffAccountRepository extends JpaRepository<StaffAccount, UUID> {

        /**
         * Tìm staff account theo username
         */
        Optional<StaffAccount> findByUserName(String userName);

        /**
         * Kiểm tra username đã tồn tại chưa
         */
        boolean existsByUserName(String userName);

        /**
         * Kiểm tra email đã tồn tại chưa
         */
        boolean existsByEmail(String email);

        /**
         * Tìm staff account theo email
         */
        Optional<StaffAccount> findByEmail(String email);
}