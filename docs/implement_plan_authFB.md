# 📋 Implementation Plan — Đăng nhập bằng Facebook qua Firebase

> **Mục tiêu:** Thêm tính năng đăng nhập bằng Facebook cho khách hàng, tận dụng hạ tầng Firebase Authentication đã thiết lập sẵn.
>
> **Ngày tạo:** 2026-03-08
> **Ước tính thời gian:** 2-3 giờ

---

## 1. PHÂN TÍCH HIỆN TRẠNG

### 1.1. Flow đăng nhập Google hiện tại (dùng làm mẫu)

```
[User click "Đăng nhập Google"]
        ↓
[Firebase SDK popup → User chọn Google account]
        ↓
[Nhận Firebase ID Token]
        ↓
[POST /auth/customer/firebase-login { firebaseToken }]
        ↓
[Backend verify token → tìm/tạo Customer → trả JWT]
        ↓
[Frontend lưu JWT → redirect trang chủ]
```

### 1.2. Các file hiện có liên quan

| Layer | File | Vai trò |
|:------|:-----|:--------|
| **Frontend** | `src/utils/firebase.js` | Config Firebase, `signInWithGoogle()` |
| **Frontend** | `src/auth/customer/context/CustomerAuthContext.jsx` | `firebaseLogin()` — gọi Firebase → gửi token backend |
| **Frontend** | `src/auth/customer/pages/CustomerLogin.jsx` | UI nút đăng nhập Google |
| **Backend** | `auth/config/FirebaseConfig.java` | Init Firebase Admin SDK |
| **Backend** | `auth/service/FirebaseAuthService.java` | `authenticateFirebaseToken()` — verify token, tìm/tạo customer |
| **Backend** | `auth/controller/CustomerAuthController.java` | Endpoint `/auth/customer/firebase-login` |
| **Backend** | `entity/AuthProvider.java` | Enum: `LOCAL, GOOGLE, FIREBASE` |
| **Backend** | `entity/Customer.java` | Entity có `firebaseUid`, `auth_provider` |

### 1.3. Nhận xét quan trọng

> **Đăng nhập Facebook CŨNG dùng Firebase Authentication**, nên:
> - ✅ **Backend KHÔNG cần thay đổi gì** — endpoint `/auth/customer/firebase-login` đã xử lý mọi Firebase provider
> - ✅ `FirebaseAuthService.authenticateFirebaseToken()` verify bất kỳ Firebase ID Token nào (Google/Facebook/etc.)
> - ✅ `findOrCreateCustomer()` tự tạo customer mới nếu chưa có
> - 🔧 **Chỉ cần thay đổi ở Frontend** + cấu hình Firebase Console

---

## 2. KIẾN TRÚC GIẢI PHÁP

### 2.1. Flow đăng nhập Facebook (tương tự Google)

```
[User click "Đăng nhập Facebook"]
        ↓
[Firebase SDK popup → User đăng nhập Facebook]
        ↓
[Nhận Firebase ID Token]   ← Firebase lo việc xác thực với Facebook
        ↓
[POST /auth/customer/firebase-login { firebaseToken }]   ← DÙNG LẠI endpoint cũ
        ↓
[Backend verify token → tìm/tạo Customer (auth_provider=FACEBOOK)]
        ↓
[Frontend lưu JWT → redirect trang chủ]
```

### 2.2. Phạm vi thay đổi

#### ✅ CẦN LÀM

| # | Phạm vi | File | Thay đổi |
|:--|:--------|:-----|:---------|
| 1 | **Firebase Console** | — | Bật Facebook provider, nhập App ID/Secret |
| 2 | **Frontend** | `src/utils/firebase.js` | Thêm `FacebookAuthProvider` + hàm `signInWithFacebook()` |
| 3 | **Frontend** | `src/auth/customer/context/CustomerAuthContext.jsx` | Thêm hàm `facebookLogin()` |
| 4 | **Frontend** | `src/auth/customer/pages/CustomerLogin.jsx` | Thêm nút "Đăng nhập với Facebook" |
| 5 | **Backend** | `entity/AuthProvider.java` | Thêm giá trị `FACEBOOK` vào enum |
| 6 | **Backend** | `auth/service/FirebaseAuthService.java` | Cập nhật `findOrCreateCustomer()` — set provider = `FACEBOOK` khi detect |

#### ❌ KHÔNG CẦN LÀM

- ❌ Tạo controller mới
- ❌ Tạo endpoint mới
- ❌ Thay đổi SecurityConfig
- ❌ Thay đổi database schema
- ❌ Tạo service mới

---

## 3. CHI TIẾT TRIỂN KHAI

### 3.1. Cấu hình Firebase Console (Yêu cầu thủ công)

**Bước 1:** Tạo Facebook App tại [Facebook Developers](https://developers.facebook.com/)
- Tạo App mới → Chọn "Consumer"
- Vào **Settings > Basic** → copy **App ID** và **App Secret**

**Bước 2:** Bật Facebook provider trên Firebase
- Firebase Console → Authentication → Sign-in method
- Chọn **Facebook** → Bật Enable
- Nhập **App ID** và **App Secret** từ Bước 1
- Copy **OAuth redirect URI** từ Firebase → paste vào Facebook App:
  `https://spa-fa1d5.firebaseapp.com/__/auth/handler`

**Bước 3:** Cấu hình Facebook App
- Vào Facebook Developers → App Settings → Valid OAuth Redirect URIs
- Paste URI từ Firebase

### 3.2. Frontend — `src/utils/firebase.js`

**Thay đổi:** Thêm `FacebookAuthProvider` và hàm `signInWithFacebook()`

```javascript
// THÊM import
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,   // ← THÊM
  signInWithPopup,
  signOut,
} from "firebase/auth";

// THÊM provider mới
export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

// THÊM vào firebaseAuthService
signInWithFacebook: async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return result;
  } catch (error) {
    console.error("Error during Facebook sign-in:", error);
    throw error;
  }
},
```

### 3.3. Frontend — `CustomerAuthContext.jsx`

**Thay đổi:** Thêm hàm `facebookLogin()` (clone từ `firebaseLogin`, đổi sang Facebook)

```javascript
// Thêm import
import { firebaseAuthService } from "../../../utils/firebase";

// Thêm hàm mới bên dưới firebaseLogin
const facebookLogin = async (redirectPath = "/") => {
  try {
    setLoading(true);
    message.loading("Đang đăng nhập với Facebook...", 0);

    // Đăng nhập với Facebook qua Firebase
    const firebaseResult = await firebaseAuthService.signInWithFacebook();
    const idToken = await firebaseResult.user.getIdToken();

    // Gửi Firebase token tới backend (DÙNG LẠI endpoint cũ)
    const response = await axiosInstance.post("/auth/customer/firebase-login", {
      firebaseToken: idToken,
    });

    setAuthData(response);
    setUser(response.user);
    setIsLoggedIn(true);

    message.destroy();
    message.success("Đăng nhập với Facebook thành công!");
    navigate(redirectPath);
  } catch (error) {
    message.destroy();
    if (error.code === "auth/popup-closed-by-user") {
      message.warning("Đăng nhập bị hủy");
    } else if (error.code === "auth/account-exists-with-different-credential") {
      message.error("Email này đã được sử dụng với phương thức đăng nhập khác");
    } else {
      message.error(error?.message || "Đăng nhập với Facebook thất bại");
    }
    throw error;
  } finally {
    setLoading(false);
  }
};

// Thêm vào authContextValue
const authContextValue = {
  // ... existing
  facebookLogin,   // ← THÊM
};
```

### 3.4. Frontend — `CustomerLogin.jsx`

**Thay đổi:** Thêm nút Facebook bên dưới nút Google

```jsx
// Thêm import icon
import { FacebookFilled } from "@ant-design/icons";

// Thêm hàm handler
const handleFacebookLogin = async () => {
  try {
    setError("");
    const redirectPath = location.state?.from || "/";
    await facebookLogin(redirectPath);
  } catch (err) {
    console.error("Facebook login error:", err);
  }
};

// Thêm nút UI bên dưới nút Google
<Button
  icon={<FacebookFilled />}
  size="large"
  block
  loading={loading}
  onClick={handleFacebookLogin}
  style={{
    height: 45,
    fontSize: 16,
    fontWeight: 500,
    backgroundColor: "#1877F2",
    borderColor: "#1877F2",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  }}
>
  Đăng nhập với Facebook
</Button>
```

### 3.5. Backend — `AuthProvider.java`

**Thay đổi:** Thêm `FACEBOOK` vào enum

```java
public enum AuthProvider {
    LOCAL,
    GOOGLE,
    FIREBASE,
    FACEBOOK   // ← THÊM
}
```

### 3.6. Backend — `FirebaseAuthService.java`

**Thay đổi:** Cập nhật `findOrCreateCustomer()` để detect Facebook provider

```java
private Customer findOrCreateCustomer(String firebaseUid, String email, String name) {
    // ... code existing tìm theo firebaseUid, email ...

    // Khi tạo customer mới — detect provider từ Firebase UID prefix hoặc set FIREBASE
    newCustomer.setAuth_provider(AuthProvider.FIREBASE);
    // Provider cụ thể (GOOGLE/FACEBOOK) có thể detect từ FirebaseToken.getSignInProvider()
    // ...
}
```

> **Lưu ý:** Có thể truyền thêm `signInProvider` từ `decodedToken.getSignInProvider()` để phân biệt chính xác Google vs Facebook. **Tuy nhiên không bắt buộc** — dùng `FIREBASE` chung cũng hoạt động tốt.

---

## 4. XỬ LÝ CÁC EDGE CASE

### 4.1. Trùng email giữa Google và Facebook

**Tình huống:** User dùng cùng email cho Google và Facebook.

**Xử lý hiện tại:** Firebase tự động link accounts nếu cùng email. Backend tìm customer theo `firebaseUid` hoặc `email`, nên sẽ tìm thấy customer đã tồn tại.

**Lỗi có thể gặp:** Firebase throw `auth/account-exists-with-different-credential` khi email đã đăng ký bằng Google trước → cần xử lý ở frontend.

### 4.2. User Facebook không public email

**Tình huống:** Một số Facebook account không chia sẻ email.

**Xử lý:** Firebase tự xử lý — nếu không có email, `decodedToken.getEmail()` trả `null`. Cần handle ở backend:
- Tạo email tạm: `facebook_{uid}@facebook.placeholder`
- Hoặc yêu cầu user nhập email sau khi đăng nhập

---

## 5. TESTING CHECKLIST

| # | Test case | Kết quả mong đợi |
|:--|:----------|:-----------------|
| 1 | Click nút "Đăng nhập Facebook" | Hiện popup Facebook login |
| 2 | Đăng nhập Facebook lần đầu | Tạo customer mới, chuyển trang chủ |
| 3 | Đăng nhập Facebook lần 2 | Tìm thấy customer cũ, đăng nhập thành công |
| 4 | Hủy popup Facebook | Hiện message "Đăng nhập bị hủy" |
| 5 | Facebook email trùng Google email | Xử lý graceful, thông báo cho user |
| 6 | Đăng nhập Google vẫn hoạt động | Không bị ảnh hưởng bởi thay đổi |
| 7 | Đăng nhập email/password vẫn hoạt động | Không bị ảnh hưởng |
