package com.hoangduyminh.exercise201.service.impl;

import com.hoangduyminh.exercise201.dto.ProductDTO;
import com.hoangduyminh.exercise201.dto.request.ProductRequest;
import com.hoangduyminh.exercise201.dto.request.ServiceVariantRequest;
import com.hoangduyminh.exercise201.dto.request.ServiceAttributeRequest;
import com.hoangduyminh.exercise201.dto.response.ProductResponse;
import com.hoangduyminh.exercise201.entity.*;
import com.hoangduyminh.exercise201.exception.ResourceNotFoundException;
import com.hoangduyminh.exercise201.repository.*;
import com.hoangduyminh.exercise201.service.ProductService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.math.BigDecimal;
import java.util.Set;
import java.util.Map;
import java.util.LinkedHashMap;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final GalleryRepository galleryRepository;
    private final ProductTagRepository productTagRepository;
    private final TagRepository tagRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final CategoryRepository categoryRepository;
    private final VariantRepository variantRepository;
    private final AttributeRepository attributeRepository;
    private final ProductAttributeRepository productAttributeRepository;
    private final VariantOptionRepository variantOptionRepository;
    private final AttributeValueRepository attributeValueRepository;
    private final ProductAttributeValueRepository productAttributeValueRepository;

    public ProductServiceImpl(ProductRepository productRepository,
            GalleryRepository galleryRepository,
            ProductTagRepository productTagRepository,
            TagRepository tagRepository,
            ProductCategoryRepository productCategoryRepository,
            CategoryRepository categoryRepository,
            VariantRepository variantRepository,
            AttributeRepository attributeRepository,
            ProductAttributeRepository productAttributeRepository,
            VariantOptionRepository variantOptionRepository,
            AttributeValueRepository attributeValueRepository,
            ProductAttributeValueRepository productAttributeValueRepository) {
        this.productRepository = productRepository;
        this.galleryRepository = galleryRepository;
        this.productTagRepository = productTagRepository;
        this.tagRepository = tagRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.categoryRepository = categoryRepository;
        this.variantRepository = variantRepository;
        this.attributeRepository = attributeRepository;
        this.productAttributeRepository = productAttributeRepository;
        this.variantOptionRepository = variantOptionRepository;
        this.attributeValueRepository = attributeValueRepository;
        this.productAttributeValueRepository = productAttributeValueRepository;
    }

    /**
     * Chuyển đổi từ Entity sang DTO
     */
    private ProductDTO convertToDTO(Product product) {
        ProductDTO productDTO = new ProductDTO();
        BeanUtils.copyProperties(product, productDTO);
        return productDTO;
    }

    /**
     * Chuyển đổi từ DTO sang Entity
     */
    private Product convertToEntity(ProductDTO productDTO) {
        Product product = new Product();
        BeanUtils.copyProperties(productDTO, product);
        return product;
    }

    private ProductResponse convertToResponse(Product product) {
        if (product == null)
            return null;

        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getProductName());
        response.setDescription(product.getProductDescription());
        response.setSlug(product.getSlug());
        response.setRegularPrice(product.getComparePrice() != null ? product.getComparePrice().doubleValue() : null);
        response.setSalePrice(product.getSalePrice() != null ? product.getSalePrice().doubleValue() : null);
        response.setIsActive(product.getPublished());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());

        // Lấy thumbnail từ gallery
        Gallery thumbnail = galleryRepository.findByProductIdAndIsThumbnailTrue(product.getId());
        if (thumbnail != null) {
            response.setThumbnail(thumbnail.getImage());
        }

        // Lấy danh sách ảnh từ gallery (không bao gồm thumbnail)
        List<Gallery> galleries = galleryRepository.findByProduct(product);
        if (galleries != null && !galleries.isEmpty()) {
            List<String> images = galleries.stream()
                    .filter(g -> !g.getIsThumbnail())
                    .map(Gallery::getImage)
                    .collect(Collectors.toList());
            response.setImages(images);
        }

        // Map categories - sử dụng Set để loại bỏ trùng lặp
        if (product.getProductCategories() != null && !product.getProductCategories().isEmpty()) {
            Set<com.hoangduyminh.exercise201.dto.response.CategoryResponse> uniqueCategories = product
                    .getProductCategories().stream()
                    .map(pc -> {
                        Category c = pc.getCategory();
                        com.hoangduyminh.exercise201.dto.response.CategoryResponse cr = new com.hoangduyminh.exercise201.dto.response.CategoryResponse();
                        cr.setId(c.getId());
                        cr.setName(c.getCategoryName());
                        return cr;
                    })
                    .collect(Collectors.toSet());
            response.setCategories(new ArrayList<>(uniqueCategories));
        }

        // Map tags
        List<ProductTag> productTags = productTagRepository.findByProduct_Id(product.getId());
        if (productTags != null && !productTags.isEmpty()) {
            List<String> tagNames = productTags.stream()
                    .map(pt -> pt.getTag().getTagName())
                    .collect(Collectors.toList());
            response.setTagNames(tagNames);
        }

        // Map variants (các gói dịch vụ)
        List<VariantOption> variantOptions = variantOptionRepository.findByProductId(product.getId());
        if (variantOptions != null && !variantOptions.isEmpty()) {
            List<UUID> variantIds = new ArrayList<>();
            List<String> variantNames = new ArrayList<>();
            List<Double> variantPrices = new ArrayList<>();
            List<Integer> variantDurations = new ArrayList<>();

            for (VariantOption option : variantOptions) {
                variantIds.add(option.getId());
                variantNames.add(option.getTitle());
                variantPrices.add(option.getSale_price().doubleValue());
                variantDurations.add(option.getDuration());
            }

            response.setVariantIds(variantIds);
            response.setVariantNames(variantNames);
            response.setVariantPrices(variantPrices);
            response.setVariantDurations(variantDurations);
        }

        // Map attributes (thuộc tính dịch vụ) - sử dụng Map để loại bỏ trùng lặp
        List<ProductAttribute> productAttributes = productAttributeRepository.findByProduct(product);
        if (productAttributes != null && !productAttributes.isEmpty()) {
            Map<UUID, String> uniqueAttributeIds = new LinkedHashMap<>();
            Map<UUID, String> uniqueAttributeNames = new LinkedHashMap<>();
            Map<UUID, String> uniqueAttributeValues = new LinkedHashMap<>();

            for (ProductAttribute pa : productAttributes) {
                Attribute attr = pa.getAttribute();
                UUID attrId = attr.getId();

                // Chỉ thêm nếu chưa tồn tại
                if (!uniqueAttributeIds.containsKey(attrId)) {
                    uniqueAttributeIds.put(attrId, attrId.toString());
                    uniqueAttributeNames.put(attrId, attr.getAttributeName());

                    // Lấy giá trị của attribute
                    List<ProductAttributeValue> values = productAttributeValueRepository.findByProductAttribute(pa);
                    if (!values.isEmpty()) {
                        uniqueAttributeValues.put(attrId, values.get(0).getAttributeValue().getAttributeValue());
                    }
                }
            }

            response.setAttributeIds(new ArrayList<>(uniqueAttributeIds.keySet()));
            response.setAttributeNames(new ArrayList<>(uniqueAttributeNames.values()));
            response.setAttributeValues(new ArrayList<>(uniqueAttributeValues.values()));
        }

        return response;
    }

    @Override
    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = convertToEntity(productDTO);
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    @Override
    @Transactional
    public ProductDTO updateProduct(UUID id, ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ", "id", id));

        BeanUtils.copyProperties(productDTO, existingProduct, "id");
        Product updatedProduct = productRepository.save(existingProduct);
        return convertToDTO(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ", "id", id));

        // 1. Xóa các liên kết với Category
        productCategoryRepository.deleteByProduct(product);

        // 2. Xóa các ảnh trong gallery
        galleryRepository.deleteByProduct(product);

        // 3. Xóa các liên kết với Tag
        productTagRepository.deleteByProduct_Id(product.getId());

        // 4. Xóa các variant và variant options
        variantRepository.deleteByProduct(product);
        variantOptionRepository.deleteByProduct(product);

        // 5. Xóa các product attributes và values
        List<ProductAttribute> productAttributes = productAttributeRepository.findByProduct(product);
        for (ProductAttribute pa : productAttributes) {
            productAttributeValueRepository.deleteByProductAttribute(pa);
        }
        productAttributeRepository.deleteByProduct(product);

        // 7. Cuối cùng xóa product
        productRepository.delete(product);
    }

    @Override
    public ProductDTO getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ", "id", id));
        return convertToDTO(product);
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductResponse createProductFromRequest(ProductRequest request) {
        Product product = new Product();

        // Manual field mapping với kiểm tra null
        product.setProductName(request.getName() != null ? request.getName() : "Dịch vụ mới");

        // Đảm bảo product_description không bao giờ null
        if (request.getDescription() != null && !request.getDescription().isEmpty()) {
            product.setProductDescription(request.getDescription());
            product.setShortDescription(
                    request.getDescription().substring(0, Math.min(request.getDescription().length(), 165)));
        } else {
            product.setProductDescription("Chưa có mô tả chi tiết");
            product.setShortDescription("Chưa có mô tả ngắn");
        }

        if (request.getSlug() != null && !request.getSlug().isEmpty()) {
            product.setSlug(request.getSlug());
        } else {
            // Tạo slug từ tên dịch vụ + timestamp để đảm bảo unique
            String name = request.getName() != null ? request.getName() : "dich-vu-moi";
            String baseSlug = name.toLowerCase().replaceAll("[^a-z0-9\\-]", "-");
            product.setSlug(baseSlug + "-" + System.currentTimeMillis());
        }

        // Convert price từ Double sang BigDecimal
        if (request.getRegularPrice() != null) {
            product.setComparePrice(BigDecimal.valueOf(request.getRegularPrice()));
        } else {
            product.setComparePrice(BigDecimal.ZERO);
        }

        if (request.getSalePrice() != null) {
            product.setSalePrice(BigDecimal.valueOf(request.getSalePrice()));
        } else {
            product.setSalePrice(BigDecimal.ZERO);
        }

        // Thiết lập các giá trị mặc định cho các trường còn lại
        product.setPublished(request.getIsActive() != null ? request.getIsActive() : false);
        product.setProductType(Product.ProductType.variable); // Dịch vụ spa luôn là variable

        // Thiết lập thời gian
        Date now = new Date();
        product.setCreatedAt(now);
        product.setUpdatedAt(now);

        final Product savedProduct = productRepository.save(product);

        // Xử lý thumbnail trong gallery nếu có
        if (request.getThumbnail() != null) {
            Gallery thumbnail = new Gallery();
            thumbnail.setProduct(savedProduct);
            thumbnail.setImage(request.getThumbnail());
            thumbnail.setPlaceholder("");
            thumbnail.setIsThumbnail(true);
            galleryRepository.save(thumbnail);
        }

        // Xử lý gallery images nếu có
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            for (String imageUrl : request.getImages()) {
                Gallery gallery = new Gallery();
                gallery.setProduct(savedProduct);
                gallery.setImage(imageUrl);
                gallery.setPlaceholder("");
                gallery.setIsThumbnail(false);
                galleryRepository.save(gallery);
            }
        }

        // Xử lý variants
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (ServiceVariantRequest variantRequest : request.getVariants()) {
                // Tạo variant option cho mỗi loại dịch vụ
                VariantOption variantOption = new VariantOption();
                variantOption.setTitle(variantRequest.getName());
                variantOption.setProduct(savedProduct);
                variantOption.setSale_price(BigDecimal.valueOf(variantRequest.getPrice()));
                variantOption.setActive(true);
                variantOption.setDuration(variantRequest.getDuration());
                variantOption = variantOptionRepository.save(variantOption);

                // Tạo variant cho thời gian
                Variant variant = new Variant();
                variant.setProduct(savedProduct);
                variant.setVariantOption(variantOption);
                variant.setVariantOptionName(variantRequest.getDuration() + " phút");
                variantRepository.save(variant);
            }
        }

        // Xử lý attributes
        if (request.getAttributes() != null && !request.getAttributes().isEmpty()) {
            for (ServiceAttributeRequest attributeRequest : request.getAttributes()) {
                // Tìm hoặc tạo attribute
                Attribute attribute = attributeRepository.findByAttributeName(attributeRequest.getName());
                if (attribute == null) {
                    attribute = new Attribute();
                    attribute.setAttributeName(attributeRequest.getName());
                    attribute.setCreatedAt(new Date());
                    attribute.setUpdatedAt(new Date());
                    attribute = attributeRepository.save(attribute);
                    System.out.println("Saved attribute with ID: " + attribute.getId()); // Debug log
                }

                // Tìm hoặc tạo attribute value
                List<AttributeValue> existingValues = attributeValueRepository
                        .findByAttributeValueContainingIgnoreCase(attributeRequest.getValue());
                AttributeValue attributeValue;
                if (existingValues.isEmpty()) {
                    attributeValue = new AttributeValue();
                    attributeValue.setAttributeValue(attributeRequest.getValue());
                    attributeValue.setAttribute(attribute);
                    attributeValue = attributeValueRepository.save(attributeValue);
                } else {
                    attributeValue = existingValues.get(0);
                }

                // Liên kết attribute với sản phẩm
                ProductAttribute productAttribute = new ProductAttribute();
                productAttribute.setProduct(savedProduct);
                productAttribute.setAttribute(attribute);
                productAttributeRepository.save(productAttribute);

                // Liên kết giá trị với product attribute
                ProductAttributeValue productAttributeValue = new ProductAttributeValue();
                productAttributeValue.setProductAttribute(productAttribute);
                productAttributeValue.setAttributeValue(attributeValue);
                productAttributeValueRepository.save(productAttributeValue);
            }
        }

        // Xử lý categories
        List<ProductCategory> productCategories = new ArrayList<>();
        if (request.getCategoryIds() != null) {
            productCategories = processCategoryLinks(savedProduct, request.getCategoryIds());
        }

        // Xử lý tags
        if (request.getTagNames() != null && !request.getTagNames().isEmpty()) {
            processTagLinks(savedProduct, request.getTagNames());
        }

        // Tạo response với đầy đủ thông tin
        ProductResponse response = convertToResponse(savedProduct);

        // Xử lý categories trong response
        if (!productCategories.isEmpty()) {
            List<com.hoangduyminh.exercise201.dto.response.CategoryResponse> categoryResponses = productCategories
                    .stream()
                    .map(pc -> {
                        Category c = pc.getCategory();
                        com.hoangduyminh.exercise201.dto.response.CategoryResponse cr = new com.hoangduyminh.exercise201.dto.response.CategoryResponse();
                        cr.setId(c.getId());
                        cr.setName(c.getCategoryName());
                        return cr;
                    })
                    .collect(Collectors.toList());
            response.setCategories(categoryResponses);
        }

        // Thêm thumbnail và images vào response
        if (request.getThumbnail() != null) {
            response.setThumbnail(request.getThumbnail());
        }
        if (request.getImages() != null) {
            response.setImages(request.getImages());
        }

        return response;
    }

    private List<ProductCategory> processCategoryLinks(Product product, List<UUID> categoryIds) {
        List<ProductCategory> productCategories = new ArrayList<>();
        for (UUID categoryId : categoryIds) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
            ProductCategory pc = new ProductCategory();
            pc.setProduct(product);
            pc.setCategory(category);
            productCategories.add(productCategoryRepository.save(pc));
        }
        return productCategories;
    }

    private void processTagLinks(Product product, List<String> tagNames) {
        for (String tagName : tagNames) {
            Tag tag = tagRepository.findByTagName(tagName)
                    .orElseGet(() -> {
                        Tag newTag = new Tag();
                        newTag.setTagName(tagName);
                        newTag.setCreated_at(new Date());
                        newTag.setUpdated_at(new Date());
                        return tagRepository.save(newTag);
                    });

            if (!productTagRepository.existsByProduct_IdAndTag_Id(product.getId(), tag.getId())) {
                ProductTag productTag = new ProductTag();
                ProductTagId productTagId = new ProductTagId();
                productTagId.setProductId(product.getId());
                productTagId.setTagId(tag.getId());
                productTag.setProductTagId(productTagId);
                productTag.setProduct(product);
                productTag.setTag(tag);
                productTagRepository.save(productTag);
            }
        }
    }

    @Override
    @Transactional
    public ProductResponse updateProductFromRequest(UUID id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với id: " + id));

        // Cập nhật thông tin cơ bản
        if (request.getName() != null) {
            product.setProductName(request.getName());
        }
        if (request.getDescription() != null) {
            product.setProductDescription(request.getDescription());
            product.setShortDescription(
                    request.getDescription().substring(0, Math.min(request.getDescription().length(), 165)));
        }
        if (request.getSlug() != null) {
            product.setSlug(request.getSlug());
        }

        // Cập nhật giá và số lượng
        if (request.getRegularPrice() != null) {
            product.setComparePrice(BigDecimal.valueOf(request.getRegularPrice()));
        }
        if (request.getSalePrice() != null) {
            product.setSalePrice(BigDecimal.valueOf(request.getSalePrice()));
        }

        // Cập nhật trạng thái
        if (request.getIsActive() != null) {
            product.setPublished(request.getIsActive());
        }

        // Cập nhật thời gian
        product.setUpdatedAt(new Date());

        // Xử lý gallery images và thumbnail
        if (request.getThumbnail() != null || request.getImages() != null) {
            // Collection đã được khởi tạo ở Entity (new ArrayList<>())
            
            // Clear items (orphanRemoval = true sẽ xóa trong DB)
            product.getGalleries().clear();

            // Thêm thumbnail mới nếu có
            if (request.getThumbnail() != null) {
                Gallery thumbnail = new Gallery();
                thumbnail.setProduct(product);
                thumbnail.setImage(request.getThumbnail());
                thumbnail.setPlaceholder("");
                thumbnail.setIsThumbnail(true);
                product.getGalleries().add(thumbnail);
            }

            // Thêm gallery mới
            if (request.getImages() != null && !request.getImages().isEmpty()) {
                for (String imageUrl : request.getImages()) {
                    Gallery gallery = new Gallery();
                    gallery.setProduct(product);
                    gallery.setImage(imageUrl);
                    gallery.setPlaceholder("");
                    gallery.setIsThumbnail(false);
                    product.getGalleries().add(gallery);
                }
            }
        }

        // Cập nhật categories nếu có
        if (request.getCategoryIds() != null) {
            // Xóa các liên kết category cũ
            product.getProductCategories().clear();

            // Thêm các category mới
            List<ProductCategory> productCategories = request.getCategoryIds().stream()
                    .map(categoryId -> {
                        Category category = categoryRepository.findById(categoryId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                        "Không tìm thấy category với id: " + categoryId));
                        ProductCategory pc = new ProductCategory();
                        pc.setProduct(product);
                        pc.setCategory(category);
                        return pc;
                    })
                    .collect(Collectors.toList());
            product.getProductCategories().addAll(productCategories);
        }

        // Cập nhật variants nếu có
        if (request.getVariants() != null) {
            // Xóa các variant cũ
            variantRepository.deleteByProduct(product);
            variantOptionRepository.deleteByProduct(product);

            // Thêm các variant mới
            for (ServiceVariantRequest variantRequest : request.getVariants()) {
                // Tạo variant option cho mỗi loại dịch vụ
                VariantOption variantOption = new VariantOption();
                variantOption.setTitle(variantRequest.getName());
                variantOption.setProduct(product);
                variantOption.setSale_price(BigDecimal.valueOf(variantRequest.getPrice()));
                variantOption.setActive(true);
                variantOption.setDuration(variantRequest.getDuration());
                variantOption = variantOptionRepository.save(variantOption);

                // Tạo variant cho thời gian
                Variant variant = new Variant();
                variant.setProduct(product);
                variant.setVariantOption(variantOption);
                variant.setVariantOptionName(variantRequest.getDuration() + " phút");
                variantRepository.save(variant);
            }
        }

        // Cập nhật attributes nếu có
        if (request.getAttributes() != null) {
            // Xóa các product attribute cũ
            product.getProductAttributes().clear();

            // Thêm các attribute mới
            for (ServiceAttributeRequest attributeRequest : request.getAttributes()) {
                // Tìm hoặc tạo attribute
                Attribute attribute = attributeRepository.findByAttributeName(attributeRequest.getName());
                if (attribute == null) {
                    attribute = new Attribute();
                    attribute.setAttributeName(attributeRequest.getName());
                    attribute.setCreatedAt(new Date());
                    attribute.setUpdatedAt(new Date());
                    attribute = attributeRepository.save(attribute);
                    System.out.println("Saved attribute with ID: " + attribute.getId()); // Debug log
                }

                // Tìm hoặc tạo attribute value
                List<AttributeValue> existingValues = attributeValueRepository
                        .findByAttributeValueContainingIgnoreCase(attributeRequest.getValue());
                AttributeValue attributeValue;
                if (existingValues.isEmpty()) {
                    attributeValue = new AttributeValue();
                    attributeValue.setAttributeValue(attributeRequest.getValue());
                    attributeValue.setAttribute(attribute);
                    attributeValue = attributeValueRepository.save(attributeValue);
                } else {
                    attributeValue = existingValues.get(0);
                }

                // Liên kết attribute với sản phẩm
                ProductAttribute productAttribute = new ProductAttribute();
                productAttribute.setProduct(product);
                productAttribute.setAttribute(attribute);

                // Liên kết giá trị với product attribute
                ProductAttributeValue productAttributeValue = new ProductAttributeValue();
                productAttributeValue.setProductAttribute(productAttribute);
                productAttributeValue.setAttributeValue(attributeValue);
                
                // Loại bỏ thao tác setCollection(new ArrayList) gây lỗi orphanRemoval
                productAttribute.getProductAttributeValues().add(productAttributeValue);
                
                // Thêm vào collection của Product
                product.getProductAttributes().add(productAttribute);
            }
        }

        // Lưu sản phẩm
        final Product savedProduct = productRepository.save(product);

        // Tạo response với đầy đủ thông tin
        ProductResponse response = convertToResponse(savedProduct);

        // Cập nhật thông tin gallery trong response
        if (request.getThumbnail() != null) {
            response.setThumbnail(request.getThumbnail());
        }
        if (request.getImages() != null) {
            response.setImages(request.getImages());
        }

        return response;
    }

    @Override
    public ProductResponse getProductDetailById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ", "id", id));
        return convertToResponse(product);
    }

    @Override
    public List<ProductResponse> getAllProductDetails() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> searchProducts(String keyword) {
        List<Product> products = productRepository.searchProducts(keyword);
        return products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getProductsByCategory(UUID categoryId) {
        List<Product> products = productRepository.findByCategory(categoryId);
        return products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getProductsByTag(UUID tagId) {
        List<Product> products = productRepository.findByTag(tagId);
        return products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductResponse uploadImages(UUID id, List<String> imageUrls) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ", "id", id));

        for (String imageUrl : imageUrls) {
            Gallery gallery = new Gallery();
            gallery.setProduct(product);
            gallery.setImage(imageUrl);
            gallery.setPlaceholder("");
            gallery.setIsThumbnail(false);
            galleryRepository.save(gallery);
        }

        return convertToResponse(product);
    }

    @Override
    @Transactional
    public void deleteImage(UUID id, UUID imageId) {
        Gallery gallery = galleryRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Hình ảnh", "id", imageId));

        if (!gallery.getProduct().getId().equals(id)) {
            throw new IllegalArgumentException("Hình ảnh không thuộc về dịch vụ này");
        }

        galleryRepository.delete(gallery);
    }

    @Override
    @Transactional
    public ProductResponse updateStatus(UUID id, Boolean isActive) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ", "id", id));
        product.setPublished(isActive);
        product.setUpdatedAt(new Date());
        Product updatedProduct = productRepository.save(product);
        return convertToResponse(updatedProduct);
    }

}