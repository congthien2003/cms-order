# ReactJS Admin Dashboard

## 📋 Tổng quan dự án

Đây là một ứng dụng Admin Dashboard được xây dựng bằng React 19, TypeScript và Vite. Dự án sử dụng kiến trúc component-based với các tính năng quản lý người dùng và vai trò (roles).

## 🚀 Công nghệ sử dụng

### Core Technologies

- **React 19** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool và dev server
- **React Router DOM** - Client-side routing

### UI & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

### Form & Validation

- **React Hook Form** - Form management
- **Zod** - Schema validation
- **@hookform/resolvers** - Form validation integration

### State Management & API

- **Zustand** - Lightweight state management
- **Axios** - HTTP client
- **React Context** - Authentication state

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **TypeScript ESLint** - TypeScript linting

## 📁 Cấu trúc dự án

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Layout components (AdminLayout, Sidebar)
│   └── ui/              # Base UI components (Button, Dialog, Table, etc.)
├── features/            # Feature-based modules
│   ├── users/           # User management feature
│   │   ├── components/  # User-specific components
│   │   ├── hooks/       # Custom hooks for user operations
│   │   └── schema/      # Validation schemas
│   └── roles/           # Role management feature
│       ├── components/  # Role-specific components
│       ├── hooks/       # Custom hooks for role operations
│       └── schema/      # Validation schemas
├── models/              # TypeScript type definitions
│   ├── auth/            # Authentication types
│   ├── user/            # User-related types
│   ├── role/            # Role-related types
│   └── common/          # Shared types
├── pages/               # Page components
│   ├── users/           # User management page
│   ├── roles/           # Role management page
│   └── error/           # Error page
├── providers/           # Context providers
│   └── authProvider/    # Authentication context
├── services/            # API service classes
│   ├── userService.ts   # User API operations
│   ├── roleService.ts   # Role API operations
│   └── authService.ts   # Authentication API
├── lib/                 # Utility libraries
│   ├── api.ts          # API client wrapper
│   ├── axios.ts        # Axios configuration
│   └── utils.ts        # Helper functions
├── router/              # Routing configuration
└── stores/              # Global state stores
```

## 🏗️ Kiến trúc dự án

### 1. Feature-Based Architecture

Dự án được tổ chức theo từng feature (users, roles) với mỗi feature có:

- **Components**: UI components riêng cho feature
- **Hooks**: Custom hooks để quản lý state và logic
- **Schema**: Validation schemas cho forms
- **Utils**: Utility functions (nếu cần)

### 2. Layered Architecture

```
Pages (UI Layer)
    ↓
Features (Business Logic)
    ↓
Services (API Layer)
    ↓
Models (Data Types)
```

### 3. Component Structure

- **Layout Components**: AdminLayout, Sidebar
- **UI Components**: Reusable components (Button, Dialog, Table)
- **Feature Components**: Specific to business logic
- **Page Components**: Top-level page components

## 🔧 Cài đặt và chạy dự án

### Yêu cầu hệ thống

- Node.js >= 18
- npm hoặc yarn

### Cài đặt dependencies

```bash
npm install
```

### Chạy development server

```bash
npm run dev
```

### Build cho production

```bash
npm run build
```

### Linting và formatting

```bash
npm run lint
```

## 📱 Tính năng chính

### 1. User Management

- ✅ Hiển thị danh sách users với pagination
- ✅ Tạo user mới
- ✅ Chỉnh sửa thông tin user
- ✅ Kích hoạt/vô hiệu hóa user
- ✅ Gán roles cho user
- ✅ Validation form với Zod

### 2. Role Management

- ✅ Hiển thị danh sách roles với pagination
- ✅ Tạo role mới
- ✅ Chỉnh sửa role
- ✅ Xóa role
- ✅ Quản lý trạng thái Active/Inactive

### 3. Authentication

- ✅ Context-based authentication
- ✅ Token management
- ✅ Protected routes
- ✅ Login/logout functionality

### 4. UI/UX Features

- ✅ Responsive design
- ✅ Dark/Light theme support
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling
- ✅ Confirmation dialogs

## 🎨 Design System

### Color Palette

- Primary colors được định nghĩa trong Tailwind config
- Consistent color usage across components
- Dark mode support

### Typography

- Font system với các variant khác nhau
- Consistent text sizing và spacing

### Components

- Reusable UI components với variants
- Consistent spacing và styling
- Accessibility support

## 🔌 API Integration

### Service Layer Pattern

Mỗi feature có service class riêng để handle API calls:

- `UserService`: User-related API operations
- `RoleService`: Role-related API operations
- `AuthService`: Authentication API operations

### API Client

- Axios-based API client với interceptors
- Error handling và response transformation
- Type-safe API calls

## 🧪 Code Quality

### TypeScript

- Strict type checking
- Interface definitions cho tất cả data models
- Type-safe API calls và component props

### Linting & Formatting

- ESLint configuration
- Prettier integration
- Git hooks với Husky

### Best Practices

- Component composition
- Custom hooks cho business logic
- Separation of concerns
- Error boundaries

## 🚀 Deployment

### Build Process

```bash
npm run build
```

### Environment Variables

Tạo file `.env` với các biến môi trường cần thiết:

```
VITE_API_BASE_URL=your_api_url
VITE_APP_NAME=Admin Dashboard
```

## 📚 Hướng dẫn cho Developer mới

### 1. Setup môi trường

1. Clone repository
2. Cài đặt dependencies: `npm install`
3. Chạy dev server: `npm run dev`

### 2. Hiểu cấu trúc code

1. Đọc file này (README.md)
2. Xem cấu trúc folder trong `src/`
3. Kiểm tra `package.json` để hiểu dependencies

### 3. Thêm tính năng mới

1. Tạo feature folder trong `src/features/`
2. Tạo components, hooks, schema
3. Thêm service class trong `src/services/`
4. Định nghĩa types trong `src/models/`
5. Tạo page component trong `src/pages/`

### 4. Coding Standards

- Sử dụng TypeScript cho tất cả files
- Follow naming conventions
- Viết comments cho complex logic
- Sử dụng custom hooks cho business logic
- Component composition over inheritance

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes với conventional commits
4. Push và tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

---

Sabo
