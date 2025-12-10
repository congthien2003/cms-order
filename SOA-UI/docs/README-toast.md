# Toast Helper - Hướng dẫn sử dụng

File `toast.ts` cung cấp các helper functions để dễ dàng hiển thị toast notifications trong ứng dụng React sử dụng `react-hot-toast`.

## Cài đặt

Đảm bảo đã cài đặt `react-hot-toast`:

```bash
npm install react-hot-toast
```

## Cấu hình Toaster

Thêm `Toaster` component vào `App.tsx` hoặc layout chính:

```tsx
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div>
      {/* Your app content */}
      <Toaster />
    </div>
  );
}
```

## Cách sử dụng

### 1. Import helper functions

```tsx
import {
  ToastHelper,
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from '@/lib/toast';
```

### 2. Sử dụng trong component

#### Cách 1: Sử dụng class static methods

```tsx
// Success toast
ToastHelper.success('Thao tác thành công!');

// Error toast
ToastHelper.error('Có lỗi xảy ra!');

// Warning toast
ToastHelper.warning('Cảnh báo!');

// Info toast
ToastHelper.info('Thông tin mới!');
```

#### Cách 2: Sử dụng function riêng lẻ

```tsx
// Success toast
showSuccess('Thao tác thành công!');

// Error toast
showError('Có lỗi xảy ra!');

// Warning toast
showWarning('Cảnh báo!');

// Info toast
showInfo('Thông tin mới!');
```

### 3. Toast với tùy chọn tùy chỉnh

```tsx
showSuccess('Thao tác thành công!', {
  duration: 6000,
  position: 'bottom-center',
  style: {
    background: '#059669',
    color: '#ffffff',
    fontSize: '16px',
  },
});
```

### 4. Loading toast

```tsx
const loadingId = showLoading('Đang xử lý...');

// Sau khi hoàn thành
setTimeout(() => {
  dismissToast(loadingId);
  showSuccess('Hoàn thành!');
}, 2000);
```

### 5. Dismiss toast

```tsx
// Dismiss toast theo ID
dismissToast(toastId);

// Dismiss tất cả toast
dismissAllToasts();
```

## Cấu hình mặc định

- **Position**: `top-right`
- **Duration**:
  - Success: 4000ms
  - Error: 5000ms
  - Warning: 4000ms
  - Info: 4000ms
- **Colors**:
  - Success: Green (#10b981)
  - Error: Red (#ef4444)
  - Warning: Orange (#f59e0b)
  - Info: Blue (#3b82f6)

## Tùy chọn có thể override

Bạn có thể override bất kỳ tùy chọn nào của `react-hot-toast`:

```tsx
showSuccess('Message', {
  duration: 10000,
  position: 'bottom-left',
  style: {
    background: '#000',
    color: '#fff',
  },
  iconTheme: {
    primary: '#fff',
    secondary: '#000',
  },
});
```

## Ví dụ thực tế

```tsx
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast';

const handleSubmit = async (data: FormData) => {
  const loadingId = showLoading('Đang lưu dữ liệu...');

  try {
    await api.saveData(data);
    dismissToast(loadingId);
    showSuccess('Lưu dữ liệu thành công!');
  } catch (error) {
    dismissToast(loadingId);
    showError('Không thể lưu dữ liệu. Vui lòng thử lại!');
  }
};
```
