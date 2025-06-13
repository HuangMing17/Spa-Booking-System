package com.hoangduyminh.exercise201.service.impl;

import com.hoangduyminh.exercise201.dto.ProductReviewDTO;
import com.hoangduyminh.exercise201.entity.Customer;
import com.hoangduyminh.exercise201.entity.Order;
import com.hoangduyminh.exercise201.entity.OrderItem;
import com.hoangduyminh.exercise201.entity.Product;
import com.hoangduyminh.exercise201.entity.ProductReview;
import com.hoangduyminh.exercise201.exception.BusinessException;
import com.hoangduyminh.exercise201.exception.ResourceNotFoundException;
import com.hoangduyminh.exercise201.repository.CustomerRepository;
import com.hoangduyminh.exercise201.repository.OrderItemRepository;
import com.hoangduyminh.exercise201.repository.ProductRepository;
import com.hoangduyminh.exercise201.repository.ProductReviewRepository;
import com.hoangduyminh.exercise201.service.ProductReviewService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductReviewServiceImpl implements ProductReviewService {
    private final ProductReviewRepository productReviewRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final OrderItemRepository orderItemRepository;

    public ProductReviewServiceImpl(ProductReviewRepository productReviewRepository,
            ProductRepository productRepository,
            CustomerRepository customerRepository,
            OrderItemRepository orderItemRepository) {
        this.productReviewRepository = productReviewRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Override
    @Transactional
    public ProductReviewDTO createReview(ProductReviewDTO reviewDTO) {
        // Validate: chỉ khách đã mua mới được review
        boolean hasPurchased = orderItemRepository.existsByProduct_IdAndOrder_Customer_Id(
                reviewDTO.getProductId(), reviewDTO.getCustomerId());
        if (!hasPurchased) {
            throw new BusinessException("Bạn chỉ có thể đánh giá sản phẩm đã mua.");
        }
        // Validate: mỗi khách chỉ review 1 lần/1 sản phẩm
        if (productReviewRepository.existsByProduct_IdAndCustomer_Id(reviewDTO.getProductId(),
                reviewDTO.getCustomerId())) {
            throw new BusinessException("Bạn đã đánh giá sản phẩm này rồi.");
        }
        Product product = productRepository.findById(reviewDTO.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", reviewDTO.getProductId()));
        Customer customer = customerRepository.findById(reviewDTO.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", reviewDTO.getCustomerId()));
        ProductReview review = new ProductReview();
        review.setProduct(product);
        review.setCustomer(customer);
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        ProductReview saved = productReviewRepository.save(review);
        return toDTO(saved);
    }

    @Override
    @Transactional
    public ProductReviewDTO updateReview(UUID reviewId, ProductReviewDTO reviewDTO) {
        ProductReview review = productReviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Đánh giá", "id", reviewId));
        // Optional: chỉ chủ review mới được sửa
        if (!review.getCustomer().getId().equals(reviewDTO.getCustomerId())) {
            throw new BusinessException("Bạn không có quyền sửa đánh giá này.");
        }
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        ProductReview saved = productReviewRepository.save(review);
        return toDTO(saved);
    }

    @Override
    @Transactional
    public void deleteReview(UUID reviewId) {
        ProductReview review = productReviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Đánh giá", "id", reviewId));
        productReviewRepository.delete(review);
    }

    @Override
    public List<ProductReviewDTO> getReviewsByProduct(UUID productId) {
        return productReviewRepository.findByProduct_Id(productId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductReviewDTO> getReviewsByCustomer(UUID customerId) {
        return productReviewRepository.findByCustomer_Id(customerId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductReviewDTO getReviewByProductAndCustomer(UUID productId, UUID customerId) {
        return productReviewRepository.findByProduct_IdAndCustomer_Id(productId, customerId)
                .map(this::toDTO)
                .orElse(null);
    }

    private ProductReviewDTO toDTO(ProductReview review) {
        ProductReviewDTO dto = new ProductReviewDTO();
        dto.setId(review.getId());
        dto.setProductId(review.getProduct().getId());
        dto.setCustomerId(review.getCustomer().getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setUpdatedAt(review.getUpdatedAt());
        dto.setCustomerName(review.getCustomer().getFirst_name() + " " + review.getCustomer().getLast_name());
        return dto;
    }
}