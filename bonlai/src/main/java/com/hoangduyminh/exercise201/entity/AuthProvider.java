package com.hoangduyminh.exercise201.entity;

/**
 * Enum để xác định nguồn xác thực của user
 */
public enum AuthProvider {
    LOCAL, // Đăng nhập thông thường với email/password
    GOOGLE, // Đăng nhập qua Google OAuth2
    FIREBASE // Đăng nhập qua Firebase Authentication
}