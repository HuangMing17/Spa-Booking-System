# Hướng Dẫn Deploy Toàn Diện (Full-Stack) Trên 1 VPS Duy Nhất

Vì bạn muốn triển khai **cả phần Frontend và Backend** lên cùng một con VPS (không dùng Vercel nữa), mô hình hệ thống sẽ trở nên **rất tối ưu**.

Lý do tối ưu nhất là vì chúng ta dựng Nginx ngay trong Docker của Frontend, và hứng luôn mọi request `/api/...` để đẩy thẳng về Backend mà **không bao giờ bị lỗi CORS hay Mixed Content**. Bạn không cần nhiều domain!

---

## KIẾN TRÚC HIỆN TẠI (Đã tự động Code sẵn)

Để tiện cho bạn, tôi đã chuẩn bị sẵn mọi file cần thiết trên mã nguồn:
1. `d:\webforspa\docker-compose.yml`: File cấu hình tổng (Root) giúp bạn chạy cả MySQL, Frontend và Backend cùng một lúc.
2. `d:\webforspa\frontendbonlai\Dockerfile`: File cấu hình Build React (Vite) và gói (serve) tĩnh nó thông qua Nginx.
3. `d:\webforspa\frontendbonlai\nginx.conf`: File định tuyến siêu việt: Giúp React Router chạy mượt (`index.html` fallback) và đẩy `/api` call ngầm cho Backend.

---

## CÁC BƯỚC ĐEPLOY LÊN VPS

### Bước 1: Chuẩn bị mã nguồn
Tương tự như ban nãy, bạn đẩy **toàn bộ thư mục mẹ `d:\webforspa`** (chứa cả 2 con) lên 1 repo GitHub duy nhất (Hoặc bạn có thể dùng WinSCP/FileZilla để ném thẳng cái thư mục `webforspa` lên VPS).

### Bước 2: Cài Docker & Git trên VPS (Ubuntu)
SSH vào VPS ảo của bạn, sau đó chạy các lệnh sau:
```bash
sudo apt update
sudo apt install docker.io docker-compose git -y
sudo systemctl enable --now docker
```

### Bước 3: Đưa Code dóng vào VPS & Khởi chạy hệ thống!
```bash
git clone https://github.com/Taikhoancuaban/repo-spa-cua-ban.git
cd repo-spa-cua-ban

# Bạn hãy đảm bảo đường dẫn đứng tại nơi chứa file docker-compose.yml tổng mà tôi vừa tạo!
sudo docker-compose up -d --build
```

Lệnh build kia sẽ mất chừng vài phút để:
- Pull MySQL về máy (cổng nội bộ 3306).
- Build JDK cho thư mục `bonlai` và bật Spring Boot (địa chỉ nội bộ: `bonlai-api:8080`).
- Build lại React + Vite và đưa vào Nginx, chạy tại cổng thật `80` trên VPS. Bạn sẽ thay đổi tự động `VITE_API_URL=/api` lúc Build để nó luôn tương đối.

### Bước 4. Tận hưởng thành quả
Giờ đây:
- Khi người truy cập vào IP của con VPS trên trình duyệt: `http://103.XXX.XXX.XXX` -> Nginx của Frontend sẽ trả lại giao diện React Web!
- Bất kỳ API request nào của web bắn đi `http://103.XXX.XXX.XXX/api/login...` -> Sẽ bị chặn lại bởi Nginx và "âm thầm" đẩy xuống Database Spring Boot. 

Mô hình siêu nhẹ, siêu mượt và bạn chỉ việc lo chi trả 1 con VPS mà thôi. 

> [!TIP]
> **Khi nào thì gán Tên miền & Bật Chìa khoá xanh bảo mật SSL?**
> Thao tác bật SSL vẫn sẽ được làm dễ dàng sau này. Bạn trỏ địa chỉ Domain vào VPS, sau đó cài Nginx Host ra phía ngoài của VPS và Certbot để nó bao bọc nốt cổng 80 của cái file `docker-compose` hiện tại. Nó sẽ hoạt động 100%. Lúc này khoan lo về CORS do frontend và backend đã chạy chung nhà rồi! 
