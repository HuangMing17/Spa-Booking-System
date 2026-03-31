# Báo cáo rà soát tính năng: Spa Bon Lai (God Spa)

Báo cáo này phân loại các tính năng dựa trên trạng thái triển khai giao diện (UI) và đánh giá mức độ phù hợp đối với hệ thống quản lý Spa.

## 📊 Bảng tổng hợp tính năng

| Tính năng | Đã lên UI? | Có ở Backend? | Đánh giá | Khuyến nghị |
| :--- | :---: | :---: | :--- | :--- |
| **Quản lý Dịch vụ** | ✅ Có | ✅ Có | **70%** | Giữ lại, xóa bỏ các trường "Tồn kho" dư thừa. |
| **Đặt lịch (Booking)** | ✅ Có | ✅ Có | **100%** | Duy trì và tối ưu hóa luồng đặt lịch chuyên nghiệp. |
| **Quản lý Khách hàng** | ✅ Có | ✅ Có | **100%** | Duy trì. |
| **Báo cáo doanh thu** | ✅ Có | ✅ Có | **100%** | Duy trì. |
| **Chat trực tuyến** | ✅ Có | ✅ Có | **90%** | Duy trì. |
| **Tồn kho (Stock)** | ⚠️ Một phần | ✅ Có | **10%** | **Nên xóa bỏ**. Dịch vụ không dùng đến "Tồn kho". |
| **Vận chuyển (Shipping)**| ❌ Không | ✅ Có | **0%** | **Nên xóa bỏ hoàn toàn** các module và logic liên quan. |
| **Giỏ hàng (Cart)** | ❌ Không | ✅ Có | **20%** | Nên xóa để đơn giản hóa quy trình booking trực tiếp. |
| **Nhà cung cấp** | ❌ Không | ✅ Có | **30%** | Ẩn hoặc xóa nếu không kinh doanh mỹ phẩm. |
| **Quản lý Nhân viên** | ❌ Không | ✅ Có | **100%** | **Cần triển khai lên UI Admin ngay**. |

## 🔍 Phân tích chi tiết

### 1. Vấn đề "Tồn kho" (Stock)
- **Tình trạng**: Trong model `Product` và form thêm dịch vụ vẫn tồn tại trường `stock`.
- **Đánh giá**: Dịch vụ Spa không bị giới hạn bởi số lượng "trong kho" mà bởi số lượng giường và kỹ thuật viên. Việc giữ lại `stock` gây rối cho Admin khi tạo mới dịch vụ.

### 2. Vấn đề "Vận chuyển" (Shipping)
- **Tình trạng**: Hệ thống backend có đầy đủ `ShippingRate`, `ShippingZone`, `ProductShippingInfo`.
- **Đánh giá**: Spa là dịch vụ trải nghiệm tại cơ sở. Việc giữ module vận chuyển là dư thừa 100%, làm nặng database và tăng độ phức tạp của code.

### 3. Thiếu sót về quản lý Nhân viên (Staff Allocation)
- **Tình trạng**: Backend đã có thực thể `StaffAccount`, nhưng menu Admin Sidebar hiện không có trang này. 
- **Đánh giá**: Một trong những yếu tố quan trọng nhất của Spa là điều phối kỹ thuật viên cho khách hàng đã bị bỏ qua trên giao diện quản lý.

## 💡 Đề xuất hành động
Hệ thống cần được "tinh giản hóa" bằng cách cắt bỏ các phần dư thừa từ template thương mại điện tử để trở thành một phần mềm quản lý Spa đúng nghĩa.
1. Loại bỏ các đoạn mã liên quan đến **Shipping** và **Stock**.
2. Triển khai giao diện **Quản lý Nhân viên** (Staff) cho Admin.
3. Thay đổi thuật ngữ đồng bộ (`Product` -> `Service`, `Order` -> `Appointment`).
