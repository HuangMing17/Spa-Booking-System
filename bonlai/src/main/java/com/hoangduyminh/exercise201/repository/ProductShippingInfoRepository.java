package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.ProductShippingInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProductShippingInfoRepository extends JpaRepository<ProductShippingInfo, UUID> {
}