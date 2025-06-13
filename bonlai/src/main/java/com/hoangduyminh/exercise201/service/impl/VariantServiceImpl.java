package com.hoangduyminh.exercise201.service.impl;

import com.hoangduyminh.exercise201.dto.VariantDTO;
import com.hoangduyminh.exercise201.dto.VariantOptionDTO;
import com.hoangduyminh.exercise201.entity.Variant;
import com.hoangduyminh.exercise201.entity.VariantOption;
import com.hoangduyminh.exercise201.exception.ResourceNotFoundException;
import com.hoangduyminh.exercise201.repository.VariantOptionRepository;
import com.hoangduyminh.exercise201.repository.VariantRepository;
import com.hoangduyminh.exercise201.repository.VariantValueRepository;
import com.hoangduyminh.exercise201.service.VariantService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class VariantServiceImpl implements VariantService {

    private final VariantRepository variantRepository;
    private final VariantOptionRepository variantOptionRepository;
    private final VariantValueRepository variantValueRepository;

    public VariantServiceImpl(VariantRepository variantRepository,
            VariantOptionRepository variantOptionRepository,
            VariantValueRepository variantValueRepository) {
        this.variantRepository = variantRepository;
        this.variantOptionRepository = variantOptionRepository;
        this.variantValueRepository = variantValueRepository;
    }

    private VariantDTO convertToDTO(Variant variant) {
        if (variant == null)
            return null;
        VariantDTO variantDTO = new VariantDTO();
        BeanUtils.copyProperties(variant, variantDTO);
        return variantDTO;
    }

    private Variant convertToEntity(VariantDTO variantDTO) {
        if (variantDTO == null)
            return null;
        Variant variant = new Variant();
        BeanUtils.copyProperties(variantDTO, variant);
        return variant;
    }

    private VariantOptionDTO convertToOptionDTO(VariantOption option) {
        if (option == null)
            return null;
        VariantOptionDTO optionDTO = new VariantOptionDTO();
        BeanUtils.copyProperties(option, optionDTO);
        return optionDTO;
    }

    private VariantOption convertToOptionEntity(VariantOptionDTO optionDTO) {
        if (optionDTO == null)
            return null;
        VariantOption option = new VariantOption();
        BeanUtils.copyProperties(optionDTO, option);
        return option;
    }

    @Override
    @Transactional
    public VariantDTO createVariant(VariantDTO variantDTO) {
        Variant variant = convertToEntity(variantDTO);
        Variant savedVariant = variantRepository.save(variant);
        return convertToDTO(savedVariant);
    }

    @Override
    @Transactional
    public VariantDTO updateVariant(UUID id, VariantDTO variantDTO) {
        Variant existingVariant = variantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khung giờ", "id", id));

        BeanUtils.copyProperties(variantDTO, existingVariant, "id");
        Variant updatedVariant = variantRepository.save(existingVariant);
        return convertToDTO(updatedVariant);
    }

    @Override
    @Transactional
    public void deleteVariant(UUID id) {
        if (!variantRepository.existsById(id)) {
            throw new ResourceNotFoundException("Khung giờ", "id", id);
        }

        if (!canDeleteVariant(id)) {
            throw new IllegalStateException("Không thể xóa khung giờ này vì đang được sử dụng");
        }

        variantOptionRepository.deleteByVariantsId(id);
        variantRepository.deleteById(id);
    }

    @Override
    public VariantDTO getVariantById(UUID id) {
        Variant variant = variantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khung giờ", "id", id));
        return convertToDTO(variant);
    }

    @Override
    public List<VariantDTO> getAllVariants() {
        return variantRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VariantDTO> getActiveVariants() {
        return variantRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public VariantOptionDTO addOptionToVariant(UUID variantId, VariantOptionDTO optionDTO) {
        Variant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Khung giờ", "id", variantId));

        // Kiểm tra thời gian đã tồn tại
        if (variantOptionRepository.existsByVariantsIdAndTitleIgnoreCase(variantId, optionDTO.getTitle())) {
            throw new IllegalStateException("Thời gian này đã tồn tại trong khung giờ");
        }

        VariantOption option = convertToOptionEntity(optionDTO);
        VariantOption savedOption = variantOptionRepository.save(option);
        optionDTO.setId(savedOption.getId());
        return optionDTO;
    }

    @Override
    @Transactional
    public VariantOptionDTO updateVariantOption(UUID optionId, VariantOptionDTO optionDTO) {
        VariantOption existingOption = variantOptionRepository.findById(optionId)
                .orElseThrow(() -> new ResourceNotFoundException("Thời gian", "id", optionId));

        BeanUtils.copyProperties(optionDTO, existingOption, "id");
        VariantOption updatedOption = variantOptionRepository.save(existingOption);
        return convertToOptionDTO(updatedOption);
    }

    @Override
    @Transactional
    public void deleteVariantOption(UUID optionId) {
        if (!variantOptionRepository.existsById(optionId)) {
            throw new ResourceNotFoundException("Thời gian", "id", optionId);
        }

        // Kiểm tra có đang được sử dụng không
        if (variantValueRepository.countByVariant_VariantOption_Id(optionId) > 0) {
            throw new IllegalStateException("Không thể xóa thời gian này vì đang được sử dụng");
        }

        variantOptionRepository.deleteById(optionId);
    }

    @Override
    public List<VariantOptionDTO> getOptionsByVariant(UUID variantId) {
        if (!variantRepository.existsById(variantId)) {
            throw new ResourceNotFoundException("Khung giờ", "id", variantId);
        }

        return variantOptionRepository.findByVariantsId(variantId).stream()
                .map(this::convertToOptionDTO)
                .collect(Collectors.toList());
    }

    @Override
    public VariantOptionDTO getOptionById(UUID optionId) {
        VariantOption option = variantOptionRepository.findById(optionId)
                .orElseThrow(() -> new ResourceNotFoundException("Thời gian", "id", optionId));
        return convertToOptionDTO(option);
    }

    @Override
    public boolean canDeleteVariant(UUID id) {
        // Kiểm tra có đang được sử dụng không
        return variantValueRepository.countByVariant_Id(id) == 0;
    }
}