package com.hoangduyminh.exercise201.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple in-memory message broker to send messages to clients
        // Prefixes: /topic for broadcast, /queue for point-to-point
        config.enableSimpleBroker("/topic", "/queue");
        
        // Prefix for messages from clients to server
        config.setApplicationDestinationPrefixes("/app");
        
        // Prefix for user-specific destinations
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register STOMP endpoint for WebSocket connections
        registry.addEndpoint("/ws/chat")
                .setAllowedOriginPatterns("*") // Allow all origins (configure for production)
                .withSockJS(); // Enable SockJS fallback for browsers that don't support WebSocket
        
        // Also register endpoint without SockJS for native WebSocket support
        registry.addEndpoint("/ws/chat")
                .setAllowedOriginPatterns("*");
    }
}
