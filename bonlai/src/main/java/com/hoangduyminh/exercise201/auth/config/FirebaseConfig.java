package com.hoangduyminh.exercise201.auth.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Base64;

@Configuration
public class FirebaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${firebase.project-id:react-vite-ecommerce}")
    private String projectId;

    @Value("${firebase.credentials.path:./src/main/resources/serviceAccountKey.json}")
    private String fallbackPath;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        GoogleCredentials credentials;

        // Vị cứu tinh của Docker/VPS: Đọc chuỗi Base64 siêu dài từ Biến môi trường
        String base64Key = System.getenv("FIREBASE_CREDENTIALS_BASE64");

        if (base64Key != null && !base64Key.trim().isEmpty()) {
            logger.info("📱 Firebase is initializing using Base64 Secure Environment Variable.");
            byte[] decoded = Base64.getDecoder().decode(base64Key);
            credentials = GoogleCredentials.fromStream(new ByteArrayInputStream(decoded));
        } else {
            // Dành cho lúc bạn chạy Local Debug Console
            logger.info("💻 Firebase is initializing using local JSON file path fallback.");
            credentials = GoogleCredentials.fromStream(new FileInputStream(fallbackPath));
        }

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(credentials)
                .setProjectId(projectId)
                .build();

        return FirebaseApp.initializeApp(options);
    }

    @Bean
    public FirebaseAuth firebaseAuth(FirebaseApp firebaseApp) {
        return FirebaseAuth.getInstance(firebaseApp);
    }
}
