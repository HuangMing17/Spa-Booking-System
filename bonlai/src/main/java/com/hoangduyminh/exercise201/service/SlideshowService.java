package com.hoangduyminh.exercise201.service;

import com.hoangduyminh.exercise201.dto.SlideshowDTO;
import com.hoangduyminh.exercise201.dto.request.SlideshowRequest;
import com.hoangduyminh.exercise201.dto.response.SlideshowResponse;

import java.util.List;
import java.util.UUID;

/**
 * Service interface để quản lý slideshow
 */
public interface SlideshowService {

    /**
     * Method cũ - Giữ nguyên
     */
    SlideshowDTO createSlideshow(SlideshowDTO slideshowDTO);

    SlideshowDTO updateSlideshow(UUID id, SlideshowDTO slideshowDTO);

    void deleteSlideshow(UUID id);

    SlideshowDTO getSlideshowById(UUID id);

    List<SlideshowDTO> getAllSlideshows();

    /**
     * Method mới thêm vào - Sử dụng Request/Response DTOs
     */

    /**
     * Tạo mới slideshow từ request
     * 
     * @param request thông tin slideshow
     * @return thông tin chi tiết slideshow đã tạo
     */
    SlideshowResponse createSlideshowFromRequest(SlideshowRequest request);

    /**
     * Cập nhật slideshow từ request
     * 
     * @param id      id slideshow
     * @param request thông tin cập nhật
     * @return thông tin chi tiết sau khi cập nhật
     */
    SlideshowResponse updateSlideshowFromRequest(UUID id, SlideshowRequest request);

    /**
     * Lấy thông tin chi tiết slideshow
     * 
     * @param id id slideshow
     * @return thông tin chi tiết slideshow
     */
    SlideshowResponse getSlideshowDetailById(UUID id);

    /**
     * Lấy danh sách slideshow với thông tin chi tiết
     * 
     * @return danh sách slideshow
     */
    List<SlideshowResponse> getAllSlideshowDetails();

    /**
     * Lấy danh sách slideshow đang active
     * 
     * @return danh sách slideshow active
     */
    List<SlideshowResponse> getActiveSlideshows();

    /**
     * Cập nhật trạng thái active
     * 
     * @param id       id slideshow
     * @param isActive trạng thái mới
     * @return thông tin sau khi cập nhật
     */
    SlideshowResponse updateStatus(UUID id, Boolean isActive);

    /**
     * Cập nhật thứ tự hiển thị
     * 
     * @param id    id slideshow
     * @param order thứ tự mới
     * @return thông tin sau khi cập nhật
     */
    SlideshowResponse updateDisplayOrder(UUID id, Integer order);

    /**
     * Ghi nhận lượt xem
     * 
     * @param id id slideshow
     * @return thông tin sau khi cập nhật
     */
    SlideshowResponse recordView(UUID id);

    /**
     * Ghi nhận lượt click
     * 
     * @param id id slideshow
     * @return thông tin sau khi cập nhật
     */
    SlideshowResponse recordClick(UUID id);
}