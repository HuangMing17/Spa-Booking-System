package com.hoangduyminh.exercise201.service.impl;

import com.hoangduyminh.exercise201.dto.AttributeDTO;
import com.hoangduyminh.exercise201.dto.AttributeValueDTO;
import com.hoangduyminh.exercise201.dto.ProductDTO;
import com.hoangduyminh.exercise201.entity.Attribute;
import com.hoangduyminh.exercise201.entity.AttributeValue;
import com.hoangduyminh.exercise201.entity.Product;
import com.hoangduyminh.exercise201.entity.ProductAttribute;
import com.hoangduyminh.exercise201.exception.ResourceNotFoundException;
import com.hoangduyminh.exercise201.repository.*;
import com.hoangduyminh.exercise201.service.RoomService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RoomServiceImpl implements RoomService {

    private final AttributeRepository attributeRepository;
    private final AttributeValueRepository attributeValueRepository;
    private final ProductAttributeRepository productAttributeRepository;
    private final ProductRepository productRepository;

    public RoomServiceImpl(AttributeRepository attributeRepository,
            AttributeValueRepository attributeValueRepository,
            ProductAttributeRepository productAttributeRepository,
            ProductRepository productRepository) {
        this.attributeRepository = attributeRepository;
        this.attributeValueRepository = attributeValueRepository;
        this.productAttributeRepository = productAttributeRepository;
        this.productRepository = productRepository;
    }

    private AttributeDTO convertToDTO(Attribute attribute) {
        if (attribute == null)
            return null;
        AttributeDTO roomDTO = new AttributeDTO();
        BeanUtils.copyProperties(attribute, roomDTO);
        return roomDTO;
    }

    private Attribute convertToEntity(AttributeDTO roomDTO) {
        if (roomDTO == null)
            return null;
        Attribute room = new Attribute();
        BeanUtils.copyProperties(roomDTO, room);
        return room;
    }

    private AttributeValueDTO convertToValueDTO(AttributeValue value) {
        if (value == null)
            return null;
        AttributeValueDTO valueDTO = new AttributeValueDTO();
        BeanUtils.copyProperties(value, valueDTO);
        return valueDTO;
    }

    private AttributeValue convertToValueEntity(AttributeValueDTO valueDTO) {
        if (valueDTO == null)
            return null;
        AttributeValue value = new AttributeValue();
        BeanUtils.copyProperties(valueDTO, value);
        return value;
    }

    private ProductDTO convertToProductDTO(Product product) {
        if (product == null)
            return null;
        ProductDTO productDTO = new ProductDTO();
        BeanUtils.copyProperties(product, productDTO);
        return productDTO;
    }

    @Override
    @Transactional
    public AttributeDTO createRoom(AttributeDTO roomDTO) {
        // Kiểm tra tên trùng
        if (attributeRepository.existsByAttributeName(roomDTO.getName())) {
            throw new IllegalArgumentException("Tên phòng đã tồn tại");
        }

        Attribute room = convertToEntity(roomDTO);
        Attribute savedRoom = attributeRepository.save(room);
        return convertToDTO(savedRoom);
    }

    @Override
    @Transactional
    public AttributeDTO updateRoom(UUID id, AttributeDTO roomDTO) {
        Attribute existingRoom = attributeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phòng", "id", id));

        BeanUtils.copyProperties(roomDTO, existingRoom, "id");
        Attribute updatedRoom = attributeRepository.save(existingRoom);
        return convertToDTO(updatedRoom);
    }

    @Override
    @Transactional
    public void deleteRoom(UUID id) {
        if (!attributeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Phòng", "id", id);
        }

        if (!canDeleteRoom(id)) {
            throw new IllegalStateException("Không thể xóa phòng này vì đang được sử dụng");
        }

        attributeValueRepository.deleteByAttributeId(id);
        productAttributeRepository.deleteByAttributeId(id);
        attributeRepository.deleteById(id);
    }

    @Override
    public AttributeDTO getRoomById(UUID id) {
        Attribute room = attributeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phòng", "id", id));
        return convertToDTO(room);
    }

    @Override
    public List<AttributeDTO> getAllRooms() {
        return attributeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AttributeValueDTO addValueToRoom(UUID attributeId, AttributeValueDTO valueDTO) {
        Attribute room = attributeRepository.findById(attributeId)
                .orElseThrow(() -> new ResourceNotFoundException("Phòng", "id", attributeId));

        // Kiểm tra giá trị đã tồn tại
        if (attributeValueRepository.existsByAttributeIdAndAttributeValueIgnoreCase(attributeId, valueDTO.getValue())) {
            throw new IllegalStateException("Giá trị này đã tồn tại trong phòng");
        }

        AttributeValue value = convertToValueEntity(valueDTO);
        AttributeValue savedValue = attributeValueRepository.save(value);
        return convertToValueDTO(savedValue);
    }

    @Override
    @Transactional
    public AttributeValueDTO updateRoomValue(UUID valueId, AttributeValueDTO valueDTO) {
        AttributeValue existingValue = attributeValueRepository.findById(valueId)
                .orElseThrow(() -> new ResourceNotFoundException("Giá trị", "id", valueId));

        BeanUtils.copyProperties(valueDTO, existingValue, "id", "attributeId");
        AttributeValue updatedValue = attributeValueRepository.save(existingValue);
        return convertToValueDTO(updatedValue);
    }

    @Override
    @Transactional
    public void deleteRoomValue(UUID valueId) {
        if (!attributeValueRepository.existsById(valueId)) {
            throw new ResourceNotFoundException("Giá trị", "id", valueId);
        }

        attributeValueRepository.deleteById(valueId);
    }

    @Override
    public List<AttributeValueDTO> getValuesByRoom(UUID attributeId) {
        if (!attributeRepository.existsById(attributeId)) {
            throw new ResourceNotFoundException("Phòng", "id", attributeId);
        }

        return attributeValueRepository.findByAttributeId(attributeId).stream()
                .map(this::convertToValueDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AttributeValueDTO getValueById(UUID valueId) {
        AttributeValue value = attributeValueRepository.findById(valueId)
                .orElseThrow(() -> new ResourceNotFoundException("Giá trị", "id", valueId));
        return convertToValueDTO(value);
    }

    @Override
    public List<ProductDTO> getProductsByRoom(UUID attributeId) {
        return productAttributeRepository.findByAttributeId(attributeId).stream()
                .map(ProductAttribute::getProduct)
                .map(this::convertToProductDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void assignRoomToProduct(UUID attributeId, UUID productId, UUID valueId) {
        // Kiểm tra phòng tồn tại
        Attribute room = attributeRepository.findById(attributeId)
                .orElseThrow(() -> new ResourceNotFoundException("Phòng", "id", attributeId));

        // Kiểm tra sản phẩm tồn tại
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", productId));

        // Kiểm tra giá trị tồn tại
        AttributeValue value = attributeValueRepository.findById(valueId)
                .orElseThrow(() -> new ResourceNotFoundException("Giá trị", "id", valueId));

        // Kiểm tra đã phân bổ chưa
        if (productAttributeRepository.existsByProductIdAndAttributeId(productId, attributeId)) {
            throw new IllegalStateException("Sản phẩm đã được phân bổ vào phòng này");
        }

        ProductAttribute productAttribute = new ProductAttribute();
        productAttribute.setProduct(product);
        productAttribute.setAttribute(room);
        productAttributeRepository.save(productAttribute);
    }

    @Override
    @Transactional
    public void unassignRoomFromProduct(UUID attributeId, UUID productId) {
        productAttributeRepository.deleteByProductIdAndAttributeId(productId, attributeId);
    }

    @Override
    public boolean canDeleteRoom(UUID id) {
        return productAttributeRepository.countByAttributeId(id) == 0;
    }
}