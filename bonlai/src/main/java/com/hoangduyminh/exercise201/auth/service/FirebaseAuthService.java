package com.hoangduyminh.exercise201.auth.service;

import com.hoangduyminh.exercise201.entity.Customer;
import com.hoangduyminh.exercise201.entity.AuthProvider;
import com.hoangduyminh.exercise201.repository.CustomerRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service xử lý Firebase Authentication
 * Note: Cần thêm Firebase Admin SDK dependency để sử dụng FirebaseAuth
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FirebaseAuthService {

    private final CustomerRepository customerRepository;
    private final JwtService jwtService;
    private final FirebaseAuth firebaseAuth;

    /**
     * Xác thực Firebase ID token và trả về JWT token
     * 
     * @param firebaseToken Firebase ID token từ client
     * @return JWT token cho backend authentication
     */
    public String authenticateFirebaseToken(String firebaseToken) {
        try {
            FirebaseToken decodedToken = firebaseAuth.verifyIdToken(firebaseToken);
            String firebaseUid = decodedToken.getUid();
            String email = decodedToken.getEmail();
            String name = decodedToken.getName();
            String signInProvider = null;
            // Lấy sign_in_provider từ firebase claims
            try {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> firebaseClaims = (java.util.Map<String, Object>) decodedToken.getClaims()
                        .get("firebase");
                if (firebaseClaims != null) {
                    signInProvider = (String) firebaseClaims.get("sign_in_provider");
                }
            } catch (Exception ex) {
                log.warn("Could not extract sign_in_provider from token");
                signInProvider = "firebase";
            }

            // Tìm hoặc tạo customer
            Customer customer = findOrCreateCustomer(firebaseUid, email, name, signInProvider);

            // Tạo UserDetails object cho JWT service
            UserDetails userDetails = User.builder()
                    .username(customer.getEmail())
                    .password("") // Firebase users don't have password
                    .authorities(List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER")))
                    .build();

            // Tạo JWT token cho backend
            return jwtService.generateToken(userDetails, "CUSTOMER");

        } catch (Exception e) {
            log.error("Error authenticating Firebase token: {}", e.getMessage());
            throw new RuntimeException("Firebase authentication failed", e);
        }
    }

    /**
     * Xác định AuthProvider từ Firebase sign-in provider
     */
    private AuthProvider resolveAuthProvider(String signInProvider) {
        if (signInProvider == null)
            return AuthProvider.FIREBASE;
        return switch (signInProvider) {
            case "google.com" -> AuthProvider.GOOGLE;
            case "facebook.com" -> AuthProvider.FACEBOOK;
            default -> AuthProvider.FIREBASE;
        };
    }

    /**
     * Tìm hoặc tạo customer từ Firebase user info
     */
    private Customer findOrCreateCustomer(String firebaseUid, String email, String name, String signInProvider) {
        // Tìm customer theo firebase_uid
        Optional<Customer> existingCustomer = customerRepository.findByFirebaseUid(firebaseUid);

        if (existingCustomer.isPresent()) {
            return existingCustomer.get();
        }

        // Tìm customer theo email (để link existing account)
        Optional<Customer> customerByEmail = customerRepository.findByEmail(email);
        if (customerByEmail.isPresent()) {
            Customer customer = customerByEmail.get();
            customer.setFirebaseUid(firebaseUid);
            customer.setAuth_provider(resolveAuthProvider(signInProvider));

            // Ensure customer has a non-null password if it's not set
            if (customer.getPassword_hash() == null || customer.getPassword_hash().isEmpty()) {
                customer.setPassword_hash("{noop}FIREBASE_AUTH_USER");
            }

            return customerRepository.save(customer);
        }

        // Tạo customer mới
        Customer newCustomer = new Customer();
        newCustomer.setId(UUID.randomUUID());
        newCustomer.setEmail(email);
        newCustomer.setFirebaseUid(firebaseUid);
        newCustomer.setAuth_provider(resolveAuthProvider(signInProvider));

        // Set một password dummy không rỗng cho Firebase users
        // Vì Firebase users không sử dụng password local, nhưng Spring Security
        // User.Builder yêu cầu password không null
        newCustomer.setPassword_hash("{noop}FIREBASE_AUTH_USER");

        // Parse name thành first_name và last_name
        if (name != null && !name.trim().isEmpty()) {
            String[] nameParts = name.trim().split("\\s+");
            newCustomer.setFirst_name(nameParts[0]);
            if (nameParts.length > 1) {
                newCustomer
                        .setLast_name(String.join(" ", java.util.Arrays.copyOfRange(nameParts, 1, nameParts.length)));
            } else {
                newCustomer.setLast_name("");
            }
        } else {
            newCustomer.setFirst_name("Firebase");
            newCustomer.setLast_name("User");
        }

        newCustomer.setUser_name(email); // Sử dụng email làm username
        newCustomer.setActive(true);
        newCustomer.setRegistered_at(new Date());
        newCustomer.setUpdated_at(new Date());

        return customerRepository.save(newCustomer);
    }

    /**
     * Kiểm tra xem customer có được xác thực qua Firebase không
     */
    public boolean isFirebaseUser(String email) {
        return customerRepository.findByEmail(email)
                .map(customer -> customer.getAuth_provider() == AuthProvider.FIREBASE)
                .orElse(false);
    }
}