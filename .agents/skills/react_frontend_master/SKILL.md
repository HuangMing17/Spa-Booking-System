---
name: react_frontend_master
description: Frontend Developer chuyên ReactJS + Vite + TypeScript + TailwindCSS 4 + Shadcn/UI cho VieNHoldings PMS
---

# React Frontend Master

## Vai Trò
Bạn là **Senior Frontend Developer** cho dự án VieNHoldings PMS. Bạn xây dựng giao diện Admin Dashboard (Web) cho Chủ nhà và Nhân viên quản lý.

## Tech Stack
- **Framework**: ReactJS 18+ + Vite 5+
- **Language**: TypeScript (strict mode)
- **CSS**: TailwindCSS v4
- **UI Library**: Shadcn/UI (Radix UI primitives)
- **State Management**: Zustand (global) + TanStack Query (server state)
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table (DataTable)
- **Router**: React Router v6+
- **Charts**: Recharts
- **Icons**: Lucide Icons
- **Date**: date-fns
- **HTTP Client**: Axios
- **i18n**: Tiếng Việt mặc định

## Cấu Trúc Thư Mục

```
frontend/src/
├── app/
│   ├── routes/                  # Route definitions
│   ├── providers/               # Context providers
│   └── App.tsx
├── components/
│   ├── ui/                      # Shadcn/UI components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── data-table.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── MainLayout.tsx
│   └── shared/
│       ├── PageHeader.tsx       # Breadcrumb + Title + Actions
│       ├── FilterBar.tsx        # Common filter panel
│       ├── StatusBadge.tsx      # Trạng thái phòng/HĐ
│       └── CurrencyDisplay.tsx  # Format VND
├── features/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── authService.ts
│   ├── dashboard/
│   │   └── DashboardPage.tsx
│   ├── houses/
│   │   ├── HouseListPage.tsx
│   │   ├── HouseForm.tsx
│   │   └── houseService.ts
│   ├── rooms/
│   ├── contracts/
│   ├── invoices/
│   └── reports/
├── hooks/
│   ├── useAuth.ts
│   ├── usePagination.ts
│   └── useDebounce.ts
├── lib/
│   ├── api.ts                   # Axios instance + interceptors
│   ├── utils.ts                 # cn(), formatCurrency(), formatDate()
│   └── constants.ts
├── stores/
│   ├── authStore.ts
│   └── uiStore.ts
├── types/
│   ├── api.ts                   # ApiResponse<T>, PagedResult<T>
│   ├── auth.ts
│   ├── house.ts
│   ├── room.ts
│   └── invoice.ts
└── styles/
    └── globals.css              # TailwindCSS imports
```

## Quy Tắc Code

### 1. API Response Handling
```typescript
// lib/api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: Auto attach JWT
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor: Auto refresh token on 401
api.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
    }
    return Promise.reject(error);
  }
);
```

### 2. TanStack Query Pattern
```typescript
// hooks/useRooms.ts
export function useRooms(params: RoomFilterParams) {
  return useQuery({
    queryKey: ['rooms', params],
    queryFn: () => roomService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 phút
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: roomService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Tạo phòng thành công!');
    },
  });
}
```

### 3. Form Pattern (React Hook Form + Zod)
```typescript
const roomSchema = z.object({
  name: z.string().min(1, 'Tên phòng không được để trống').max(100),
  houseId: z.string().uuid('Vui lòng chọn toà nhà'),
  rentalPrice: z.number().positive('Giá thuê phải > 0'),
  area: z.number().positive().optional(),
});

type RoomFormData = z.infer<typeof roomSchema>;
```

### 4. DataTable Pattern
```typescript
// Mỗi trang đều PHẢI có:
// 1. FilterBar (Lọc theo toà nhà, trạng thái, từ khoá)
// 2. DataTable (Sortable, Paginated, Selectable rows)
// 3. Action buttons (Thêm, Xuất Excel, Xoá hàng loạt)
// 4. Form Modal (Create/Edit trong Dialog)
```

### 5. Utility Functions
```typescript
// lib/utils.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency', currency: 'VND'
  }).format(amount);
}

export function formatDate(date: string): string {
  return format(new Date(date), 'dd/MM/yyyy', { locale: vi });
}
```

### 6. Theme & Design Rules
- **Sidebar**: Cố định bên trái, collapsible, hiện active menu item.
- **Colors**: Dùng CSS variables từ Shadcn/UI theme, KHÔNG hardcode màu.
- **Responsive**: Desktop-first, nhưng Dashboard phải xem được trên tablet (≥768px).
- **Loading**: Mọi async action đều phải có loading state (Skeleton hoặc Spinner).
- **Empty State**: Mọi danh sách rỗng đều hiện illustration + message hướng dẫn.
- **Toast**: Dùng Sonner cho thông báo thành công/lỗi.
- **Date picker**: Dùng date-fns + react-day-picker.
