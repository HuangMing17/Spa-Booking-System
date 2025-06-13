package com.hoangduyminh.exercise201.service.impl;

import com.hoangduyminh.exercise201.constant.OrderStatusConstant;
import com.hoangduyminh.exercise201.dto.OrderStatusDTO;
import com.hoangduyminh.exercise201.entity.OrderStatus;
import com.hoangduyminh.exercise201.exception.BusinessException;
import com.hoangduyminh.exercise201.exception.ResourceNotFoundException;
import com.hoangduyminh.exercise201.repository.OrderRepository;
import com.hoangduyminh.exercise201.repository.OrderStatusRepository;
import com.hoangduyminh.exercise201.service.OrderStatusService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderStatusServiceImpl implements OrderStatusService {

    private final OrderStatusRepository orderStatusRepository;
    private final OrderRepository orderRepository;

    public OrderStatusServiceImpl(OrderStatusRepository orderStatusRepository,
            OrderRepository orderRepository) {
        this.orderStatusRepository = orderStatusRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional
    public OrderStatusDTO createStatus(OrderStatusDTO statusDTO) {
        // Kiểm tra code trùng
        if (orderStatusRepository.existsByStatusName(statusDTO.getCode())) {
            throw new BusinessException("Mã trạng thái đã tồn tại");
        }

        OrderStatus status = new OrderStatus();
        status.setId(UUID.randomUUID());

        OrderStatus savedStatus = orderStatusRepository.save(status);
        return toDTO(savedStatus);
    }

    @Override
    @Transactional
    public OrderStatusDTO updateStatus(UUID id, OrderStatusDTO statusDTO) {
        OrderStatus existingStatus = orderStatusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trạng thái", "id", id));

        // Không cho phép thay đổi trạng thái mặc định
        if (isDefaultStatus(existingStatus.toString())) {
            throw new BusinessException("Không thể thay đổi trạng thái mặc định");
        }

        OrderStatus updatedStatus = orderStatusRepository.save(existingStatus);
        return toDTO(updatedStatus);
    }

    @Override
    @Transactional
    public void deleteStatus(UUID id) {
        OrderStatus status = orderStatusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trạng thái", "id", id));

        // Không cho phép xóa trạng thái mặc định
        if (isDefaultStatus(status.toString())) {
            throw new BusinessException("Không thể xóa trạng thái mặc định");
        }

        if (!canDeleteStatus(id)) {
            throw new BusinessException("Không thể xóa trạng thái đang được sử dụng");
        }

        orderStatusRepository.delete(status);
    }

    @Override
    public OrderStatusDTO getStatusById(UUID id) {
        OrderStatus status = orderStatusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trạng thái", "id", id));
        return toDTO(status);
    }

    @Override
    public List<OrderStatusDTO> getAllStatuses() {
        return orderStatusRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderStatusDTO> getActiveStatuses() {
        return orderStatusRepository.findByStatusNameIn(Arrays.asList(OrderStatusConstant.FINAL_STATUSES)).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderStatusDTO> searchStatuses(String keyword) {
        return orderStatusRepository.findByStatusNameContainingIgnoreCase(keyword).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderStatusDTO> getNextPossibleStatuses(UUID currentStatusId) {
        OrderStatus currentStatus = orderStatusRepository.findById(currentStatusId)
                .orElseThrow(() -> new ResourceNotFoundException("Trạng thái", "id", currentStatusId));

        String statusCode = currentStatus.toString();
        int currentIndex = Arrays.asList(OrderStatusConstant.STATUS_ORDER).indexOf(statusCode);

        if (currentIndex < 0) {
            throw new BusinessException("Trạng thái không hợp lệ");
        }

        return Arrays.stream(OrderStatusConstant.STATUS_ORDER)
                .skip(currentIndex + 1) // Bỏ qua các trạng thái trước
                .map(code -> orderStatusRepository.findByStatusName(code))
                .filter(optional -> optional.isPresent())
                .map(optional -> optional.get())
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean canDeleteStatus(UUID id) {
        return orderRepository.countByOrderStatus_Id(id) == 0;
    }

    private OrderStatusDTO toDTO(OrderStatus status) {
        if (status == null)
            return null;

        OrderStatusDTO dto = new OrderStatusDTO();
        dto.setId(status.getId());
        dto.setCode(status.getStatusName());
        dto.setName(status.getStatusName());
        dto.setColor(status.getColor());

        // Thêm thống kê
        dto.setOrderCount(orderRepository.countByOrderStatus_Id(status.getId()));

        return dto;
    }

    private boolean isDefaultStatus(String statusCode) {
        return statusCode.equals(OrderStatusConstant.PENDING) ||
                statusCode.equals(OrderStatusConstant.COMPLETED) ||
                statusCode.equals(OrderStatusConstant.CANCELLED);
    }
}