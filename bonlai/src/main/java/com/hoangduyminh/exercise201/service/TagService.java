package com.hoangduyminh.exercise201.service;

import com.hoangduyminh.exercise201.dto.TagDTO;
import com.hoangduyminh.exercise201.dto.request.TagRequest;
import com.hoangduyminh.exercise201.dto.response.TagResponse;
import java.util.List;
import java.util.UUID;

/**
 * Service interface để quản lý tag
 */
public interface TagService {

    /**
     * Method cũ - Giữ nguyên
     */
    TagDTO createTag(TagDTO tagDTO);

    TagDTO updateTag(UUID id, TagDTO tagDTO);

    void deleteTag(UUID id);

    TagDTO getTagById(UUID id);

    List<TagDTO> getAllTags();

    /**
     * Method mới thêm vào - Sử dụng Request/Response DTOs
     */

    /**
     * Tạo mới tag từ request
     * 
     * @param request thông tin tag
     * @return thông tin chi tiết tag đã tạo
     */
    TagResponse createTagFromRequest(TagRequest request);

    /**
     * Cập nhật tag từ request
     * 
     * @param id      id tag
     * @param request thông tin cập nhật
     * @return thông tin chi tiết sau khi cập nhật
     */
    TagResponse updateTagFromRequest(UUID id, TagRequest request);

    /**
     * Lấy thông tin chi tiết tag
     * 
     * @param id id tag
     * @return thông tin chi tiết tag
     */
    TagResponse getTagDetailById(UUID id);

    /**
     * Lấy danh sách tất cả tag với thông tin chi tiết
     * 
     * @return danh sách tag
     */
    List<TagResponse> getAllTagDetails();

    /**
     * Tìm kiếm tag theo từ khóa
     * 
     * @param keyword từ khóa tìm kiếm (tên, mô tả)
     * @return danh sách tag phù hợp
     */
    List<TagResponse> searchTags(String keyword);

    /**
     * Lấy tag của sản phẩm
     * 
     * @param productId id sản phẩm
     * @return danh sách tag của sản phẩm
     */
    List<TagResponse> getTagsByProduct(UUID productId);

    /**
     * Gán tag cho sản phẩm
     * 
     * @param productId id sản phẩm
     * @param tagId     id tag
     * @return thông tin chi tiết tag
     */
    TagResponse assignToProduct(UUID productId, UUID tagId);

    /**
     * Gỡ tag khỏi sản phẩm
     * 
     * @param productId id sản phẩm
     * @param tagId     id tag
     */
    void removeFromProduct(UUID productId, UUID tagId);

    /**
     * Lấy tag liên quan
     * 
     * @param id id tag
     * @return danh sách tag liên quan
     */
    List<TagResponse> getRelatedTags(UUID id);

    /**
     * Cập nhật trạng thái active/inactive
     * 
     * @param id       id tag
     * @param isActive trạng thái mới
     * @return thông tin chi tiết sau khi cập nhật
     */
    TagResponse updateStatus(UUID id, Boolean isActive);
}