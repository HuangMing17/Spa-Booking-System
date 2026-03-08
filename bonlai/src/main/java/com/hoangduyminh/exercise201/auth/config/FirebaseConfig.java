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
import org.springframework.core.io.Resource;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;

/**
 * Cấu hình Firebase cho ứng dụng
 */
@Configuration
public class FirebaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);
    private boolean firebaseInitialized = false;

    @Value("${firebase.service-account-key}")
    private Resource serviceAccountKey;

    @Value("${firebase.project-id}")
    private String projectId;

    @PostConstruct
    public void initializeFirebase() {
        if (FirebaseApp.getApps().isEmpty()) {
            try (InputStream serviceAccount = serviceAccountKey.getInputStream()) {
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .setProjectId(projectId)
                        .build();

                FirebaseApp.initializeApp(options);
                firebaseInitialized = true;
                logger.info("Firebase initialized successfully with project ID: {}", projectId);
            } catch (Exception e) {
                logger.warn("Firebase initialization failed: {}. Firebase authentication will not be available.", e.getMessage());
                logger.warn("To enable Firebase, provide a valid service account key file.");
            }
        }
    }

    @Bean
    public FirebaseAuth firebaseAuth() {
        if (firebaseInitialized && !FirebaseApp.getApps().isEmpty()) {
            return FirebaseAuth.getInstance();
        }
        logger.warn("FirebaseAuth bean not available - Firebase was not initialized successfully");
        return null;
    }
}