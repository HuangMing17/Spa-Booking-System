package com.hoangduyminh.exercise201.service;

import com.hoangduyminh.exercise201.dto.AttributeDTO;
import com.hoangduyminh.exercise201.dto.AttributeValueDTO;
import com.hoangduyminh.exercise201.dto.ProductDTO;

import java.util.List;
import java.util.UUID;

public interface RoomService {
    /**
     * Tạo mới phòng spa
     * 
     * @param attributeDTO thông tin phòng cần tạo
     * @return phòng đã được tạo
     */
    AttributeDTO createRoom(AttributeDTO attributeDTO);

    /**
     * Cập nhật thông tin phòng
     * 
     * @param id           id phòng cần cập nhật
     * @param attributeDTO thông tin phòng mới
     * @return phòng đã được cập nhật
     */
    AttributeDTO updateRoom(UUID id, AttributeDTO attributeDTO);

    /**
     * Xóa một phòng
     * 
     * @param id id phòng cần xóa
     */
    void deleteRoom(UUID id);

    /**
     * Lấy thông tin chi tiết một phòng
     * 
     * @param id id phòng cần lấy thông tin
     * @return thông tin chi tiết phòng
     */
    AttributeDTO getRoomById(UUID id);

    /**
     * Lấy danh sách tất cả phòng
     * 
     * @return danh sách tất cả phòng
     */
    List<AttributeDTO> getAllRooms();

    /**
     * Thêm đặc điểm cho phòng
     * 
     * @param attributeId id phòng
     * @param valueDTO    thông tin đặc điểm cần thêm
     * @return đặc điểm đã được thêm
     */
    AttributeValueDTO addValueToRoom(UUID attributeId, AttributeValueDTO valueDTO);

    /**
     * Cập nhật đặc điểm của phòng
     * 
     * @param valueId  id đặc điểm cần cập nhật
     * @param valueDTO thông tin đặc điểm mới
     * @return đặc điểm đã được cập nhật
     */
    AttributeValueDTO updateRoomValue(UUID valueId, AttributeValueDTO valueDTO);

    /**
     * Xóa đặc điểm khỏi phòng
     * 
     * @param valueId id đặc điểm cần xóa
     */
    void deleteRoomValue(UUID valueId);

    /**
     * Lấy danh sách đặc điểm của một phòng
     * 
     * @param attributeId id phòng
     * @return danh sách đặc điểm của phòng
     */
    List<AttributeValueDTO> getValuesByRoom(UUID attributeId);

    /**
     * Lấy thông tin chi tiết một đặc điểm
     * 
     * @param valueId id đặc điểm cần lấy thông tin
     * @return thông tin chi tiết đặc điểm
     */
    AttributeValueDTO getValueById(UUID valueId);

    /**
     * Lấy danh sách sản phẩm theo phòng
     * 
     * @param attributeId id phòng
     * @return danh sách sản phẩm trong phòng
     */
    List<ProductDTO> getProductsByRoom(UUID attributeId);

    /**
     * Gán phòng cho sản phẩm
     * 
     * @param attributeId id phòng
     * @param productId   id sản phẩm
     * @param valueId     id đặc điểm phòng
     */
    void assignRoomToProduct(UUID attributeId, UUID productId, UUID valueId);

    /**
     * Hủy gán phòng cho sản phẩm
     * 
     * @param attributeId id phòng
     * @param productId   id sản phẩm
     */
    void unassignRoomFromProduct(UUID attributeId, UUID productId);

    /**
     * Kiểm tra phòng có thể xóa không
     * 
     * @param id id phòng cần kiểm tra
     * @return true nếu có thể xóa, false nếu không
     */
    boolean canDeleteRoom(UUID id);
}