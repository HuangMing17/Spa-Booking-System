package com.hoangduyminh.exercise201.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Entity class cho CartItem
 */
@Data
@Entity
@Table(name = "cart_items")
@EqualsAndHashCode(callSuper = true)
public class CartItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @Column(name = "product_id", nullable = false)
    private UUID productId;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false)
    private Double unitPrice;

    @Column(nullable = false)
    private Double subtotal = 0.0;

    @Column(nullable = false)
    private Double discount = 0.0;

    @Column(nullable = false)
    private Double total = 0.0;

    @Column(length = 1000)
    private String note;

    @Column(name = "appointment_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date appointmentDate;

    @Column(name = "duration")
    private Integer duration; // Thời lượng dịch vụ (phút)

    @ElementCollection
    @CollectionTable(name = "cart_item_variants", joinColumns = @JoinColumn(name = "cart_item_id"))
    @Column(name = "variant_value_id")
    private List<UUID> variantValueIds = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "cart_item_attributes", joinColumns = @JoinColumn(name = "cart_item_id"))
    @Column(name = "attribute_value_id")
    private List<UUID> attributeValueIds = new ArrayList<>();
}