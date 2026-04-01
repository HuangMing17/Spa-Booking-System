package com.hoangduyminh.exercise201.controller;

import com.hoangduyminh.exercise201.dto.request.ProductRequest;
import com.hoangduyminh.exercise201.dto.response.ProductResponse;
import com.hoangduyminh.exercise201.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller cho quản lý sản phẩm
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * Tạo mới sản phẩm
     * 
     * @param request thông tin sản phẩm
     * @return thông tin sản phẩm đã tạo
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.createProductFromRequest(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Cập nhật sản phẩm
     * 
     * @param id      id sản phẩm
     * @param request thông tin cập nhật
     * @return thông tin sau khi cập nhật
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.updateProductFromRequest(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa sản phẩm
     * 
     * @param id id sản phẩm
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy thông tin chi tiết sản phẩm
     * 
     * @param id id sản phẩm
     * @return thông tin sản phẩm
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable UUID id) {
        ProductResponse response = productService.getProductDetailById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách tất cả sản phẩm
     * 
     * @return danh sách sản phẩm
     */
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> responses = productService.getAllProductDetails();
        return ResponseEntity.ok(responses);
    }

    /**
     * Tìm kiếm sản phẩm
     * 
     * @param keyword từ khóa tìm kiếm
     * @return danh sách sản phẩm phù hợp
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam(required = false) String keyword) {
        List<ProductResponse> responses = productService.searchProducts(keyword);
        return ResponseEntity.ok(responses);
    }

    /**
     * Lọc sản phẩm theo danh mục
     * 
     * @param categoryId id danh mục
     * @return danh sách sản phẩm thuộc danh mục
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(
            @PathVariable UUID categoryId) {
        List<ProductResponse> responses = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(responses);
    }

    /**
     * Lọc sản phẩm theo tag
     * 
     * @param tagId id tag
     * @return danh sách sản phẩm có tag
     */
    @GetMapping("/tag/{tagId}")
    public ResponseEntity<List<ProductResponse>> getProductsByTag(
            @PathVariable UUID tagId) {
        List<ProductResponse> responses = productService.getProductsByTag(tagId);
        return ResponseEntity.ok(responses);
    }

    /**
     * Upload ảnh cho sản phẩm
     * 
     * @param id        id sản phẩm
     * @param imageUrls danh sách URL ảnh
     * @return thông tin sau khi upload
     */
    @PostMapping("/{id}/images")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<ProductResponse> uploadImages(
            @PathVariable UUID id,
            @RequestBody List<String> imageUrls) {
        ProductResponse response = productService.uploadImages(id, imageUrls);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa ảnh của sản phẩm
     * 
     * @param id      id sản phẩm
     * @param imageId id ảnh
     */
    @DeleteMapping("/{id}/images/{imageId}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<Void> deleteImage(
            @PathVariable UUID id,
            @PathVariable UUID imageId) {
        productService.deleteImage(id, imageId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Cập nhật trạng thái active/inactive
     * 
     * @param id       id sản phẩm
     * @param isActive trạng thái mới
     * @return thông tin sau khi cập nhật
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<ProductResponse> updateStatus(
            @PathVariable UUID id,
            @RequestParam Boolean isActive) {
        ProductResponse response = productService.updateStatus(id, isActive);
        return ResponseEntity.ok(response);
    }
}