package com.hoangduyminh.exercise201.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hoangduyminh.exercise201.entity.Product;
import com.hoangduyminh.exercise201.entity.ProductSupplier;
import com.hoangduyminh.exercise201.entity.ProductSupplierId;
import com.hoangduyminh.exercise201.entity.Supplier;

@Repository
public interface ProductSupplierRepository extends JpaRepository<ProductSupplier, ProductSupplierId> {
    List<ProductSupplier> findByProduct(Product product);

    List<ProductSupplier> findBySupplier(Supplier supplier);

    void deleteByProductAndSupplier(Product product, Supplier supplier);
}