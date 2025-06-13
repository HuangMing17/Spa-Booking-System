package com.hoangduyminh.exercise201.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String first_name;

    @Column(nullable = false, length = 100)
    private String last_name;

    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String user_name;
    @Column
    private String password_hash;

    @Column(name = "firebase_uid", unique = true)
    private String firebaseUid;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthProvider auth_provider = AuthProvider.LOCAL;

    @Column
    private Boolean active = true;

    @Column(length = 20)
    private String phone;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date registered_at;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updated_at;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<CustomerAddress> addresses;

    @PrePersist
    protected void onCreate() {
        Date now = new Date();
        this.registered_at = now;
        this.updated_at = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updated_at = new Date();
    }
}