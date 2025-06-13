package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.AttributeValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttributeValueRepository extends JpaRepository<AttributeValue, UUID> {

    /**
     * Tìm tất cả đặc điểm của một phòng
     */
    List<AttributeValue> findByAttributeId(UUID attributeId);

    /**
     * Tìm đặc điểm theo giá trị cụ thể
     */
    List<AttributeValue> findByAttributeValueContainingIgnoreCase(String attributeValue);

    /**
     * Đếm số lượng đặc điểm trong phòng
     */
    long countByAttributeId(UUID attributeId);

    /**
     * Xóa tất cả đặc điểm của một phòng
     */
    void deleteByAttributeId(UUID attributeId);

    /**
     * Kiểm tra giá trị đặc điểm đã tồn tại trong phòng chưa
     */
    boolean existsByAttributeIdAndAttributeValueIgnoreCase(UUID attributeId, String attributeValue);

    /**
     * Tìm đặc điểm theo danh sách phòng
     */
    List<AttributeValue> findByAttributeIdIn(List<UUID> attributeIds);

    Optional<AttributeValue> findByAttributeValue(String attributeValue);
}