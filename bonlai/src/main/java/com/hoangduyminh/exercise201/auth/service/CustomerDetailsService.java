package com.hoangduyminh.exercise201.auth.service;

import com.hoangduyminh.exercise201.entity.Customer;
import com.hoangduyminh.exercise201.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Service để load Customer UserDetails
 */
@Service("customerDetailsService")
@Primary
@RequiredArgsConstructor
public class CustomerDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Customer not found with email: " + email));

        // Customer mặc định có ROLE_CUSTOMER
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_CUSTOMER"));

        // Đảm bảo password không bao giờ null, đặc biệt là với Firebase users
        String password = customer.getPassword_hash();
        if (password == null || password.isEmpty()) {
            password = "{noop}FIREBASE_AUTH_USER";
        }

        return User.builder()
                .username(customer.getEmail())
                .password(password)
                .authorities(authorities)
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!customer.getActive()) // Sử dụng trạng thái active của customer
                .build();
    }
}