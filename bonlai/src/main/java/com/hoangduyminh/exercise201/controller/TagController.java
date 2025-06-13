package com.hoangduyminh.exercise201.controller;

import com.hoangduyminh.exercise201.dto.request.TagRequest;
import com.hoangduyminh.exercise201.dto.response.TagResponse;
import com.hoangduyminh.exercise201.service.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller cho quản lý tag
 */
@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    /**
     * Tạo mới tag
     * 
     * @param request thông tin tag
     * @return thông tin tag đã tạo
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TagResponse> createTag(
            @Valid @RequestBody TagRequest request) {
        TagResponse response = tagService.createTagFromRequest(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Cập nhật tag
     * 
     * @param id      id tag
     * @param request thông tin cập nhật
     * @return thông tin sau khi cập nhật
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TagResponse> updateTag(
            @PathVariable UUID id,
            @Valid @RequestBody TagRequest request) {
        TagResponse response = tagService.updateTagFromRequest(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa tag
     * 
     * @param id id tag
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTag(@PathVariable UUID id) {
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy thông tin chi tiết tag
     * 
     * @param id id tag
     * @return thông tin tag
     */
    @GetMapping("/{id}")
    public ResponseEntity<TagResponse> getTag(@PathVariable UUID id) {
        TagResponse response = tagService.getTagDetailById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách tất cả tag
     * 
     * @return danh sách tag
     */
    @GetMapping
    public ResponseEntity<List<TagResponse>> getAllTags() {
        List<TagResponse> responses = tagService.getAllTagDetails();
        return ResponseEntity.ok(responses);
    }

    /**
     * Tìm kiếm tag
     * 
     * @param keyword từ khóa tìm kiếm
     * @return danh sách tag phù hợp
     */
    @GetMapping("/search")
    public ResponseEntity<List<TagResponse>> searchTags(
            @RequestParam(required = false) String keyword) {
        List<TagResponse> responses = tagService.searchTags(keyword);
        return ResponseEntity.ok(responses);
    }

    /**
     * Lấy tag của sản phẩm
     * 
     * @param productId id sản phẩm
     * @return danh sách tag
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<TagResponse>> getTagsByProduct(
            @PathVariable UUID productId) {
        List<TagResponse> responses = tagService.getTagsByProduct(productId);
        return ResponseEntity.ok(responses);
    }

    /**
     * Gán tag cho sản phẩm
     * 
     * @param productId id sản phẩm
     * @param tagId     id tag
     * @return thông tin tag sau khi gán
     */
    @PostMapping("/{tagId}/products/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TagResponse> assignToProduct(
            @PathVariable UUID productId,
            @PathVariable UUID tagId) {
        TagResponse response = tagService.assignToProduct(productId, tagId);
        return ResponseEntity.ok(response);
    }

    /**
     * Gỡ tag khỏi sản phẩm
     * 
     * @param productId id sản phẩm
     * @param tagId     id tag
     */
    @DeleteMapping("/{tagId}/products/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> removeFromProduct(
            @PathVariable UUID productId,
            @PathVariable UUID tagId) {
        tagService.removeFromProduct(productId, tagId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy tag liên quan
     * 
     * @param id id tag
     * @return danh sách tag liên quan
     */
    @GetMapping("/{id}/related")
    public ResponseEntity<List<TagResponse>> getRelatedTags(
            @PathVariable UUID id) {
        List<TagResponse> responses = tagService.getRelatedTags(id);
        return ResponseEntity.ok(responses);
    }

    /**
     * Cập nhật trạng thái active/inactive
     * 
     * @param id       id tag
     * @param isActive trạng thái mới
     * @return thông tin sau khi cập nhật
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TagResponse> updateStatus(
            @PathVariable UUID id,
            @RequestParam Boolean isActive) {
        TagResponse response = tagService.updateStatus(id, isActive);
        return ResponseEntity.ok(response);
    }
}