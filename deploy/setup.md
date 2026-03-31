# Hướng Dẫn Setup & Deploy Toàn Bộ Dự Án (FE + BE + DB) Lên 1 VPS

Dựa trên cấu trúc 3 phần (Frontend, Backend, Database) cùng chạy Docker, dưới đây là file hướng dẫn bạn kéo code và chạy toàn bộ ứng dụng trên VPS mà **không can thiệp, không phá vỡ dự án cũ**.

## 1. Chuẩn bị VPS (Ubuntu 24.04 - 1 vCPU - 2GB RAM)

Vui lòng đảm bảo bạn đã tạo và bật **4GB Swap RAM** (như đã chạy ở các lệnh thông báo trước) để tránh hết bộ nhớ khi MySQL và Java cùng chạy. Server phải cài sẵn Git và Docker.

## 2. Mã Nguồn (Sao chép lên VPS)

Từ máy tính cá nhân, bạn push code lên GitHub/GitLab, rồi vào giao diện SSH của VPS kéo về (clone).
```bash
# Di chuyển vào thư mục web trên máy chủ
cd /var/www
git clone <link-github-cua-ban> webforspa
cd webforspa
```
*Lưu ý: Nếu đẩy code mới, dùng thư mục này trên VPS để `git pull origin main`*

## 3. Kiến Trúc Cổng (Port) Dự Án

Thế mạnh của Docker Compose là phân tách từng container ra làm một "thế giới nội bộ" và có đường đi riêng thoát ra ngoài (Publish Port). File `docker-compose.yml` (ở root) tôi đã cấu hình lại để không đụng ai:
- **MySQL DB:** `3307` (bên trong là `3306`). 
- **Spring Boot BE:** `8081` (bên trong là `8080`).
- **React/Vite FE:** `8082` (bên trong Nginx là `80`).

> *Giải thích: Việc ở Frontend Node Docker chuyển `VITE_API_URL=/api` là hoàn toàn chính xác. Nginx tích hợp ở trong container Frontend sẽ có trách nhiệm hứng những yêu cầu `/api/abc` và bắn nội bộ sang container `bonlai-api`. Cấu trúc này làm hệ thống rất gọn, không sợ Cors!*

## 4. Triển Khai (Build & Up Docker)

Từ trong VPS (thư mục chứa mã nguồn vừa Clone), chạy lệnh:

```bash
docker-compose up -d --build
```
Hệ thống sẽ:
1. Kéo MySQL 8.0, dựng port `3307`.
2. Build code backend Java bằng công cụ Maven trực tiếp trong Docker, rồi run image `eclipse-temurin`, tạo cổng `8081`. 
3. Build code frontend bằng `node:18`, xuất ra file `dist`, vớt vát giao cho phần Nginx Web Server chạy ở cổng `8082`.

Đợi 3-5 phút, gõ `docker ps` để xác nhận 3 Container (`bonlai-mysql`, `bonlai-api`, `bonlai-frontend`) đều có TRẠNG THÁI (Status) là `Up`.

## 5. Cấu hình Domain (Tên miền) trỏ đến Frontend

Vì frontend bao thầu luôn cả điều hướng API về Backend, nên bạn cần dùng một Nginx Master (chính bản Nginx cấp chủ VPS đã setup - vd như Nginx Proxy Manager) để điểu lệnh trỏ Domain.

1. Tên miền trỏ bản ghi **A record** ở nhà cung cấp tên miền: `domain-cua-ban.com` -> `157.10.195.11`
2. Config Nginx System (hoặc giao diện Nginx Proxy Manager / cPanel nếu có):
```nginx
server {
    listen 80;
    server_name domain-cua-ban.com;

    location / {
        proxy_pass http://localhost:8082;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 6. Setup VNPay 

1. Đăng ký/lấy thông tin ở [Sandbox VNPay](https://sandbox.vnpayment.vn/devreg/).
2. Nếu trong `VNPayConfig.java` bạn gọi biến lấy từ Env (Environment Variabiles) ra, hãy đặt chúng vào cấu hình BackEnd ở `docker-compose.yml`:
   ```yaml
   environment:
     - VNPAY_TMNCODE=xxx
     - VNPAY_HASHSECRET=yyy
   ```
3. Lưu ý thông số đường dẫn trỏ về sau khi thanh toán xong phải được cập nhật ở VNPAY Terminal (Cổng quản lý cửa hàng) để nó đẩy Request kết quả về chính xác địa chỉ `https://domain-cua-ban.com/payment/callback`.
