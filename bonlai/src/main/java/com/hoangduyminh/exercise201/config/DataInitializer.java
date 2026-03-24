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

    @Override
    public void run(String... args) {
        seedOrderStatuses();
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
