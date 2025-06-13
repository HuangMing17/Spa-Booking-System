package com.hoangduyminh.exercise201.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CombinedUserDetailsService implements UserDetailsService {
    private final StaffDetailsService staffDetailsService;
    private final CustomerDetailsService customerDetailsService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            return staffDetailsService.loadUserByUsername(username);
        } catch (UsernameNotFoundException e) {
            // Nếu không phải staff, thử tìm customer
            return customerDetailsService.loadUserByUsername(username);
        }
    }
}