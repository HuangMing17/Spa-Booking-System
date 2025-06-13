package com.hoangduyminh.exercise201.auth.service;

import com.hoangduyminh.exercise201.entity.Role;
import com.hoangduyminh.exercise201.entity.StaffAccount;
import com.hoangduyminh.exercise201.repository.StaffAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Service để load Staff UserDetails
 */
@Service("staffDetailsService")
@RequiredArgsConstructor
public class StaffDetailsService implements UserDetailsService {

    private final StaffAccountRepository staffAccountRepository;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        StaffAccount staff = staffAccountRepository.findByUserName(userName)
                .orElseThrow(() -> new UsernameNotFoundException("Staff not found with username: " + userName));

        // Lấy role của staff và thêm prefix ROLE_
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        if (staff.getRole() != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + staff.getRole().getRoleName()));
        }

        // Mặc định thêm ROLE_STAFF
        authorities.add(new SimpleGrantedAuthority("ROLE_STAFF"));

        return User.builder()
                .username(staff.getUserName())
                .password(staff.getPassword_hash())
                .authorities(authorities)
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!staff.isActive())
                .build();
    }
}