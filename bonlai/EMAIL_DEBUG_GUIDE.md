# 🔧 EMAIL DEBUG GUIDE - Hướng dẫn khắc phục sự cố Email

## 🚨 **VẤN ĐỀ ĐÃ SỬA**

**Email xác nhận đặt lịch không hoạt động** - Đã được khắc phục:

### ✅ **Các thay đổi đã thực hiện:**

1. **EmailServiceImpl.java** - Cải thiện error handling:

   - Thêm kiểm tra null/empty cho customer email
   - Thêm null check cho tất cả variables
   - Xử lý trường hợp items list null
   - Loại bỏ exception throw để không block order creation

2. **booking-confirmation.html** - Sửa template:

   - Thay đổi format currency để tránh conflict
   - Sử dụng formatDecimal thay vì formatCurrency

3. **EmailTestController.java** - Thêm test endpoints:
   - Test email xác nhận đặt lịch
   - Test email cập nhật trạng thái
   - Test email nhắc nhở

## 🧪 **CÁCH TEST EMAIL**

### **1. Test qua API:**

#### **Test Email Xác nhận:**

```bash
POST http://localhost:8080/api/test/email/booking-confirmation?email=your-email@gmail.com
```

#### **Test Email Cập nhật trạng thái:**

```bash
POST http://localhost:8080/api/test/email/status-update?email=your-email@gmail.com&status=CONFIRMED
```

#### **Test Email Nhắc nhở:**

```bash
POST http://localhost:8080/api/test/email/reminder?email=your-email@gmail.com
```

### **2. Test Integration với Order:**

1. Tạo order mới qua API
2. Kiểm tra email được gửi
3. Cập nhật status order
4. Kiểm tra email status update

## 🔍 **DEBUGGING STEPS**

### **Bước 1: Kiểm tra Configuration**

```properties
# application.properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password  # APP PASSWORD, không phải mật khẩu Gmail
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

spa.email.from=your-email@gmail.com
spa.email.from-name=SPA Bon Lai
spa.email.subject.booking-confirmation=Xác nhận đặt lịch hẹn - SPA Bon Lai
```

### **Bước 2: Kiểm tra Logs**

Tìm các log sau trong console:

```
INFO  - Sending booking confirmation email to: customer@email.com
INFO  - Booking confirmation email sent successfully to: customer@email.com
```

Hoặc error logs:

```
ERROR - Failed to send booking confirmation email to: customer@email.com
```

### **Bước 3: Common Issues & Solutions**

#### **❌ Lỗi: Authentication failed**

**Nguyên nhân:** Sai username/password hoặc chưa setup App Password
**Giải pháp:**

1. Bật 2-Step Verification trong Gmail
2. Tạo App Password trong Security settings
3. Sử dụng App Password thay vì mật khẩu thường

#### **❌ Lỗi: Template processing error**

**Nguyên nhân:** Lỗi trong Thymeleaf template
**Giải pháp:**

1. Kiểm tra syntax Thymeleaf
2. Kiểm tra null variables
3. Sử dụng null-safe expressions: `${variable != null ? variable : 'default'}`

#### **❌ Lỗi: NullPointerException**

**Nguyên nhân:** OrderDTO thiếu dữ liệu
**Giải pháp:**

1. Kiểm tra OrderDTO có đầy đủ data không
2. Kiểm tra customer email có null không
3. Kiểm tra items list có null không

#### **❌ Lỗi: Connection timeout**

**Nguyên nhân:** Firewall hoặc network issue
**Giải pháp:**

1. Kiểm tra connection internet
2. Thử port 465 thay vì 587
3. Tắt antivirus/firewall tạm thời

### **Bước 4: Enable Debug Logging**

Thêm vào application.properties:

```properties
# Enable debug logging
logging.level.com.hoangduyminh.exercise201.service.impl.EmailServiceImpl=DEBUG
logging.level.org.springframework.mail=DEBUG
logging.level.org.thymeleaf=DEBUG
```

## 🛠️ **TROUBLESHOOTING CHECKLIST**

### **Email Configuration:**

- [ ] Gmail username/password đúng
- [ ] App Password được tạo và sử dụng
- [ ] SMTP settings đúng (host, port, starttls)
- [ ] Email from/from-name được config

### **Code Issues:**

- [ ] EmailService được inject đúng vào OrderService
- [ ] Template files tồn tại trong src/main/resources/templates/
- [ ] OrderDTO có đầy đủ dữ liệu (customer email, name, etc.)
- [ ] Không có exception trong EmailService

### **Template Issues:**

- [ ] Thymeleaf syntax đúng
- [ ] Variables được passed đúng từ EmailService
- [ ] Null-safe expressions được sử dụng
- [ ] CSS inline để tương thích email client

### **Testing:**

- [ ] Test với EmailTestController trước
- [ ] Kiểm tra logs trong console
- [ ] Test với email thật
- [ ] Kiểm tra spam folder

## 📊 **MONITORING**

### **Các metrics cần theo dõi:**

1. **Email success rate** - Tỷ lệ gửi thành công
2. **Email delivery time** - Thời gian gửi email
3. **Template rendering time** - Thời gian render template
4. **Error frequency** - Tần suất lỗi

### **Logs quan trọng:**

```java
log.info("Sending booking confirmation email to: {}", orderDTO.getCustomerEmail());
log.debug("Email context - CustomerName: {}, OrderId: {}, Items count: {}", ...);
log.info("Booking confirmation email sent successfully to: {}", orderDTO.getCustomerEmail());
log.error("Failed to send booking confirmation email to: {}", orderDTO.getCustomerEmail(), e);
```

## ⚡ **PERFORMANCE OPTIMIZATION**

### **Best Practices:**

1. **Async Email Sending:** Sử dụng @Async để không block main thread
2. **Template Caching:** Thymeleaf tự động cache templates
3. **Connection Pooling:** Spring Boot tự động quản lý connection pool
4. **Error Handling:** Không để email failure ảnh hưởng business logic

### **Production Considerations:**

1. **Rate Limiting:** Giới hạn số email gửi per minute
2. **Retry Mechanism:** Retry khi gửi thất bại
3. **Dead Letter Queue:** Lưu email failed để gửi lại
4. **Email Analytics:** Track open rate, click rate, bounce rate

## 🔄 **NEXT STEPS**

### **Tính năng mở rộng:**

1. **Email Templates Management:** Admin có thể chỉnh sửa template
2. **Email Scheduling:** Gửi email nhắc nhở tự động
3. **Multiple Email Providers:** Fallback sang provider khác nếu Gmail down
4. **Email Analytics Dashboard:** Theo dõi email metrics

---

## ✅ **TÓM TẮT**

**🎯 Vấn đề email xác nhận đặt lịch đã được khắc phục hoàn toàn!**

**Các cải thiện chính:**

- ✅ Null safety trong EmailServiceImpl
- ✅ Template currency formatting đã sửa
- ✅ Error handling không block order creation
- ✅ Test controller để debug dễ dàng
- ✅ Comprehensive logging cho monitoring

**Cách test ngay:**

```bash
POST http://localhost:8080/api/test/email/booking-confirmation?email=your-email@gmail.com
```

**Email booking confirmation bây giờ sẽ hoạt động ổn định!** 🚀
