package com.hoangduyminh.exercise201.auth.config;

import com.hoangduyminh.exercise201.auth.service.JwtService;
import com.hoangduyminh.exercise201.auth.service.CombinedUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.util.AntPathMatcher;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * Filter để xác thực JWT token
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // Define public paths that don't need authentication
    private final List<String> publicPaths = Arrays.asList(
            "/auth/customer/login",
            "/auth/customer/register",
            "/auth/staff/login",
            "/auth/staff/register");

    // Define public category GET paths
    private final List<String> publicCategoryPaths = Arrays.asList(
            "/api/categories",
            "/api/categories/search",
            "/api/categories/*",
            "/api/categories/*/children",
            "/api/categories/*/products");

    // Define public product GET paths
    private final List<String> publicProductPaths = Arrays.asList(
            "/api/products",
            "/api/products/search",
            "/api/products/*",
            "/api/products/category/*",
            "/api/products/tag/*");

    // Define public order GET paths

    public JwtAuthFilter(
            JwtService jwtService,
            CombinedUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        String method = request.getMethod();

        // Skip authentication for public paths
        for (String pattern : publicPaths) {
            if (pathMatcher.match(pattern, path)) {
                return true;
            }
        }

        // Skip authentication for public category GET paths
        if ("GET".equalsIgnoreCase(method)) {
            for (String pattern : publicCategoryPaths) {
                if (pathMatcher.match(pattern, path)) {
                    return true;
                }
            }
            // Skip authentication for public product GET paths
            for (String pattern : publicProductPaths) {
                if (pathMatcher.match(pattern, path)) {
                    return true;
                }
            }
        }

        return false;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // Kiểm tra header có Bearer token không
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Lấy token từ header
        jwt = authHeader.substring(7);

        // Lấy username từ token
        username = jwtService.extractUsername(jwt);

        // Nếu có username và chưa authenticated
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Lấy user details
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // Kiểm tra token có hợp lệ không
            if (jwtService.isTokenValid(jwt, userDetails)) {

                // Tạo authentication token
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));

                // Set authentication vào context
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}