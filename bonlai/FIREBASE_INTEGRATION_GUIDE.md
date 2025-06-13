# Firebase Authentication Integration Guide

## 🚀 Tình trạng hiện tại

Firebase Authentication đã được tích hợp vào backend Spring Boot với các thành phần sau:

### ✅ Đã hoàn thành:

1. **Database Schema Updates**

   - Thêm `firebase_uid` column vào bảng `customers`
   - Thêm `auth_provider` enum (LOCAL, GOOGLE, FIREBASE)
   - Cập nhật `Customer` entity

2. **Firebase Configuration**

   - Firebase service account key đã được lưu tại `src/main/resources/firebase-service-account.json`
   - Cấu hình Firebase trong `application.properties`
   - `FirebaseConfig` class để khởi tạo Firebase App

3. **Authentication Services**

   - `FirebaseAuthService` - xử lý xác thực Firebase tokens
   - `CustomerRepository` - thêm `findByFirebaseUid()` method

4. **API Endpoints**

   - `POST /auth/firebase/verify` - Xác thực Firebase token → trả JWT
   - `POST /auth/firebase/register` - Đăng ký với Firebase token
   - `GET /auth/firebase/health` - Health check

5. **Security Configuration**
   - Cập nhật `SecurityConfig` để cho phép Firebase endpoints
   - `.gitignore` để bảo vệ Firebase credentials

### 🔧 Cần hoàn thành:

1. **Thêm Firebase Admin SDK dependency vào `pom.xml`:**

```xml
<dependency>
    <groupId>com.google.firebase</groupId>
    <artifactId>firebase-admin</artifactId>
    <version>9.2.0</version>
</dependency>
```

2. **Cập nhật database schema:**

```sql
ALTER TABLE customers
ADD COLUMN firebase_uid VARCHAR(255) UNIQUE,
ADD COLUMN auth_provider ENUM('LOCAL', 'GOOGLE', 'FIREBASE') DEFAULT 'LOCAL',
MODIFY COLUMN password_hash VARCHAR(255) NULL;
```

3. **Uncomment Firebase code trong `FirebaseAuthService`** sau khi thêm dependency

## 📋 API Usage

### Xác thực với Firebase Token

```bash
POST /auth/firebase/verify
Content-Type: application/json

{
  "firebaseToken": "YOUR_FIREBASE_ID_TOKEN"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Firebase authentication successful",
  "jwtToken": "YOUR_JWT_TOKEN",
  "tokenType": "Bearer"
}
```

### Frontend Integration

```javascript
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAH2w0ha5R60VyXPD--rOH_Jarwj9wjxIA",
  authDomain: "spa-fa1d5.firebaseapp.com",
  projectId: "spa-fa1d5",
  storageBucket: "spa-fa1d5.firebasestorage.app",
  messagingSenderId: "169005540758",
  appId: "1:169005540758:web:d8ca31b34d81b004b969b7",
  measurementId: "G-C7462B9J50",
};

// Initialize Firebase
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Google Sign In
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    // Send to backend
    const response = await fetch("/auth/firebase/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firebaseToken: idToken,
      }),
    });

    const data = await response.json();
    if (data.success) {
      // Store JWT token for API calls
      localStorage.setItem("jwt", data.jwtToken);
    }
  } catch (error) {
    console.error("Sign in failed:", error);
  }
};
```

## 🔒 Bảo mật

1. **Firebase Service Account Key** đã được thêm vào `.gitignore`
2. **Không commit** file `firebase-service-account.json` lên Git
3. **Production**: Sử dụng environment variables thay vì file

## 🎯 Lợi ích đạt được

1. **Simplified OAuth2**: Firebase xử lý toàn bộ Google OAuth2 flow
2. **Backward Compatible**: JWT authentication vẫn hoạt động bình thường
3. **Scalable**: Dễ dàng thêm providers khác (Facebook, GitHub, etc.)
4. **Secure**: Firebase handle token validation và user management

## 🚀 Các bước tiếp theo

1. Thêm Firebase dependency vào `pom.xml`
2. Chạy database migration
3. Uncomment code trong `FirebaseAuthService`
4. Test authentication flow
5. Integrate với frontend

## 📞 Support

Nếu có vấn đề gì trong quá trình triển khai, hãy kiểm tra:

1. Firebase dependency đã được thêm chưa
2. Database schema đã được cập nhật chưa
3. Firebase service account key có đúng path không
4. Application properties có đúng cấu hình không
