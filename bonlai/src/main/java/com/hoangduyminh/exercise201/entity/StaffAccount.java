package com.hoangduyminh.exercise201.entity;

import java.util.List;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "staff_accounts")
public class StaffAccount extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    @JsonIgnore
    private Role role;

    @Column(nullable = true)
    private String first_name;

    @Column(nullable = true)
    private String last_name;

    @Column(nullable = true)
    private String phone_number;

    @Column(nullable = true)
    private String email;

    @Column(nullable = true)
    private String password_hash;
    @Column(name = "user_name", nullable = true)
    private String userName;

    @Column(columnDefinition = "tinyint(1) default 1")
    private boolean active;

    @Column(nullable = true)
    private String image;

    @Column(nullable = true)
    private String placeholder;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private StaffAccount createdBy;

    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL)
    private List<StaffAccount> subCreatedBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "updated_by", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private StaffAccount updatedBy;

    @OneToMany(mappedBy = "updatedBy", cascade = CascadeType.ALL)
    private List<StaffAccount> subUpdatedBy;
}