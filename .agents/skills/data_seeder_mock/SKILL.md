---
name: data_seeder_mock
description: Tự động tạo dữ liệu giả lập Việt Nam cho dev/test VieNHoldings PMS
---

# Data Seeder & Mock Generator

## Vai Trò
Bạn là **Data Engineer** chuyên tạo dữ liệu giả lập (seed data) cho dự án VieNHoldings PMS. Dữ liệu phải mang tính thực tế cao (tên người Việt, địa chỉ Việt Nam, số CCCD giả, giá phòng hợp lý) để phục vụ dev và testing.

## Mục Đích
- Developer cần data để test giao diện (Table, Chart, Form).
- QA cần data đa dạng để test edge cases.
- Demo cho stakeholder cần data trông thật.
- Mỗi lần reset DB, chạy 1 lệnh → có data sẵn.

## Cấu Trúc Data Seed

### 1. Lookup Data (Bắt buộc, chạy đầu tiên)

```sql
-- Tỉnh/Thành phố (63 tỉnh)
INSERT INTO provinces (id, name, code) VALUES
('...', 'TP. Hồ Chí Minh', 'HCM'),
('...', 'Hà Nội', 'HN'),
('...', 'Đà Nẵng', 'DN');

-- Quận/Huyện (phổ biến)
INSERT INTO districts (id, province_id, name) VALUES
('...', '{hcm_id}', 'Quận 1'),
('...', '{hcm_id}', 'Quận 7'),
('...', '{hcm_id}', 'Quận Bình Thạnh'),
('...', '{hcm_id}', 'TP. Thủ Đức');

-- Trạng thái phòng
INSERT INTO room_statuses (id, name, code) VALUES
('...', 'Phòng trống', 'VACANT'),
('...', 'Đang thuê', 'OCCUPIED'),
('...', 'Đang cọc', 'RESERVED'),
('...', 'Bảo trì', 'MAINTENANCE');

-- Trạng thái hợp đồng
INSERT INTO contract_statuses (id, name, code) VALUES
('...', 'Active', 'ACTIVE'),
('...', 'Sắp hết hạn', 'EXPIRING'),
('...', 'Đã thanh lý', 'TERMINATED'),
('...', 'Đang gia hạn', 'EXTENDING');

-- Loại dịch vụ
INSERT INTO service_types (id, name, code) VALUES
('...', 'Tiền nhà', 'RENT'),
('...', 'Tiền điện', 'ELECTRIC'),
('...', 'Tiền nước', 'WATER'),
('...', 'Tiền internet', 'INTERNET'),
('...', 'Tiền rác', 'GARBAGE'),
('...', 'Tiền giữ xe', 'PARKING'),
('...', 'Tiền vệ sinh', 'CLEANING');
```

### 2. Demo Data (Cho 1 Customer mẫu)

#### Customer (Chủ nhà)
```json
{
  "name": "Công ty TNHH BĐS Sunrise",
  "email": "admin@sunrise-bds.vn",
  "phone": "0912345678",
  "address": "123 Nguyễn Huệ, Q.1, TP.HCM"
}
```

#### Toà Nhà (3 toà)
```json
[
  {
    "name": "Toà Sunrise A",
    "address": "45 Lý Thường Kiệt, Q.10, TP.HCM",
    "floors": 5,
    "rooms_per_floor": 8,
    "price_range": "3000000-5000000"
  },
  {
    "name": "Toà Sunrise B",
    "address": "78 Cách Mạng Tháng 8, Q.3, TP.HCM",
    "floors": 4,
    "rooms_per_floor": 6,
    "price_range": "4000000-7000000"
  },
  {
    "name": "KTX Sunrise (Sleepbox)",
    "address": "12 Nguyễn Thị Minh Khai, Q.1, TP.HCM",
    "floors": 3,
    "rooms_per_floor": 4,
    "beds_per_room": 6,
    "price_range": "1500000-2500000"
  }
]
```

#### Phòng (Tự sinh từ Toà nhà)
```
Toà A: P101-P108, P201-P208, ..., P501-P508 (40 phòng)
Toà B: P101-P106, P201-P206, ..., P401-P406 (24 phòng)
KTX:   P101-P104, ... (12 phòng × 6 giường = 72 giường)

Tổng: ~130 đơn vị cho thuê
```

#### Dịch Vụ
```json
[
  { "name": "Tiền điện", "type": "METER", "unitPrice": 3500, "unit": "kWh" },
  { "name": "Tiền nước", "type": "METER", "unitPrice": 15000, "unit": "m³" },
  { "name": "Internet", "type": "FIXED", "unitPrice": 100000, "unit": "tháng" },
  { "name": "Rác", "type": "FIXED", "unitPrice": 20000, "unit": "tháng" },
  { "name": "Gửi xe máy", "type": "PER_VEHICLE", "unitPrice": 100000, "unit": "xe/tháng" },
  { "name": "Gửi ô tô", "type": "PER_VEHICLE", "unitPrice": 1500000, "unit": "xe/tháng" },
  { "name": "Vệ sinh", "type": "FIXED", "unitPrice": 50000, "unit": "tháng" }
]
```

#### Khách Thuê (Tên Việt Nam thực tế)
```json
[
  { "name": "Nguyễn Văn An", "phone": "0901234567", "cccd": "079123456789", "gender": "Nam", "birthYear": 1995 },
  { "name": "Trần Thị Bích", "phone": "0912345678", "cccd": "079234567890", "gender": "Nữ", "birthYear": 1998 },
  { "name": "Lê Hoàng Dũng", "phone": "0923456789", "cccd": "079345678901", "gender": "Nam", "birthYear": 1990 },
  { "name": "Phạm Minh Châu", "phone": "0934567890", "cccd": "079456789012", "gender": "Nữ", "birthYear": 1997 },
  { "name": "Hoàng Đức Thắng", "phone": "0945678901", "cccd": "079567890123", "gender": "Nam", "birthYear": 1993 },
  { "name": "Vũ Thị Ngọc Lan", "phone": "0956789012", "cccd": "079678901234", "gender": "Nữ", "birthYear": 1996 }
  // ... thêm 50-100 khách nữa
]
```

#### Hợp Đồng (70% phòng đang có khách)
```
- 70% phòng: Hợp đồng ACTIVE (đang thuê)
- 10% phòng: Hợp đồng EXPIRING (sắp hết hạn trong 30 ngày)
- 10% phòng: VACANT (trống)
- 10% phòng: RESERVED (đang cọc)
Mỗi HĐ: chu kỳ 1 tháng hoặc 3 tháng, bắt đầu ngẫu nhiên trong 6 tháng gần đây.
```

#### Chỉ Số Điện Nước (3 tháng gần nhất)
```
Mỗi phòng đang thuê:
- Điện: Chỉ số tăng ngẫu nhiên 80-200 kWh/tháng
- Nước: Chỉ số tăng ngẫu nhiên 3-8 m³/tháng
```

#### Hoá Đơn (3 tháng gần nhất)
```
Mỗi phòng đang thuê, mỗi tháng:
- Tiền nhà: Theo giá phòng
- Tiền điện: Theo chỉ số
- Tiền nước: Theo chỉ số
- Dịch vụ khác: Theo phòng

Trạng thái:
- Tháng trước: 90% đã thanh toán, 10% còn nợ
- Tháng này: 40% đã thanh toán, 60% chưa thanh toán
```

### 3. Cách Chạy Seed

```bash
# Chạy toàn bộ seed data
dotnet run --project tools/DataSeeder

# Hoặc script SQL
psql -U postgres -d vienholdings -f databases/seeds/01_lookup.sql
psql -U postgres -d vienholdings -f databases/seeds/02_demo_data.sql
```

## Lưu Ý Quan Trọng
- CCCD, SĐT, Email trong seed data phải là **GIẢ** (không trùng người thật).
- Giá phòng, giá dịch vụ phải **hợp lý** với thị trường VN (3-7 triệu/phòng trọ).
- Data seed KHÔNG được chạy trên production.
- Luôn có script `reset_seed.sql` để xoá sạch data test.
