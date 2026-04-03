package com.hoangduyminh.exercise201.auth.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.hoangduyminh.exercise201.auth.service.CombinedUserDetailsService;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import org.springframework.http.HttpMethod;

/**
 * Cấu hình Spring Security
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CombinedUserDetailsService userDetailsService;

    public SecurityConfig(
            JwtAuthFilter jwtAuthFilter,
            CombinedUserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configure(http))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers(
                                "/auth/customer/login",
                                "/auth/customer/register",
                                "/auth/customer/firebase-login",
                                "/auth/customer/auth-methods",
                                "/auth/customer/firebase-health",
                                "/auth/staff/login",
                                "/auth/staff/register",
                                "/auth/firebase/verify",
                                "/auth/firebase/register",
                                "/auth/firebase/health",
                                "/api/test/**",
                                "/api/payment/vnpay-ipn", // Cho phép Máy chủ VNPay gọi tự do
                                "/ws/chat/**", // Cho phép kết nối WebSocket chat
                                "/actuator/health",
                                "/api/services/**",
                                "/auth/**",
                                "/error")
                        .permitAll()
                        // Public GET endpoints for categories
                        .requestMatchers(HttpMethod.GET,
                                "/api/categories",
                                "/api/categories/search",
                                "/api/categories/*",
                                "/api/categories/*/children",
                                "/api/categories/*/products")
                        .permitAll()
                        // Public GET endpoints for products
                        .requestMatchers(HttpMethod.GET,
                                "/api/products",
                                "/api/products/search",
                                "/api/products/*",
                                "/api/products/category/*",
                                "/api/products/tag/*")
                        .permitAll()
                        // Public GET endpoints for orders
                        // Public GET access to uploaded files
                        .requestMatchers("/uploads/**")
                        .permitAll()
                        // All other endpoints need authentication
                        .anyRequest()
                        .authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers
                        .frameOptions(fo -> fo.deny()) // Chặn Clickjacking
                        .xssProtection(xss -> xss.disable()) // Modern browser dùng CSP thay thế
                        .contentSecurityPolicy(csp -> csp
                                .policyDirectives("default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:;"))
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}