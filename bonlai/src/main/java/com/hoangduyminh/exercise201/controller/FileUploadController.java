package com.hoangduyminh.exercise201.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class FileUploadController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/image")
    @PreAuthorize("hasAnyRole('STAFF')")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Tạo thư mục nếu chưa tồn tại
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Tạo tên file ngẫu nhiên
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + extension;

            // Lưu file
            Path filePath = Paths.get(uploadDir, newFilename);
            Files.copy(file.getInputStream(), filePath);

            // Trả về URL để truy cập file
            String fileUrl = "/uploads/" + newFilename;
            return ResponseEntity.ok(fileUrl);

        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Không thể upload file: " + e.getMessage());
        }
    }

    @GetMapping("/images")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<String>> listImages() {
        try {
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                return ResponseEntity.ok(List.of());
            }

            List<String> files = Files.list(Paths.get(uploadDir))
                    .map(Path::getFileName)
                    .map(Path::toString)
                    .filter(name -> name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png")
                            || name.endsWith(".webp"))
                    .map(name -> "/uploads/" + name)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(files);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(List.of());
        }
    }

    @GetMapping("/image/{filename}")
    @PreAuthorize("hasAnyRole('STAFF')")
    public ResponseEntity<String> getImageInfo(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir, filename);
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            // Trả về URL để truy cập file
            String fileUrl = "/uploads/" + filename;
            return ResponseEntity.ok(fileUrl);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Không thể lấy thông tin file: " + e.getMessage());
        }
    }
}