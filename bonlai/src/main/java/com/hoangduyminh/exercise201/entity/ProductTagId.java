package com.hoangduyminh.exercise201.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class ProductTagId implements Serializable {
    private UUID productId;
    private UUID tagId;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ProductTagId that = (ProductTagId) o;
        return productId.equals(that.productId) && tagId.equals(that.tagId);
    }

    @Override
    public int hashCode() {
        return productId.hashCode() ^ tagId.hashCode();
    }
}