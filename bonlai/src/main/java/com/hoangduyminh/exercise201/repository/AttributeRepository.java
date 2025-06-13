package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.Attribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttributeRepository extends JpaRepository<Attribute, UUID> {

    /**
     * Tìm thuộc tính theo tên
     * 
     * @param attributeName tên thuộc tính
     * @return thuộc tính tìm được
     */
    Attribute findByAttributeName(String attributeName);

    /**
     * Kiểm tra thuộc tính có tồn tại theo tên
     * 
     * @param attributeName tên thuộc tính
     * @return true nếu tồn tại, false nếu không
     */
    boolean existsByAttributeName(String attributeName);

    /**
     * Tìm thuộc tính theo tên chứa chuỗi
     * 
     * @param attributeName tên thuộc tính
     * @return danh sách thuộc tính tìm được
     */
    List<Attribute> findByAttributeNameContainingIgnoreCase(String attributeName);

    /**
     * Tìm thuộc tính theo sản phẩm
     * 
     * @param productId id sản phẩm
     * @return danh sách thuộc tính của sản phẩm
     */
    List<Attribute> findByProductAttributes_ProductId(UUID productId);
}