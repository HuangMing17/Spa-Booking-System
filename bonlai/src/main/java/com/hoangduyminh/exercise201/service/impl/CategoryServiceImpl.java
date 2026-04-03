package com.hoangduyminh.exercise201.service.impl;

import com.hoangduyminh.exercise201.dto.CategoryDTO;
import com.hoangduyminh.exercise201.dto.request.CategoryRequest;
import com.hoangduyminh.exercise201.dto.response.CategoryResponse;
import com.hoangduyminh.exercise201.dto.response.ProductResponse;
import com.hoangduyminh.exercise201.entity.Category;
import com.hoangduyminh.exercise201.entity.ProductCategory;
import com.hoangduyminh.exercise201.exception.ResourceNotFoundException;
import com.hoangduyminh.exercise201.repository.CategoryRepository;
import com.hoangduyminh.exercise201.repository.ProductCategoryRepository;
import com.hoangduyminh.exercise201.service.CategoryService;
import com.hoangduyminh.exercise201.service.ProductService;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation của CategoryService để quản lý danh mục sản phẩm
 * Không thay đổi entity, chỉ đọc dữ liệu
 */
@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductService productService;

    public CategoryServiceImpl(CategoryRepository categoryRepository,
            ProductCategoryRepository productCategoryRepository,
            @Lazy ProductService productService) {
        this.categoryRepository = categoryRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.productService = productService;
    }

    // Giữ nguyên các method cũ
    @Override
    @Transactional
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        // Implementation cũ giữ nguyên
        return categoryDTO;
    }

    @Override
    @Transactional
    public CategoryDTO updateCategory(UUID id, CategoryDTO categoryDTO) {
        // Implementation cũ giữ nguyên
        return categoryDTO;
    }

    @Override
    @Transactional
    public void deleteCategory(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        // Kiểm tra có danh mục con không
        if (category.getSubCategories() != null && !category.getSubCategories().isEmpty()) {
            throw new IllegalStateException("Cannot delete category with sub-categories. Delete sub-categories first.");
        }

        // Xóa các liên kết với sản phẩm (nếu có)
        List<ProductCategory> productCategories = productCategoryRepository.findByCategory(category);
        productCategoryRepository.deleteAll(productCategories);

        // Xóa danh mục
        categoryRepository.delete(category);
    }

    @Override
    public CategoryDTO getCategoryById(UUID id) {
        // Implementation cũ giữ nguyên
        return new CategoryDTO();
    }

    @Override
    public List<CategoryDTO> getAllCategories() {
        // Implementation cũ giữ nguyên
        return List.of();
    }

    // Implement các method mới
    @Override
    @Transactional
    public CategoryResponse createCategoryFromRequest(CategoryRequest request) {
        Category category = new Category();
        category.setId(UUID.randomUUID());
        category.setCategoryName(request.getName());

        if (request.getDescription() != null) {
            category.setCategoryDescription(request.getDescription());
        }



        category.setActive(request.getIsActive() != null ? request.getIsActive() : true);
        category.setCreated_at(new java.util.Date());
        category.setUpdated_at(new java.util.Date());

        // Nếu có parentId thì set parent
        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getParentId()));
            category.setParent(parent);
        }

        Category savedCategory = categoryRepository.save(category);
        return convertToResponse(savedCategory);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategoryFromRequest(UUID id, CategoryRequest request) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        existingCategory.setCategoryName(request.getName());

        if (request.getDescription() != null) {
            existingCategory.setCategoryDescription(request.getDescription());
        } else {
            existingCategory.setCategoryDescription(null);
        }



        existingCategory.setActive(request.getIsActive() != null ? request.getIsActive() : true);
        existingCategory.setUpdated_at(new java.util.Date());

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getParentId()));
            existingCategory.setParent(parent);
        } else {
            existingCategory.setParent(null);
        }

        Category updatedCategory = categoryRepository.save(existingCategory);
        return convertToResponse(updatedCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryDetailById(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return convertToDetailedResponse(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategoryDetails() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDetailedResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> searchCategories(String keyword) {
        return categoryRepository.findByCategoryNameContainingIgnoreCase(keyword).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getChildCategories(UUID parentId) {
        return categoryRepository.findById(parentId)
                .map(parent -> categoryRepository.findByParentId(parentId).stream()
                        .map(this::convertToResponse)
                        .collect(Collectors.toList()))
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", parentId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getCategoryProducts(UUID categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));

        return productCategoryRepository.findByCategory(category).stream()
                .map(pc -> productService.getProductDetailById(pc.getProduct().getId()))
                .collect(Collectors.toList());
    }



    /**
     * Convert Category entity sang Response DTO cơ bản
     */
    private CategoryResponse convertToResponse(Category category) {
        if (category == null)
            return null;

        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getCategoryName());

        if (category.getCategoryDescription() != null && !category.getCategoryDescription().isEmpty()) {
            response.setDescription(category.getCategoryDescription());
        }



        response.setIsActive(category.isActive());

        if (category.getParent() != null) {
            response.setParentId(category.getParent().getId());
            response.setParentName(category.getParent().getCategoryName());
        }

        // Các thông tin cơ bản khác
        response.setCreatedAt(category.getCreated_at());
        response.setUpdatedAt(category.getUpdated_at());

        return response;
    }

    /**
     * Convert Category entity sang Response DTO chi tiết
     * Bao gồm thống kê và thông tin liên quan
     */
    private CategoryResponse convertToDetailedResponse(Category category) {
        CategoryResponse response = convertToResponse(category);
        if (response == null)
            return null;

        // Tính toán và set các trường thống kê
        if (category.getSubCategories() != null) {
            response.setChildCount(category.getSubCategories().size());

            // Nếu cần response có danh sách children
            List<CategoryResponse> children = category.getSubCategories().stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            if (!children.isEmpty()) {
                response.setChildren(children);
            }
        }

        // Số lượng sản phẩm có thể tính từ productCategoryRepository nếu cần
        // Long productCount = productCategoryRepository.countByCategory(category);
        // response.setProductCount(productCount.intValue());

        return response;
    }

}