package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.CustomerAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CustomerAddressRepository extends JpaRepository<CustomerAddress, UUID> {

    List<CustomerAddress> findByCustomerId(UUID customerId);

    @Query("SELECT a FROM CustomerAddress a WHERE a.customer.id = :customerId ORDER BY a.id DESC")
    List<CustomerAddress> findByCustomerOrderByIdDesc(UUID customerId);
}