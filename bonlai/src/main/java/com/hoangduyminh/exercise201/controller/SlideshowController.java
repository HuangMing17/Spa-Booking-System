package com.hoangduyminh.exercise201.controller;

import com.hoangduyminh.exercise201.dto.request.SlideshowRequest;
import com.hoangduyminh.exercise201.dto.response.SlideshowResponse;
import com.hoangduyminh.exercise201.service.SlideshowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller cho quản lý slideshow
 */
@RestController
@RequestMapping("/api/slideshows")
@RequiredArgsConstructor
public class SlideshowController {

    private final SlideshowService slideshowService;

    /**
     * Tạo mới slideshow
     * 
     * @param request thông tin slideshow
     * @return thông tin slideshow đã tạo
     */
    @PostMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<SlideshowResponse> createSlideshow(
            @Valid @RequestBody SlideshowRequest request) {
        SlideshowResponse response = slideshowService.createSlideshowFromRequest(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Cập nhật slideshow
     * 
     * @param id      id slideshow
     * @param request thông tin cập nhật
     * @return thông tin sau khi cập nhật
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<SlideshowResponse> updateSlideshow(
            @PathVariable UUID id,
            @Valid @RequestBody SlideshowRequest request) {
        SlideshowResponse response = slideshowService.updateSlideshowFromRequest(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa slideshow
     * 
     * @param id id slideshow
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<Void> deleteSlideshow(@PathVariable UUID id) {
        slideshowService.deleteSlideshow(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy thông tin chi tiết slideshow
     * 
     * @param id id slideshow
     * @return thông tin slideshow
     */
    @GetMapping("/{id}")
    public ResponseEntity<SlideshowResponse> getSlideshow(@PathVariable UUID id) {
        SlideshowResponse response = slideshowService.getSlideshowDetailById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách slideshow
     * 
     * @return danh sách slideshow
     */
    @GetMapping
    public ResponseEntity<List<SlideshowResponse>> getAllSlideshows() {
        List<SlideshowResponse> responses = slideshowService.getAllSlideshowDetails();
        return ResponseEntity.ok(responses);
    }

    /**
     * Lấy danh sách slideshow đang active
     * 
     * @return danh sách slideshow active
     */
    @GetMapping("/active")
    public ResponseEntity<List<SlideshowResponse>> getActiveSlideshows() {
        List<SlideshowResponse> responses = slideshowService.getActiveSlideshows();
        return ResponseEntity.ok(responses);
    }

    /**
     * Cập nhật trạng thái active
     * 
     * @param id       id slideshow
     * @param isActive trạng thái mới
     * @return thông tin sau khi cập nhật
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<SlideshowResponse> updateStatus(
            @PathVariable UUID id,
            @RequestParam Boolean isActive) {
        SlideshowResponse response = slideshowService.updateStatus(id, isActive);
        return ResponseEntity.ok(response);
    }

    /**
     * Cập nhật thứ tự hiển thị
     * 
     * @param id    id slideshow
     * @param order thứ tự mới
     * @return thông tin sau khi cập nhật
     */
    @PutMapping("/{id}/order")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<SlideshowResponse> updateDisplayOrder(
            @PathVariable UUID id,
            @RequestParam Integer order) {
        SlideshowResponse response = slideshowService.updateDisplayOrder(id, order);
        return ResponseEntity.ok(response);
    }

    /**
     * Ghi nhận lượt xem
     * 
     * @param id id slideshow
     * @return thông tin sau khi cập nhật
     */
    @PostMapping("/{id}/view")
    public ResponseEntity<SlideshowResponse> recordView(@PathVariable UUID id) {
        SlideshowResponse response = slideshowService.recordView(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Ghi nhận lượt click
     * 
     * @param id id slideshow
     * @return thông tin sau khi cập nhật
     */
    @PostMapping("/{id}/click")
    public ResponseEntity<SlideshowResponse> recordClick(@PathVariable UUID id) {
        SlideshowResponse response = slideshowService.recordClick(id);
        return ResponseEntity.ok(response);
    }
}