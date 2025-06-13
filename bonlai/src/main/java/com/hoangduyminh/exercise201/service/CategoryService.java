package com.hoangduyminh.exercise201.service;

import com.hoangduyminh.exercise201.dto.CategoryDTO;
import com.hoangduyminh.exercise201.dto.request.CategoryRequest;
import com.hoangduyminh.exercise201.dto.response.CategoryResponse;
import com.hoangduyminh.exercise201.dto.response.ProductResponse;

import java.util.List;
import java.util.UUID;

/**
 * Service interface để quản lý danh mục sản phẩm
 */
public interface CategoryService {

    /**
     * Method cũ - Giữ nguyên
     */
    CategoryDTO createCategory(CategoryDTO categoryDTO);

    CategoryDTO updateCategory(UUID id, CategoryDTO categoryDTO);

    void deleteCategory(UUID id);

    CategoryDTO getCategoryById(UUID id);

    List<CategoryDTO> getAllCategories();

    /**
     * Method mới thêm vào - Sử dụng Request/Response DTOs
     */

    /**
     * Tạo mới danh mục từ request
     * 
     * @param request thông tin danh mục
     * @return thông tin chi tiết danh mục đã tạo
     */
    CategoryResponse createCategoryFromRequest(CategoryRequest request);

    /**
     * Cập nhật danh mục từ request
     * 
     * @param id      id danh mục
     * @param request thông tin cập nhật
     * @return thông tin chi tiết sau khi cập nhật
     */
    CategoryResponse updateCategoryFromRequest(UUID id, CategoryRequest request);

    /**
     * Lấy thông tin chi tiết danh mục
     * 
     * @param id id danh mục
     * @return thông tin chi tiết danh mục
     */
    CategoryResponse getCategoryDetailById(UUID id);

    /**
     * Lấy danh sách tất cả danh mục với thông tin chi tiết
     * 
     * @return danh sách danh mục
     */
    List<CategoryResponse> getAllCategoryDetails();

    /**
     * Tìm kiếm danh mục theo từ khóa
     * 
     * @param keyword từ khóa tìm kiếm (tên, mô tả)
     * @return danh sách danh mục phù hợp
     */
    List<CategoryResponse> searchCategories(String keyword);

    /**
     * Lấy danh sách danh mục con trực tiếp
     * 
     * @param parentId id danh mục cha
     * @return danh sách danh mục con
     */
    List<CategoryResponse> getChildCategories(UUID parentId);

    /**
     * Lấy danh sách sản phẩm trong danh mục
     * 
     * @param categoryId id danh mục
     * @return danh sách sản phẩm
     */
    List<ProductResponse> getCategoryProducts(UUID categoryId);

    /**
     * Upload ảnh cho danh mục
     * 
     * @param id       id danh mục
     * @param imageUrl URL ảnh đã upload
     * @return thông tin chi tiết sau khi upload
     */
    CategoryResponse uploadImage(UUID id, String imageUrl);

    /**
     * Xóa ảnh của danh mục
     * 
     * @param id id danh mục
     * @return thông tin chi tiết sau khi xóa ảnh
     */
    CategoryResponse deleteImage(UUID id);
}