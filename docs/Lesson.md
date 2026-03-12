# 📝 Lesson — Các lỗi gặp phải & cách khắc phục

> Ghi chép các lỗi đã gặp trong quá trình phát triển dự án SPA Bon Lai.
> Mục đích: tránh lặp lại lỗi tương tự trong tương lai.

---

## Lỗi 1: Maven Wrapper thiếu file config

- **Ngày:** 2026-03-08
- **Triệu chứng:**
```
PS D:\webforspa\bonlai> .\mvnw.cmd spring-boot:run
Get-Content : Cannot find path 'D:\webforspa\bonlai\.mvn\wrapper\maven-wrapper.properties'
because it does not exist.
ECHO is on.
Cannot start maven from wrapper
```
- **Nguyên nhân:** Thư mục `.mvn/wrapper/` và file `maven-wrapper.properties` không tồn tại. File này có thể đã bị xóa hoặc không được commit lên Git.
- **Cách fix:** Tạo thư mục `.mvn/wrapper/` và file `maven-wrapper.properties` với nội dung:
```properties
distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip
wrapperUrl=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar
```
- **File thay đổi:**
  - ✅ Tạo mới: `bonlai/.mvn/wrapper/maven-wrapper.properties`

---

## Lỗi 2: Firebase crash khi thiếu file credentials

- **Ngày:** 2026-03-08
- **Triệu chứng:**
```
APPLICATION FAILED TO START

Description:
Parameter 2 of constructor in FirebaseAuthService required a bean of type
'com.google.firebase.auth.FirebaseAuth' that could not be found.

The following candidates were found but could not be injected:
 - User-defined bean method 'firebaseAuth' in 'FirebaseConfig' ignored as the bean value is null
```
- **Nguyên nhân:** File `firebase-service-account.json` không tồn tại trong `src/main/resources/` (đã được thêm vào `.gitignore` nên không có trên Git). Khi thiếu file này:
  1. `FirebaseConfig.initializeFirebase()` throw `FileNotFoundException`
  2. Bean `FirebaseAuth` không được tạo
  3. `FirebaseAuthService` inject `FirebaseAuth` qua constructor (`@RequiredArgsConstructor`) → fail vì bean = null
  4. `CustomerAuthController` inject `FirebaseAuthService` → fail theo chuỗi
  5. **Toàn bộ ứng dụng không thể khởi động**

- **Cách fix:** Sửa 2 file để Firebase là **optional** — ứng dụng vẫn chạy khi thiếu Firebase, chỉ tính năng đăng nhập Google bị disable.

### File 1: `FirebaseConfig.java`
- **Đường dẫn:** `bonlai/src/main/java/com/hoangduyminh/exercise201/auth/config/FirebaseConfig.java`
- **Thay đổi:**
  - `initializeFirebase()`: Bỏ `throws IOException`, thay bằng try-catch + kiểm tra `serviceAccountKey.exists()` trước khi đọc
  - Thêm field `firebaseInitialized` để track trạng thái
  - `firebaseAuth()`: Kiểm tra `firebaseInitialized` trước khi gọi `FirebaseAuth.getInstance()`, trả `null` nếu chưa init
  - Log warning thay vì crash

```diff
- @PostConstruct
- public void initializeFirebase() throws IOException {
-     if (FirebaseApp.getApps().isEmpty()) {
-         try (InputStream serviceAccount = serviceAccountKey.getInputStream()) {
-             // ... init Firebase
-         }
-     }
- }
+ @PostConstruct
+ public void initializeFirebase() {
+     if (FirebaseApp.getApps().isEmpty()) {
+         try {
+             if (serviceAccountKey != null && serviceAccountKey.exists()) {
+                 // ... init Firebase
+                 firebaseInitialized = true;
+             } else {
+                 log.warn("Firebase service account key not found. Firebase features will be disabled.");
+             }
+         } catch (IOException e) {
+             log.warn("Failed to initialize Firebase: {}.", e.getMessage());
+         }
+     }
+ }
```

```diff
- public FirebaseAuth firebaseAuth() throws IOException {
-     return FirebaseAuth.getInstance();
- }
+ public FirebaseAuth firebaseAuth() {
+     if (firebaseInitialized) {
+         return FirebaseAuth.getInstance();
+     }
+     log.warn("FirebaseAuth is not available - Firebase was not initialized");
+     return null;
+ }
```

### File 2: `FirebaseAuthService.java`
- **Đường dẫn:** `bonlai/src/main/java/com/hoangduyminh/exercise201/auth/service/FirebaseAuthService.java`
- **Thay đổi:**
  - Bỏ `@RequiredArgsConstructor`, viết constructor thủ công
  - Dùng `@Autowired(required = false)` cho `FirebaseAuth` → Spring cho phép inject `null`
  - Thêm null check trong `authenticateFirebaseToken()` trước khi dùng `firebaseAuth`

```diff
- @RequiredArgsConstructor
  public class FirebaseAuthService {
      private final CustomerRepository customerRepository;
      private final JwtService jwtService;
      private final FirebaseAuth firebaseAuth;

+     public FirebaseAuthService(
+             CustomerRepository customerRepository,
+             JwtService jwtService,
+             @Autowired(required = false) FirebaseAuth firebaseAuth) {
+         this.customerRepository = customerRepository;
+         this.jwtService = jwtService;
+         this.firebaseAuth = firebaseAuth;
+     }

      public String authenticateFirebaseToken(String firebaseToken) {
          try {
+             if (firebaseAuth == null) {
+                 throw new RuntimeException("Firebase is not configured.");
+             }
              FirebaseToken decodedToken = firebaseAuth.verifyIdToken(firebaseToken);
```

- **File thay đổi:**
  - ✅ Sửa: `bonlai/src/main/java/com/hoangduyminh/exercise201/auth/config/FirebaseConfig.java`
  - ✅ Sửa: `bonlai/src/main/java/com/hoangduyminh/exercise201/auth/service/FirebaseAuthService.java`

---

## Lỗi 3: MySQL password không khớp

- **Ngày:** 2026-03-08
- **Triệu chứng:** `ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)`
- **Nguyên nhân:** File `application.properties` có `spring.datasource.password=` (trống), nhưng MySQL root trên máy có đặt password.
- **Cách fix:** Cập nhật password đúng trong `application.properties`:
```properties
spring.datasource.password=<YOUR_PASSWORD>
```
- **File thay đổi:**
  - ✅ Sửa: `bonlai/src/main/resources/application.properties` (dòng `spring.datasource.password`)

---

## Bài học rút ra

| # | Bài học | Áp dụng |
|:--|:-------|:--------|
| 1 | **Không để service phụ thuộc bắt buộc crash cả app** | Dùng `@Autowired(required=false)` hoặc `@ConditionalOnBean` cho các dependency optional như Firebase |
| 2 | **File credentials không nên commit lên Git** | Nhưng cần có hướng dẫn rõ ràng hoặc file mẫu (`.example`) để dev mới setup |
| 3 | **Maven Wrapper cần đầy đủ file** | Đảm bảo `.mvn/wrapper/maven-wrapper.properties` tồn tại, không bị ignore bởi `.gitignore` |
| 4 | **Config database không nên hardcode** | Dùng environment variables hoặc profiles cho các môi trường khác nhau |
