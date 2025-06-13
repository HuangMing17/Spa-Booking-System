package com.hoangduyminh.exercise201.service;

import com.hoangduyminh.exercise201.dto.VariantDTO;
import com.hoangduyminh.exercise201.dto.VariantOptionDTO;

import java.util.List;
import java.util.UUID;

public interface VariantService {
    /**
     * Tạo mới một khung giờ làm việc
     * 
     * @param variantDTO thông tin khung giờ cần tạo
     * @return khung giờ đã được tạo
     */
    VariantDTO createVariant(VariantDTO variantDTO);

    /**
     * Cập nhật thông tin khung giờ
     * 
     * @param id         id khung giờ cần cập nhật
     * @param variantDTO thông tin khung giờ mới
     * @return khung giờ đã được cập nhật
     */
    VariantDTO updateVariant(UUID id, VariantDTO variantDTO);

    /**
     * Xóa một khung giờ
     * 
     * @param id id khung giờ cần xóa
     */
    void deleteVariant(UUID id);

    /**
     * Lấy thông tin chi tiết một khung giờ
     * 
     * @param id id khung giờ cần lấy thông tin
     * @return thông tin chi tiết khung giờ
     */
    VariantDTO getVariantById(UUID id);

    /**
     * Lấy danh sách tất cả khung giờ
     * 
     * @return danh sách tất cả khung giờ
     */
    List<VariantDTO> getAllVariants();

    /**
     * Lấy danh sách khung giờ đang hoạt động
     * 
     * @return danh sách khung giờ active
     */
    List<VariantDTO> getActiveVariants();

    /**
     * Thêm thời gian cụ thể vào khung giờ
     * 
     * @param variantId id khung giờ
     * @param optionDTO thông tin thời gian cụ thể
     * @return thông tin thời gian đã thêm
     */
    VariantOptionDTO addOptionToVariant(UUID variantId, VariantOptionDTO optionDTO);

    /**
     * Cập nhật thời gian trong khung giờ
     * 
     * @param optionId  id thời gian cần cập nhật
     * @param optionDTO thông tin thời gian mới
     * @return thời gian đã được cập nhật
     */
    VariantOptionDTO updateVariantOption(UUID optionId, VariantOptionDTO optionDTO);

    /**
     * Xóa thời gian khỏi khung giờ
     * 
     * @param optionId id thời gian cần xóa
     */
    void deleteVariantOption(UUID optionId);

    /**
     * Lấy danh sách thời gian của một khung giờ
     * 
     * @param variantId id khung giờ
     * @return danh sách thời gian trong khung giờ
     */
    List<VariantOptionDTO> getOptionsByVariant(UUID variantId);

    /**
     * Lấy thông tin chi tiết một thời gian
     * 
     * @param optionId id thời gian cần lấy thông tin
     * @return thông tin chi tiết thời gian
     */
    VariantOptionDTO getOptionById(UUID optionId);

    /**
     * Kiểm tra khung giờ có thể xóa không
     * 
     * @param id id khung giờ cần kiểm tra
     * @return true nếu có thể xóa, false nếu không
     */
    boolean canDeleteVariant(UUID id);
}