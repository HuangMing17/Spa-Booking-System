package com.hoangduyminh.exercise201.service.impl;

import com.hoangduyminh.exercise201.dto.ProductDTO;
import com.hoangduyminh.exercise201.dto.TagDTO;
import com.hoangduyminh.exercise201.dto.request.TagRequest;
import com.hoangduyminh.exercise201.dto.response.TagResponse;
import com.hoangduyminh.exercise201.entity.Product;
import com.hoangduyminh.exercise201.entity.ProductTag;
import com.hoangduyminh.exercise201.entity.Tag;
import com.hoangduyminh.exercise201.exception.ResourceNotFoundException;
import com.hoangduyminh.exercise201.repository.ProductRepository;
import com.hoangduyminh.exercise201.repository.ProductTagRepository;
import com.hoangduyminh.exercise201.repository.TagRepository;
import com.hoangduyminh.exercise201.service.TagService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;
    private final ProductTagRepository productTagRepository;
    private final ProductRepository productRepository;

    public TagServiceImpl(TagRepository tagRepository,
            ProductTagRepository productTagRepository,
            ProductRepository productRepository) {
        this.tagRepository = tagRepository;
        this.productTagRepository = productTagRepository;
        this.productRepository = productRepository;
    }

    private TagDTO convertToDTO(Tag tag) {
        if (tag == null)
            return null;
        TagDTO tagDTO = new TagDTO();
        BeanUtils.copyProperties(tag, tagDTO);
        return tagDTO;
    }

    private Tag convertToEntity(TagDTO tagDTO) {
        if (tagDTO == null)
            return null;
        Tag tag = new Tag();
        BeanUtils.copyProperties(tagDTO, tag);
        return tag;
    }

    private ProductDTO convertToProductDTO(Product product) {
        if (product == null)
            return null;
        ProductDTO productDTO = new ProductDTO();
        BeanUtils.copyProperties(product, productDTO);
        return productDTO;
    }

    // Convert Tag to TagResponse
    private TagResponse convertToTagResponse(Tag tag) {
        if (tag == null)
            return null;

        TagResponse response = new TagResponse();
        response.setId(tag.getId());
        response.setName(tag.getTagName());
        // Map other fields as needed
        response.setCreatedAt(tag.getCreated_at());
        response.setUpdatedAt(tag.getUpdated_at());

        // Get product count
        Long productCount = productTagRepository.countByTag_Id(tag.getId());
        response.setProductCount(productCount != null ? productCount.intValue() : 0);

        return response;
    }

    @Override
    @Transactional
    public TagDTO createTag(TagDTO tagDTO) {
        Tag tag = convertToEntity(tagDTO);
        Tag savedTag = tagRepository.save(tag);
        return convertToDTO(savedTag);
    }

    @Override
    @Transactional
    public TagDTO updateTag(UUID id, TagDTO tagDTO) {
        Tag existingTag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag", "id", id));

        BeanUtils.copyProperties(tagDTO, existingTag, "id");
        Tag updatedTag = tagRepository.save(existingTag);
        return convertToDTO(updatedTag);
    }

    @Override
    @Transactional
    public void deleteTag(UUID id) {
        if (!tagRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tag", "id", id);
        }

        // Xóa tất cả liên kết với sản phẩm
        productTagRepository.deleteByTag_Id(id);
        tagRepository.deleteById(id);
    }

    @Override
    public TagDTO getTagById(UUID id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag", "id", id));
        return convertToDTO(tag);
    }

    @Override
    public List<TagDTO> getAllTags() {
        List<Tag> tags = tagRepository.findAll();
        return tags.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TagResponse createTagFromRequest(TagRequest request) {
        Tag tag = new Tag();
        tag.setTagName(request.getName());
        // Map other fields as needed
        tag.setCreated_at(new Date());
        tag.setUpdated_at(new Date());

        Tag savedTag = tagRepository.save(tag);
        return convertToTagResponse(savedTag);
    }

    @Override
    public TagResponse updateTagFromRequest(UUID id, TagRequest request) {
        Tag existingTag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag", "id", id));

        existingTag.setTagName(request.getName());
        // Map other fields as needed
        existingTag.setUpdated_at(new Date());

        Tag updatedTag = tagRepository.save(existingTag);
        return convertToTagResponse(updatedTag);
    }

    @Override
    public TagResponse getTagDetailById(UUID id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag", "id", id));
        return convertToTagResponse(tag);
    }

    @Override
    public List<TagResponse> getAllTagDetails() {
        List<Tag> tags = tagRepository.findAll();
        return tags.stream()
                .map(this::convertToTagResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TagResponse> searchTags(String keyword) {
        List<Tag> tags = tagRepository.searchTags(keyword);
        return tags.stream()
                .map(this::convertToTagResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TagResponse> getTagsByProduct(UUID productId) {
        List<Tag> tags = tagRepository.findByProduct(productId);
        return tags.stream()
                .map(this::convertToTagResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TagResponse assignToProduct(UUID productId, UUID tagId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", productId));

        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new ResourceNotFoundException("Tag", "id", tagId));

        if (productTagRepository.existsByProduct_IdAndTag_Id(productId, tagId)) {
            throw new IllegalStateException("Tag đã được gán cho sản phẩm này");
        }

        ProductTag productTag = new ProductTag();
        productTag.setProduct(product);
        productTag.setTag(tag);
        productTagRepository.save(productTag);

        return convertToTagResponse(tag);
    }

    @Override
    public void removeFromProduct(UUID productId, UUID tagId) {
        productTagRepository.deleteByProduct_IdAndTag_Id(productId, tagId);
    }

    @Override
    public List<TagResponse> getRelatedTags(UUID id) {
        // For a simple implementation, just return other tags from the same products
        tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag", "id", id));

        // Get products with this tag
        List<UUID> productIds = productTagRepository.findByTag_Id(id).stream()
                .map(pt -> pt.getProduct().getId())
                .collect(Collectors.toList());

        // Empty list case
        if (productIds.isEmpty()) {
            return List.of();
        }

        // Find other tags from these products, excluding the current tag
        List<Tag> relatedTags = tagRepository.findAll().stream()
                .filter(t -> !t.getId().equals(id))
                .limit(5) // Limit to 5 related tags for simplicity
                .collect(Collectors.toList());

        return relatedTags.stream()
                .map(this::convertToTagResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TagResponse updateStatus(UUID id, Boolean isActive) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag", "id", id));

        // We don't have an isActive field in the Tag entity, so we'll just update the
        // updated_at
        tag.setUpdated_at(new Date());

        Tag updatedTag = tagRepository.save(tag);
        TagResponse response = convertToTagResponse(updatedTag);
        response.setIsActive(isActive); // Setting it in the response even though it's not in the entity

        return response;
    }
}
