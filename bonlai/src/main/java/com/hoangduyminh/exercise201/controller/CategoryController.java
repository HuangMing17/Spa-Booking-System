package com.hoangduyminh.exercise201.controller;

import com.hoangduyminh.exercise201.dto.request.CategoryRequest;
import com.hoangduyminh.exercise201.dto.response.CategoryResponse;
import com.hoangduyminh.exercise201.dto.response.ProductResponse;
import com.hoangduyminh.exercise201.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller cho quản lý danh mục
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * Tạo mới danh mục
     * 
     * @param request thông tin danh mục
     * @return thông tin danh mục đã tạo
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryRequest request) {
        CategoryResponse response = categoryService.createCategoryFromRequest(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Cập nhật danh mục
     * 
     * @param id      id danh mục
     * @param request thông tin cập nhật
     * @return thông tin sau khi cập nhật
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable UUID id,
            @Valid @RequestBody CategoryRequest request) {
        CategoryResponse response = categoryService.updateCategoryFromRequest(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa danh mục
     * 
     * @param id id danh mục
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy thông tin chi tiết danh mục
     * 
     * @param id id danh mục
     * @return thông tin danh mục
     */
    @GetMapping("/{id}")
    @PreAuthorize("permitAll() ")
    public ResponseEntity<CategoryResponse> getCategory(@PathVariable UUID id) {
        CategoryResponse response = categoryService.getCategoryDetailById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách danh mục
     * 
     * @return danh sách danh mục
     */
    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> responses = categoryService.getAllCategoryDetails();
        return ResponseEntity.ok(responses);
    }

    /**
     * Tìm kiếm danh mục
     * 
     * @param keyword từ khóa tìm kiếm
     * @return danh sách danh mục phù hợp
     */
    @GetMapping("/search")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<CategoryResponse>> searchCategories(
            @RequestParam(required = false) String keyword) {
        List<CategoryResponse> responses = categoryService.searchCategories(keyword);
        return ResponseEntity.ok(responses);
    }

    /**
     * Lấy danh mục con trực tiếp
     * 
     * @param id id danh mục cha
     * @return danh sách danh mục con
     */
    @GetMapping("/{id}/children")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<CategoryResponse>> getChildCategories(
            @PathVariable UUID id) {
        List<CategoryResponse> responses = categoryService.getChildCategories(id);
        return ResponseEntity.ok(responses);
    }

    /**
     * Lấy sản phẩm trong danh mục
     * 
     * @param id id danh mục
     * @return danh sách sản phẩm
     */
    @GetMapping("/{id}/products")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<ProductResponse>> getCategoryProducts(
            @PathVariable UUID id) {
        List<ProductResponse> responses = categoryService.getCategoryProducts(id);
        return ResponseEntity.ok(responses);
    }

}