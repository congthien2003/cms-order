# ReusableDialog Component - Hướng dẫn sử dụng

Component `ReusableDialog` là một wrapper tái sử dụng cho Dialog của Shadcn, cung cấp các tính năng linh hoạt và dễ sử dụng.

## Tính năng chính

- ✅ Header với title và description
- ✅ Nút close (X) ở góc phải header
- ✅ Body tùy chỉnh với children
- ✅ Footer với các nút linh hoạt
- ✅ Hỗ trợ loading state
- ✅ Validation và disable state
- ✅ Nhiều kích thước dialog
- ✅ Custom button variants

## Cách sử dụng cơ bản

### Import component

```tsx
import ReusableDialog from '@/components/ui/dialog/ReusableDialog';
```

### Sử dụng đơn giản

```tsx
import React, { useState } from 'react';
import ReusableDialog from '@/components/ui/dialog/ReusableDialog';
import Button from '@/components/ui/button/button';

const MyComponent = () => {
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    console.log('Form submitted');
    setOpen(false);
  };

  const handleClose = () => {
    console.log('Dialog closed');
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>

      <ReusableDialog
        open={open}
        onOpenChange={setOpen}
        title="My Dialog"
        description="This is a description"
        isClose={true}
        isSubmit={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
      >
        <div>
          <p>Your dialog content goes here</p>
        </div>
      </ReusableDialog>
    </>
  );
};
```

## Props

### Required Props

| Prop           | Type                      | Description                 |
| -------------- | ------------------------- | --------------------------- |
| `open`         | `boolean`                 | Trạng thái mở/đóng dialog   |
| `onOpenChange` | `(open: boolean) => void` | Callback khi dialog đóng/mở |
| `title`        | `string`                  | Tiêu đề dialog              |
| `children`     | `React.ReactNode`         | Nội dung chính của dialog   |

### Optional Props

| Prop              | Type                                     | Default     | Description                               |
| ----------------- | ---------------------------------------- | ----------- | ----------------------------------------- |
| `description`     | `string`                                 | -           | Mô tả dialog                              |
| `isClose`         | `boolean`                                | `true`      | Có hiển thị nút Close/Cancel không        |
| `closeText`       | `string`                                 | `'Cancel'`  | Text cho nút Close/Cancel                 |
| `onClose`         | `() => void`                             | -           | Callback khi click nút Close/Cancel       |
| `isSubmit`        | `boolean`                                | `false`     | Có hiển thị nút Submit không              |
| `submitText`      | `string`                                 | `'Submit'`  | Text cho nút Submit                       |
| `onSubmit`        | `() => void`                             | -           | Callback khi click nút Submit             |
| `submitDisabled`  | `boolean`                                | `false`     | Disable nút Submit                        |
| `submitLoading`   | `boolean`                                | `false`     | Loading state cho nút Submit              |
| `submitVariant`   | `ButtonVariants`                         | `'default'` | Variant cho nút Submit                    |
| `closeVariant`    | `ButtonVariants`                         | `'outline'` | Variant cho nút Close                     |
| `size`            | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'`      | Kích thước dialog                         |
| `className`       | `string`                                 | `''`        | Custom className cho dialog content       |
| `showCloseButton` | `boolean`                                | `true`      | Có hiển thị nút X ở góc phải header không |

## Kích thước Dialog

| Size   | Max Width |
| ------ | --------- |
| `sm`   | 425px     |
| `md`   | 600px     |
| `lg`   | 800px     |
| `xl`   | 1000px    |
| `full` | 95vw      |

## Ví dụ sử dụng

### 1. Dialog với form

```tsx
const [open, setOpen] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '' });
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await api.saveData(formData);
    setOpen(false);
    showSuccess('Data saved successfully!');
  } catch (error) {
    showError('Failed to save data');
  } finally {
    setLoading(false);
  }
};

<ReusableDialog
  open={open}
  onOpenChange={setOpen}
  title="Edit Profile"
  description="Update your profile information"
  isClose={true}
  isSubmit={true}
  submitText="Save Changes"
  submitLoading={loading}
  submitDisabled={!formData.name || !formData.email}
  onClose={() => setFormData({ name: '', email: '' })}
  onSubmit={handleSubmit}
  size="lg"
>
  <div className="space-y-4">
    <div>
      <label className="text-sm font-medium">Name</label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full mt-1 px-3 py-2 border rounded-md"
      />
    </div>
    <div>
      <label className="text-sm font-medium">Email</label>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full mt-1 px-3 py-2 border rounded-md"
      />
    </div>
  </div>
</ReusableDialog>;
```

### 2. Dialog xác nhận

```tsx
const [confirmOpen, setConfirmOpen] = useState(false);

const handleDelete = () => {
  // Xử lý xóa
  setConfirmOpen(false);
  showSuccess('Item deleted successfully!');
};

<ReusableDialog
  open={confirmOpen}
  onOpenChange={setConfirmOpen}
  title="Confirm Delete"
  description="Are you sure you want to delete this item?"
  isClose={true}
  isSubmit={true}
  closeText="Cancel"
  submitText="Delete"
  submitVariant="destructive"
  onClose={() => setConfirmOpen(false)}
  onSubmit={handleDelete}
  size="sm"
>
  <div className="text-center py-4">
    <p>This action cannot be undone.</p>
  </div>
</ReusableDialog>;
```

### 3. Dialog chỉ đọc

```tsx
<ReusableDialog
  open={open}
  onOpenChange={setOpen}
  title="User Details"
  isClose={true}
  isSubmit={false}
  closeText="Close"
  size="md"
>
  <div className="space-y-3">
    <div>
      <span className="font-medium">Name:</span> John Doe
    </div>
    <div>
      <span className="font-medium">Email:</span> john@example.com
    </div>
    <div>
      <span className="font-medium">Role:</span> Admin
    </div>
  </div>
</ReusableDialog>
```

### 4. Dialog không có nút close

```tsx
<ReusableDialog
  open={open}
  onOpenChange={setOpen}
  title="Processing..."
  description="Please wait while we process your request"
  isClose={false}
  isSubmit={false}
  showCloseButton={false}
  size="sm"
>
  <div className="text-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
    <p className="mt-2">Processing your request...</p>
  </div>
</ReusableDialog>
```

## Best Practices

1. **Sử dụng loading state** cho các thao tác async
2. **Validate form** trước khi enable submit button
3. **Xử lý lỗi** và hiển thị thông báo phù hợp
4. **Reset form data** khi đóng dialog
5. **Sử dụng kích thước phù hợp** với nội dung

## Integration với Toast

Component này hoạt động tốt với toast helper đã tạo:

```tsx
import { showSuccess, showError, showInfo } from '@/lib/toast';

const handleSubmit = async () => {
  try {
    await api.saveData(data);
    setOpen(false);
    showSuccess('Data saved successfully!');
  } catch (error) {
    showError('Failed to save data');
  }
};

const handleClose = () => {
  setOpen(false);
  showInfo('Dialog closed');
};
```
