# API Client Setup

## Tổng quan
Đã setup axios instance với các tính năng:
- Tự động gắn token vào header
- Xử lý lỗi HTTP và redirect
- Helper functions tiện lợi

## Cách sử dụng

### 1. Sử dụng helper functions (Khuyến nghị)
```typescript
import { api } from '@/lib/api';

// GET request
const users = await api.get<User[]>('/users');

// POST request
const newUser = await api.post<User>('/users', userData);

// PUT request
const updatedUser = await api.put<User>(`/users/${id}`, userData);

// DELETE request
await api.delete(`/users/${id}`);
```

### 2. Sử dụng trực tiếp axios instance
```typescript
import { apiClient } from '@/lib/api';

const response = await apiClient.get('/users');
```

## Tính năng

### Auto Token Injection
- Token được lấy từ `localStorage.getItem('accessToken')`
- Tự động gắn vào header: `Authorization: Bearer {token}`

### Error Handling & Redirect
- **401 Unauthorized**: Xóa token → redirect `/login`
- **403 Forbidden**: Redirect `/403`
- **404 Not Found**: Redirect `/404`
- **500 Server Error**: Redirect `/error`

### Configuration
- Base URL: `VITE_API_BASE_URL` hoặc `http://localhost:3000/api`
- Timeout: 10 giây
- Content-Type: `application/json`

## Environment Variables
Tạo file `.env`:
```env
VITE_API_BASE_URL=http://your-api-domain.com/api
```

## Ví dụ Service
```typescript
import { api } from '@/lib/api';
import type { User } from '@/types/user/entity/user';

class UserService {
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  }
}
```
