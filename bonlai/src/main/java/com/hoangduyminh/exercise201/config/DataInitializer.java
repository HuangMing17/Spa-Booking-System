package com.hoangduyminh.exercise201.config;

import com.hoangduyminh.exercise201.constant.OrderStatusConstant;
import com.hoangduyminh.exercise201.entity.OrderStatus;
import com.hoangduyminh.exercise201.repository.OrderStatusRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final OrderStatusRepository orderStatusRepository;
    private final com.hoangduyminh.exercise201.repository.RoleRepository roleRepository;
    private final com.hoangduyminh.exercise201.repository.StaffAccountRepository staffAccountRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedOrderStatuses();
        seedRolesAndAdmin();
    }

    private void seedRolesAndAdmin() {
        log.info("Seeding mandatory roles...");
        com.hoangduyminh.exercise201.entity.Role adminRole = roleRepository.findByRoleName("ADMIN").orElse(null);
        if (adminRole == null) {
            adminRole = new com.hoangduyminh.exercise201.entity.Role();
            adminRole.setRoleName("ADMIN");
            adminRole = roleRepository.save(adminRole);
        }

        com.hoangduyminh.exercise201.entity.Role staffRole = roleRepository.findByRoleName("STAFF").orElse(null);
        if (staffRole == null) {
            staffRole = new com.hoangduyminh.exercise201.entity.Role();
            staffRole.setRoleName("STAFF");
            roleRepository.save(staffRole);
        }

        String secureUser = "bonlai_administrator_2026";
        String securePass = "B0nLai@Spa#Secure!2026";

        if (staffAccountRepository.findByUserName(secureUser).isEmpty()) {
            log.info("Creating high-security admin account...");

            com.hoangduyminh.exercise201.entity.StaffAccount admin = new com.hoangduyminh.exercise201.entity.StaffAccount();
            admin.setFirst_name("System");
            admin.setLast_name("Administrator");
            admin.setUserName(secureUser);
            admin.setEmail("admin@bonlaispa.com");
            admin.setPhone_number("0999999999");
            admin.setPassword_hash(passwordEncoder.encode(securePass));
            admin.setActive(true);
            admin.setRole(adminRole);
            staffAccountRepository.save(admin);
            
            log.info("High-security Admin account seeded successfully.");
            log.info("Credentials: [Username: {} | Password: {}]", secureUser, securePass);
        } else {
            log.info("Admin account [{}] already exists.", secureUser);
        }
    }

    private void seedOrderStatuses() {
        if (orderStatusRepository.count() == 0) {
            log.info("Seeding mandatory order statuses...");

            saveStatus(OrderStatusConstant.PENDING, "orange");
            saveStatus(OrderStatusConstant.CONFIRMED, "blue");
            saveStatus(OrderStatusConstant.PROCESSING, "green");
            saveStatus(OrderStatusConstant.COMPLETED, "purple");
            saveStatus(OrderStatusConstant.CANCELLED, "red");
            saveStatus(OrderStatusConstant.REFUNDED, "gray");

            log.info("Order statuses seeded successfully.");
        } else {
            log.info("Order statuses already exist. Skipping seeding.");
        }
    }

    private void saveStatus(String name, String color) {
        OrderStatus status = new OrderStatus();
        status.setStatusName(name);
        status.setColor(color);
        status.setCreated_at(new Date());
        status.setUpdated_at(new Date());
        orderStatusRepository.save(status);
    }
}
