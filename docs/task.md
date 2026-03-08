# ✅ Task List — Đăng nhập Facebook qua Firebase

> **Tham chiếu:** [implement_plan_authFB.md](./implement_plan_authFB.md)
>
> **Ngày tạo:** 2026-03-08
> **Branch:** `hieu-pham`

---

## Phase 1: Cấu hình (Yêu cầu thao tác thủ công)

- [x] **Task 1.1:** Tạo Facebook App trên Facebook Developers
  - Truy cập https://developers.facebook.com/
  - Tạo App mới → loại "Consumer"
  - Copy **App ID** và **App Secret**
  - Thời gian: ~10 phút

- [x] **Task 1.2:** Bật Facebook provider trên Firebase Console
  - Firebase Console → Authentication → Sign-in method → Facebook
  - Nhập App ID + App Secret
  - Copy OAuth redirect URI
  - Thời gian: ~5 phút

- [x] **Task 1.3:** Cấu hình redirect URI trong Facebook App
  - Facebook Developers → Settings → Valid OAuth Redirect URIs
  - Paste URI: `https://spa-fa1d5.firebaseapp.com/__/auth/handler`
  - Thời gian: ~5 phút

---

## Phase 2: Backend (Thay đổi nhỏ)

- [x] **Task 2.1:** Thêm `FACEBOOK` vào enum `AuthProvider`
  - **File:** `bonlai/src/main/java/com/hoangduyminh/exercise201/entity/AuthProvider.java`
  - **Chi tiết:** Thêm `FACEBOOK` vào enum
  - **Độ phức tạp:** Thấp
  - Thời gian: ~2 phút

- [x] **Task 2.2:** (Tùy chọn) Cập nhật `FirebaseAuthService` để detect Facebook provider
  - **File:** `bonlai/src/main/java/com/hoangduyminh/exercise201/auth/service/FirebaseAuthService.java`
  - **Chi tiết:** Dùng `decodedToken.getSignInProvider()` để set `AuthProvider.FACEBOOK` thay vì `FIREBASE` chung
  - **Độ phức tạp:** Thấp
  - Thời gian: ~10 phút

---

## Phase 3: Frontend (Thay đổi chính)

- [x] **Task 3.1:** Thêm Facebook provider vào `firebase.js`
  - **File:** `frontendbonlai/src/utils/firebase.js`
  - **Chi tiết:**
    - Import `FacebookAuthProvider` từ `firebase/auth`
    - Tạo `facebookProvider` với scope `email`, `public_profile`
    - Thêm hàm `signInWithFacebook()` vào `firebaseAuthService`
  - **Độ phức tạp:** Thấp
  - Thời gian: ~10 phút

- [x] **Task 3.2:** Thêm `facebookLogin()` vào `CustomerAuthContext`
  - **File:** `frontendbonlai/src/auth/customer/context/CustomerAuthContext.jsx`
  - **Chi tiết:**
    - Tạo hàm `facebookLogin()` (tương tự `firebaseLogin`)
    - Gọi `firebaseAuthService.signInWithFacebook()`
    - Gửi token đến `/auth/customer/firebase-login` (dùng lại endpoint)
    - Xử lý lỗi `auth/account-exists-with-different-credential`
    - Export `facebookLogin` qua context
  - **Độ phức tạp:** Trung bình
  - Thời gian: ~15 phút

- [x] **Task 3.3:** Thêm nút "Đăng nhập với Facebook" vào `CustomerLogin`
  - **File:** `frontendbonlai/src/auth/customer/pages/CustomerLogin.jsx`
  - **Chi tiết:**
    - Import `FacebookFilled` icon từ Ant Design
    - Destructure `facebookLogin` từ `useCustomerAuth()`
    - Thêm hàm `handleFacebookLogin()`
    - Thêm nút Facebook (màu `#1877F2`) bên dưới nút Google
  - **Độ phức tạp:** Thấp
  - Thời gian: ~10 phút

---

## Phase 4: Kiểm thử

- [ ] **Task 4.1:** Test đăng nhập Facebook lần đầu
  - Kết quả mong đợi: Tạo customer mới, redirect về trang chủ

- [ ] **Task 4.2:** Test đăng nhập Facebook lần 2
  - Kết quả mong đợi: Đăng nhập thành công, không tạo customer trùng

- [ ] **Task 4.3:** Test hủy popup Facebook
  - Kết quả mong đợi: Hiện thông báo "Đăng nhập bị hủy"

- [ ] **Task 4.4:** Test đăng nhập Google vẫn hoạt động
  - Kết quả mong đợi: Không bị ảnh hưởng

- [ ] **Task 4.5:** Test đăng nhập email/password vẫn hoạt động
  - Kết quả mong đợi: Không bị ảnh hưởng

- [ ] **Task 4.6:** Test trùng email Google vs Facebook
  - Kết quả mong đợi: Xử lý graceful

---

## Tổng hợp file thay đổi

| # | File | Thay đổi | Phase |
|:--|:-----|:---------|:------|
| 1 | `entity/AuthProvider.java` | Thêm `FACEBOOK` | Backend |
| 2 | `auth/service/FirebaseAuthService.java` | Detect Facebook provider (tùy chọn) | Backend |
| 3 | `src/utils/firebase.js` | Thêm `FacebookAuthProvider` + `signInWithFacebook()` | Frontend |
| 4 | `src/auth/customer/context/CustomerAuthContext.jsx` | Thêm `facebookLogin()` | Frontend |
| 5 | `src/auth/customer/pages/CustomerLogin.jsx` | Thêm nút + handler Facebook | Frontend |

**Tổng thời gian ước tính:** ~1.5 - 2 giờ (bao gồm cấu hình + code + test)

---

## Thứ tự thực hiện khuyến nghị

```
Task 1.1 → 1.2 → 1.3 (Cấu hình Firebase/Facebook — làm trước)
    ↓
Task 2.1 (Backend enum)
    ↓
Task 3.1 → 3.2 → 3.3 (Frontend — theo đúng thứ tự)
    ↓
Task 2.2 (Backend detect provider — tùy chọn)
    ↓
Task 4.1 → 4.6 (Kiểm thử)
```
