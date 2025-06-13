package com.hoangduyminh.exercise201.service.impl;

import com.hoangduyminh.exercise201.dto.SlideshowDTO;
import com.hoangduyminh.exercise201.dto.request.SlideshowRequest;
import com.hoangduyminh.exercise201.dto.response.SlideshowResponse;
import com.hoangduyminh.exercise201.entity.Slideshow;
import com.hoangduyminh.exercise201.exception.BusinessException;
import com.hoangduyminh.exercise201.exception.ResourceNotFoundException;
import com.hoangduyminh.exercise201.repository.SlideshowRepository;
import com.hoangduyminh.exercise201.service.SlideshowService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation của SlideshowService để quản lý slideshow quảng cáo
 * Sử dụng Slideshow entity có sẵn, không thay đổi cấu trúc
 */
@Service
public class SlideshowServiceImpl implements SlideshowService {

    private final SlideshowRepository slideshowRepository;

    public SlideshowServiceImpl(SlideshowRepository slideshowRepository) {
        this.slideshowRepository = slideshowRepository;
    }

    @Override
    @Transactional
    public SlideshowDTO createSlideshow(SlideshowDTO slideshowDTO) {
        // Validate dates
        if (slideshowDTO.getStartDate().after(slideshowDTO.getEndDate())) {
            throw new BusinessException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        // Create new slideshow
        Slideshow slideshow = new Slideshow();
        slideshow.setId(UUID.randomUUID());
        updateSlideshowFromDTO(slideshow, slideshowDTO);

        // Set initial display order to last position
        List<Slideshow> allSlideshows = slideshowRepository.findAllByOrderByDisplayOrderAsc();
        int maxOrder = allSlideshows.isEmpty() ? 0 : allSlideshows.get(allSlideshows.size() - 1).getDisplayOrder();
        slideshow.setDisplayOrder(maxOrder + 1);

        Slideshow savedSlideshow = slideshowRepository.save(slideshow);
        return convertToDTO(savedSlideshow);
    }

    @Override
    @Transactional
    public SlideshowDTO updateSlideshow(UUID id, SlideshowDTO slideshowDTO) {
        Slideshow existingSlideshow = slideshowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Slideshow", "id", id));

        // Validate dates
        if (slideshowDTO.getStartDate().after(slideshowDTO.getEndDate())) {
            throw new BusinessException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        updateSlideshowFromDTO(existingSlideshow, slideshowDTO);
        Slideshow updatedSlideshow = slideshowRepository.save(existingSlideshow);
        return convertToDTO(updatedSlideshow);
    }

    @Override
    @Transactional
    public void deleteSlideshow(UUID id) {
        Slideshow slideshow = slideshowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Slideshow", "id", id));
        slideshowRepository.delete(slideshow);
    }

    @Override
    public SlideshowDTO getSlideshowById(UUID id) {
        Slideshow slideshow = slideshowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Slideshow", "id", id));
        return convertToDTO(slideshow);
    }

    @Override
    public List<SlideshowDTO> getAllSlideshows() {
        return slideshowRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SlideshowResponse createSlideshowFromRequest(SlideshowRequest request) {
        // Validate dates
        if (request.getStartDate().after(request.getEndDate())) {
            throw new BusinessException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        Slideshow slideshow = new Slideshow();
        slideshow.setId(UUID.randomUUID());
        updateSlideshowFromRequest(slideshow, request);

        // Set initial display order to last position
        List<Slideshow> allSlideshows = slideshowRepository.findAllByOrderByDisplayOrderAsc();
        int maxOrder = allSlideshows.isEmpty() ? 0 : allSlideshows.get(allSlideshows.size() - 1).getDisplayOrder();
        slideshow.setDisplayOrder(maxOrder + 1);

        Slideshow savedSlideshow = slideshowRepository.save(slideshow);
        return convertToResponse(savedSlideshow);
    }

    @Override
    public SlideshowResponse updateSlideshowFromRequest(UUID id, SlideshowRequest request) {
        Slideshow existingSlideshow = slideshowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Slideshow", "id", id));

        // Validate dates
        if (request.getStartDate().after(request.getEndDate())) {
            throw new BusinessException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        updateSlideshowFromRequest(existingSlideshow, request);
        Slideshow updatedSlideshow = slideshowRepository.save(existingSlideshow);
        return convertToResponse(updatedSlideshow);
    }

    @Override
    public SlideshowResponse getSlideshowDetailById(UUID id) {
        Slideshow slideshow = slideshowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Slideshow", "id", id));
        return convertToResponse(slideshow);
    }

    @Override
    public List<SlideshowResponse> getAllSlideshowDetails() {
        return slideshowRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SlideshowResponse> getActiveSlideshows() {
        return slideshowRepository.findActiveSlideshows().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SlideshowResponse updateStatus(UUID id, Boolean isActive) {
        Slideshow slideshow = slideshowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Slideshow", "id", id));
        slideshow.setPublished(isActive);
        slideshow.setUpdatedAt(new Date());
        Slideshow updatedSlideshow = slideshowRepository.save(slideshow);
        return convertToResponse(updatedSlideshow);
    }

    @Override
    @Transactional
    public SlideshowResponse updateDisplayOrder(UUID id, Integer order) {
        Slideshow slideshow = slideshowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Slideshow", "id", id));
        slideshow.setDisplayOrder(order);
        slideshow.setUpdatedAt(new Date());
        Slideshow updatedSlideshow = slideshowRepository.save(slideshow);
        return convertToResponse(updatedSlideshow);
    }

    @Override
    @Transactional
    public SlideshowResponse recordView(UUID id) {
        Slideshow slideshow = slideshowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Slideshow", "id", id));
        // TODO: Implement view count tracking
        return convertToResponse(slideshow);
    }

    @Override
    @Transactional
    public SlideshowResponse recordClick(UUID id) {
        Slideshow slideshow = slideshowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Slideshow", "id", id));
        slideshow.setClicks(slideshow.getClicks() + 1);
        slideshow.setUpdatedAt(new Date());
        Slideshow updatedSlideshow = slideshowRepository.save(slideshow);
        return convertToResponse(updatedSlideshow);
    }

    /**
     * Cập nhật thông tin Slideshow từ DTO
     * Chỉ cập nhật các trường được phép
     */
    private void updateSlideshowFromDTO(Slideshow slideshow, SlideshowDTO dto) {
        slideshow.setTitle(dto.getTitle());
        slideshow.setDescription(dto.getDescription());
        slideshow.setImage(dto.getImageUrl());
        slideshow.setDestinationUrl(dto.getLinkUrl());
        slideshow.setBtnLabel(dto.getButtonText());
        slideshow.setDisplayOrder(dto.getDisplayOrder());
        slideshow.setPublished(dto.getIsActive());
        slideshow.setUpdatedAt(new Date());
        if (slideshow.getCreatedAt() == null) {
            slideshow.setCreatedAt(new Date());
        }
        // TODO: Add placeholder field
        // TODO: Add other fields as needed
    }

    private void updateSlideshowFromRequest(Slideshow slideshow, SlideshowRequest request) {
        slideshow.setTitle(request.getTitle());
        slideshow.setDescription(request.getDescription());
        slideshow.setImage(request.getImageUrl());
        slideshow.setDestinationUrl(request.getLinkUrl());
        slideshow.setBtnLabel(request.getButtonText());
        slideshow.setDisplayOrder(request.getDisplayOrder());
        slideshow.setPublished(request.getIsActive());
        slideshow.setUpdatedAt(new Date());
        if (slideshow.getCreatedAt() == null) {
            slideshow.setCreatedAt(new Date());
        }
        // TODO: Set placeholder field
        // TODO: Add other fields as needed
    }

    /**
     * Convert Slideshow entity sang DTO
     */
    private SlideshowDTO convertToDTO(Slideshow slideshow) {
        if (slideshow == null)
            return null;

        SlideshowDTO dto = new SlideshowDTO();
        dto.setId(slideshow.getId());
        dto.setTitle(slideshow.getTitle());
        dto.setDescription(slideshow.getDescription());
        dto.setImageUrl(slideshow.getImage());
        dto.setLinkUrl(slideshow.getDestinationUrl());
        dto.setButtonText(slideshow.getBtnLabel());
        dto.setDisplayOrder(slideshow.getDisplayOrder());
        dto.setIsActive(slideshow.getPublished());
        dto.setCreatedAt(slideshow.getCreatedAt());
        dto.setUpdatedAt(slideshow.getUpdatedAt());
        // TODO: Add other fields as needed
        return dto;
    }

    private SlideshowResponse convertToResponse(Slideshow slideshow) {
        if (slideshow == null)
            return null;

        SlideshowResponse response = new SlideshowResponse();
        response.setId(slideshow.getId());
        response.setTitle(slideshow.getTitle());
        response.setDescription(slideshow.getDescription());
        response.setImageUrl(slideshow.getImage());
        response.setLinkUrl(slideshow.getDestinationUrl());
        response.setButtonText(slideshow.getBtnLabel());
        response.setDisplayOrder(slideshow.getDisplayOrder());
        response.setIsActive(slideshow.getPublished());
        response.setCreatedAt(slideshow.getCreatedAt());
        response.setUpdatedAt(slideshow.getUpdatedAt());
        response.setClickCount(slideshow.getClicks());
        // TODO: Add other fields as needed
        return response;
    }
}