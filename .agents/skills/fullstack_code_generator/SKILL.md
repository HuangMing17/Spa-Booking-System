---
name: fullstack_code_generator
description: Tự động sinh code CRUD toàn stack (API + Web + Mobile) cho VieNHoldings PMS
---

# Fullstack Code Generator (🚀 Core Automation Skill)

## Vai Trò
Bạn là **Code Generator Engine** — skill quan trọng nhất để tăng tốc phát triển. Khi nhận định nghĩa một Entity, bạn tự động sinh ra code cho TOÀN BỘ stack: Backend (.NET), Frontend (React), Mobile (React Native), và Database Migration.

## Mục Đích
Giải quyết vấn đề **70% code PMS là CRUD lặp lại** — giúp developer tập trung vào logic nghiệp vụ phức tạp thay vì viết boilerplate.

## Quy Trình Hoạt Động

### Input: Entity Definition
Khi user yêu cầu tạo module mới, bạn cần thu thập:

```yaml
Entity: Room
DisplayName: "Phòng"
Module: Property
ParentEntity: House  # FK relationship

Fields:
  - name: name
    type: string
    required: true
    maxLength: 100
    label: "Tên phòng"
    
  - name: house_id
    type: uuid
    required: true
    relation: House
    label: "Toà nhà"
    
  - name: floor_id
    type: uuid
    required: false
    relation: Floor
    label: "Tầng"
    
  - name: rental_price
    type: decimal
    required: true
    label: "Giá thuê"
    format: "currency"
    
  - name: area
    type: decimal
    required: false
    label: "Diện tích (m²)"
    
  - name: max_occupants
    type: int
    required: false
    label: "Số khách tối đa"
    
  - name: status
    type: enum
    values: [VACANT, OCCUPIED, MAINTENANCE, RESERVED]
    default: VACANT
    label: "Trạng thái"
    
  - name: is_active
    type: boolean
    default: true
    label: "Đang hoạt động"

Features:
  - list        # Danh sách + phân trang + filter
  - create      # Form tạo mới
  - update      # Form cập nhật
  - delete      # Xoá mềm (soft delete)
  - export      # Xuất Excel
  - import      # Nhập từ Excel
  - search      # Tìm kiếm text
```

### Output: Code Toàn Stack

#### 1. Backend (.NET Core)

**a. Entity (Domain Layer)**
```csharp
// VieNHoldings.Domain/Entities/Room.cs
public class Room : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public Guid HouseId { get; set; }
    public Guid? FloorId { get; set; }
    public decimal RentalPrice { get; set; }
    public decimal? Area { get; set; }
    public int? MaxOccupants { get; set; }
    public RoomStatus Status { get; set; } = RoomStatus.Vacant;
    public bool IsActive { get; set; } = true;

    // Navigation
    public House House { get; set; } = null!;
    public Floor? Floor { get; set; }
    public ICollection<Contract> Contracts { get; set; } = new List<Contract>();
}
```

**b. DTOs (Application Layer)**
```csharp
// RoomDto.cs - Response
public record RoomDto(
    Guid Id, string Name, Guid HouseId, string HouseName,
    Guid? FloorId, string? FloorName, decimal RentalPrice,
    decimal? Area, int? MaxOccupants, string Status, bool IsActive);

// CreateRoomRequest.cs - Input
public record CreateRoomRequest(
    string Name, Guid HouseId, Guid? FloorId,
    decimal RentalPrice, decimal? Area, int? MaxOccupants);
```

**c. Controller (API Layer)**
```csharp
[ApiController]
[Route("api/v1/rooms")]
[Authorize]
public class RoomsController : ControllerBase
{
    [HttpGet]
    public async Task<ApiResponse<PagedResult<RoomDto>>> GetAll([FromQuery] RoomFilterParams filter);
    
    [HttpGet("{id:guid}")]
    public async Task<ApiResponse<RoomDto>> GetById(Guid id);
    
    [HttpPost]
    public async Task<ApiResponse<RoomDto>> Create([FromBody] CreateRoomRequest request);
    
    [HttpPut("{id:guid}")]
    public async Task<ApiResponse<RoomDto>> Update(Guid id, [FromBody] UpdateRoomRequest request);
    
    [HttpDelete("{id:guid}")]
    public async Task<ApiResponse<bool>> Delete(Guid id);
    
    [HttpGet("export")]
    public async Task<FileResult> ExportExcel([FromQuery] RoomFilterParams filter);
    
    [HttpPost("import")]
    public async Task<ApiResponse<ImportResult>> ImportExcel(IFormFile file);
}
```

#### 2. Frontend (ReactJS + TypeScript)

**a. Types**
```typescript
// types/room.ts
export interface Room {
  id: string;
  name: string;
  houseId: string;
  houseName: string;
  floorId?: string;
  floorName?: string;
  rentalPrice: number;
  area?: number;
  maxOccupants?: number;
  status: 'VACANT' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
  isActive: boolean;
}

export interface CreateRoomRequest {
  name: string;
  houseId: string;
  floorId?: string;
  rentalPrice: number;
  area?: number;
  maxOccupants?: number;
}
```

**b. API Service**
```typescript
// services/roomService.ts
export const roomService = {
  getAll: (params: FilterParams) => api.get<PagedResult<Room>>('/rooms', { params }),
  getById: (id: string) => api.get<Room>(`/rooms/${id}`),
  create: (data: CreateRoomRequest) => api.post<Room>('/rooms', data),
  update: (id: string, data: UpdateRoomRequest) => api.put<Room>(`/rooms/${id}`, data),
  delete: (id: string) => api.delete(`/rooms/${id}`),
  exportExcel: (params: FilterParams) => api.get('/rooms/export', { params, responseType: 'blob' }),
};
```

**c. Page Component**
```typescript
// pages/rooms/RoomsPage.tsx
// Gen ra: Table với columns, Filter bar, Create/Edit modal, Delete confirmation
// Sử dụng: Shadcn/UI DataTable, Dialog, Form, Input, Select
```

#### 3. Mobile (React Native)

```typescript
// screens/rooms/RoomListScreen.tsx
// Gen ra: FlatList với RoomCard, Pull-to-refresh, Search bar
// screens/rooms/RoomDetailScreen.tsx
// Gen ra: Chi tiết phòng, button actions
```

#### 4. Database Migration

```sql
-- migrations/V20260207__create_rooms.sql
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    name VARCHAR(100) NOT NULL,
    house_id UUID NOT NULL REFERENCES houses(id),
    floor_id UUID REFERENCES floors(id),
    rental_price NUMERIC(18,2) NOT NULL DEFAULT 0,
    area NUMERIC(10,2),
    max_occupants INT,
    status VARCHAR(20) NOT NULL DEFAULT 'VACANT',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    -- Audit columns
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID REFERENCES accounts(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES accounts(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rooms_house ON rooms(house_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_rooms_customer ON rooms(customer_id) WHERE is_deleted = FALSE;
```

## Checklist Sau Khi Gen Code

- [ ] Review Entity relationships (FK đúng chưa?)
- [ ] Validation rules đầy đủ (required, maxLength, range)
- [ ] Multi-tenancy filter (customer_id) đã áp dụng
- [ ] API endpoint naming chuẩn RESTful
- [ ] TypeScript types khớp với DTO
- [ ] UI labels dùng tiếng Việt
- [ ] Responsive design (Desktop + Mobile)
