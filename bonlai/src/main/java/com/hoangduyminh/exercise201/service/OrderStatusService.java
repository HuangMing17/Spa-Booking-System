package com.hoangduyminh.exercise201.service;

import com.hoangduyminh.exercise201.dto.OrderStatusDTO;
import java.util.List;
import java.util.UUID;

public interface OrderStatusService {
    /**
     * Tạo mới trạng thái đơn hàng
     * 
     * @param statusDTO thông tin trạng thái
     * @return trạng thái đã được tạo
     */
    OrderStatusDTO createStatus(OrderStatusDTO statusDTO);

    /**
     * Cập nhật thông tin trạng thái
     * 
     * @param id        id trạng thái
     * @param statusDTO thông tin mới
     * @return trạng thái đã được cập nhật
     */
    OrderStatusDTO updateStatus(UUID id, OrderStatusDTO statusDTO);

    /**
     * Xóa trạng thái
     * 
     * @param id id trạng thái cần xóa
     */
    void deleteStatus(UUID id);

    /**
     * Lấy thông tin chi tiết trạng thái
     * 
     * @param id id trạng thái
     * @return thông tin chi tiết trạng thái
     */
    OrderStatusDTO getStatusById(UUID id);

    /**
     * Lấy danh sách tất cả trạng thái
     * 
     * @return danh sách trạng thái
     */
    List<OrderStatusDTO> getAllStatuses();

    /**
     * Lấy danh sách trạng thái đang hoạt động
     * 
     * @return danh sách trạng thái active
     */
    List<OrderStatusDTO> getActiveStatuses();

    /**
     * Tìm kiếm trạng thái
     * 
     * @param keyword từ khóa tìm kiếm
     * @return danh sách trạng thái phù hợp
     */
    List<OrderStatusDTO> searchStatuses(String keyword);

    /**
     * Lấy trạng thái tiếp theo có thể chuyển đến
     * 
     * @param currentStatusId id trạng thái hiện tại
     * @return danh sách trạng thái tiếp theo
     */
    List<OrderStatusDTO> getNextPossibleStatuses(UUID currentStatusId);

    /**
     * Kiểm tra trạng thái có thể xóa không
     * 
     * @param id id trạng thái cần kiểm tra
     * @return true nếu có thể xóa
     */
    boolean canDeleteStatus(UUID id);
}