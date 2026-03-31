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
        if (roleRepository.count() == 0) {
            log.info("Seeding mandatory roles...");
            com.hoangduyminh.exercise201.entity.Role adminRole = new com.hoangduyminh.exercise201.entity.Role();
            adminRole.setRoleName("ADMIN");
            roleRepository.save(adminRole);

            com.hoangduyminh.exercise201.entity.Role staffRole = new com.hoangduyminh.exercise201.entity.Role();
            staffRole.setRoleName("STAFF");
            roleRepository.save(staffRole);
        }

        if (staffAccountRepository.findByUserName("admin").isEmpty()) {
            log.info("Creating default admin account...");
            com.hoangduyminh.exercise201.entity.Role adminRole = roleRepository.findByRoleName("ADMIN").orElse(null);

            com.hoangduyminh.exercise201.entity.StaffAccount admin = new com.hoangduyminh.exercise201.entity.StaffAccount();
            admin.setFirst_name("Super");
            admin.setLast_name("Admin");
            admin.setUserName("admin");
            admin.setEmail("admin@webforspa.com");
            admin.setPhone_number("0999999999");
            admin.setPassword_hash(passwordEncoder.encode("admin123"));
            admin.setActive(true);
            admin.setRole(adminRole);
            staffAccountRepository.save(admin);
            
            log.info("Admin account seeded successfully (Username: admin / Password: admin123).");
        } else {
            log.info("Admin account already exists. Skipping seeding.");
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
