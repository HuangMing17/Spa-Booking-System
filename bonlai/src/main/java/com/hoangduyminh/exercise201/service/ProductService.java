package com.hoangduyminh.exercise201.service;

import com.hoangduyminh.exercise201.dto.ProductDTO;
import com.hoangduyminh.exercise201.dto.request.ProductRequest;
import com.hoangduyminh.exercise201.dto.response.ProductResponse;
import java.util.List;
import java.util.UUID;

/**
 * Service interface để quản lý sản phẩm
 */
public interface ProductService {

    /**
     * Method cũ - Giữ nguyên
     */
    ProductDTO createProduct(ProductDTO productDTO);

    ProductDTO updateProduct(UUID id, ProductDTO productDTO);

    void deleteProduct(UUID id);

    ProductDTO getProductById(UUID id);

    List<ProductDTO> getAllProducts();

    /**
     * Method mới thêm vào - Sử dụng Request/Response DTOs
     */

    /**
     * Tạo mới sản phẩm từ request
     * 
     * @param request thông tin sản phẩm
     * @return thông tin chi tiết sản phẩm đã tạo
     */
    ProductResponse createProductFromRequest(ProductRequest request);

    /**
     * Cập nhật sản phẩm từ request
     * 
     * @param id      id sản phẩm
     * @param request thông tin cập nhật
     * @return thông tin chi tiết sau khi cập nhật
     */
    ProductResponse updateProductFromRequest(UUID id, ProductRequest request);

    /**
     * Lấy thông tin chi tiết sản phẩm
     * 
     * @param id id sản phẩm
     * @return thông tin chi tiết sản phẩm
     */
    ProductResponse getProductDetailById(UUID id);

    /**
     * Lấy danh sách tất cả sản phẩm với thông tin chi tiết
     * 
     * @return danh sách sản phẩm
     */
    List<ProductResponse> getAllProductDetails();

    /**
     * Tìm kiếm sản phẩm theo từ khóa
     * 
     * @param keyword từ khóa tìm kiếm (tên, mô tả)
     * @return danh sách sản phẩm phù hợp
     */
    List<ProductResponse> searchProducts(String keyword);

    /**
     * Lọc sản phẩm theo danh mục
     * 
     * @param categoryId id danh mục
     * @return danh sách sản phẩm thuộc danh mục
     */
    List<ProductResponse> getProductsByCategory(UUID categoryId);

    /**
     * Lọc sản phẩm theo tag
     * 
     * @param tagId id tag
     * @return danh sách sản phẩm có tag
     */
    List<ProductResponse> getProductsByTag(UUID tagId);

    /**
     * Upload ảnh cho sản phẩm
     * 
     * @param id        id sản phẩm
     * @param imageUrls danh sách URL ảnh
     * @return thông tin chi tiết sau khi upload
     */
    ProductResponse uploadImages(UUID id, List<String> imageUrls);

    /**
     * Xóa ảnh của sản phẩm
     * 
     * @param id      id sản phẩm
     * @param imageId id ảnh cần xóa
     */
    void deleteImage(UUID id, UUID imageId);

    /**
     * Cập nhật trạng thái active/inactive
     * 
     * @param id       id sản phẩm
     * @param isActive trạng thái mới
     * @return thông tin chi tiết sau khi cập nhật
     */
    ProductResponse updateStatus(UUID id, Boolean isActive);
}