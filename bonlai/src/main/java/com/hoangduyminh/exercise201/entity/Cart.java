package com.hoangduyminh.exercise201.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Entity class cho Cart
 */
@Data
@Entity
@Table(name = "carts")
@EqualsAndHashCode(callSuper = true)
public class Cart extends BaseEntity {

    @Column(name = "customer_id", nullable = false)
    private UUID customerId;

    @Column(length = 1000)
    private String note;

    @Column(nullable = false)
    private Double subtotal = 0.0;

    @Column(nullable = false)
    private Double discount = 0.0;

    @Column(nullable = false)
    private Double tax = 0.0;

    @Column(nullable = false)
    private Double total = 0.0;

    @Column(name = "total_items", nullable = false)
    private Integer totalItems = 0;

    @Column(name = "total_quantity", nullable = false)
    private Integer totalQuantity = 0;

    @Column(name = "appointment_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date appointmentDate;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();
}