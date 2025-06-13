package com.hoangduyminh.exercise201.dto.request;

import lombok.Data;

@Data
public class ServiceVariantRequest {
    private String name;
    private Double price;
    private Integer duration;
}