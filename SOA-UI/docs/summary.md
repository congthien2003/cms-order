# ReactJS Admin Dashboard - Project Summary

**Project Name**: e-Code-base-base-react  
**Type**: Admin Dashboard Application  
**Status**: Development (Running on Vite)  
**Current Server**: http://localhost:3000/  
**Last Updated**: December 10, 2025

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture](#architecture)
5. [Key Features](#key-features)
6. [Data Flow](#data-flow)
7. [Authentication System](#authentication-system)
8. [API Integration](#api-integration)
9. [Component System](#component-system)
10. [Development Setup](#development-setup)
11. [Current TODOs](#current-todos)
12. [Code Quality Standards](#code-quality-standards)

---

## 📖 Project Overview

This is a **modern ReactJS Admin Dashboard** built with React 19, TypeScript, and Vite. It provides a complete user and role management system with a responsive, accessible UI.

### Key Characteristics

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7.1.3
- **Styling**: Tailwind CSS 4.1 with Radix UI components
- **Architecture**: Feature-based modular design
- **State Management**: React Context + Zustand
- **API Client**: Axios with interceptors
- **Form Handling**: React Hook Form + Zod validation

### Project Goals

- Provide a scalable admin dashboard template
- Implement best practices in React development
- Maintain clean, type-safe code
- Support user and role management features
- Ensure responsive, accessible UI

---

## 🚀 Technology Stack

### Core Technologies

| Technology           | Version | Purpose                 |
| -------------------- | ------- | ----------------------- |
| **React**            | 19.1.1  | UI Framework            |
| **TypeScript**       | ~5.8.3  | Type Safety             |
| **Vite**             | 7.1.2   | Build Tool & Dev Server |
| **React Router DOM** | 7.8.1   | Client-side Routing     |

### UI & Styling

| Technology                   | Version | Purpose                     |
| ---------------------------- | ------- | --------------------------- |
| **Tailwind CSS**             | 4.1.12  | Utility-first CSS Framework |
| **Radix UI**                 | Latest  | Headless UI Components      |
| **Lucide React**             | 0.540.0 | Icon Library                |
| **Class Variance Authority** | 0.7.1   | Component Variants          |

### Form & Validation

| Technology              | Version | Purpose                     |
| ----------------------- | ------- | --------------------------- |
| **React Hook Form**     | 7.62.0  | Form State Management       |
| **Zod**                 | 4.1.0   | Schema Validation           |
| **@hookform/resolvers** | 5.2.1   | Form Validation Integration |

### State Management & API

| Technology        | Version  | Purpose                      |
| ----------------- | -------- | ---------------------------- |
| **Zustand**       | (Latest) | Lightweight State Management |
| **Redux Toolkit** | 2.11.1   | Global State Management      |
| **React Redux**   | 9.2.0    | Redux Integration            |
| **Axios**         | Latest   | HTTP Client                  |
| **React Context** | Built-in | Authentication State         |

### Notifications & UX

| Technology          | Version | Purpose             |
| ------------------- | ------- | ------------------- |
| **React Hot Toast** | 2.6.0   | Toast Notifications |

### Development Tools

| Technology            | Version | Purpose            |
| --------------------- | ------- | ------------------ |
| **ESLint**            | 9.33.0  | Code Linting       |
| **Prettier**          | 3.6.2   | Code Formatting    |
| **Husky**             | 9.1.7   | Git Hooks          |
| **TypeScript ESLint** | 8.40.0  | TypeScript Linting |

---

## 📁 Project Structure

```
e-Code-base-base-react/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AdminLayout.tsx          # Main layout wrapper
│   │   │   ├── RootLayout.tsx           # Root layout
│   │   │   └── sidebar/
│   │   │       ├── Sidebar.tsx          # Navigation sidebar
│   │   │       ├── SidebarContext.ts    # Sidebar state context
│   │   │       ├── SidebarProvider.tsx  # Sidebar provider
│   │   │       └── useSidebar.ts        # Sidebar hook
│   │   ├── ui/
│   │   │   ├── button/
│   │   │   │   ├── button.tsx           # Base button component
│   │   │   │   ├── buttonVariant.ts     # Button variants
│   │   │   │   └── index.tsx
│   │   │   ├── dialog/
│   │   │   │   ├── ConfirmDialog.tsx    # Confirmation dialog
│   │   │   │   ├── CustomDialog.tsx     # Custom dialog
│   │   │   │   └── ReusableDialogExample.tsx
│   │   │   ├── typography/
│   │   │   │   ├── typography.tsx       # Typography component
│   │   │   │   ├── typographyVariant.ts # Typography variants
│   │   │   │   └── index.tsx
│   │   │   ├── loading/
│   │   │   │   └── GlobalLoading.tsx    # Global loading state
│   │   │   ├── pagination/
│   │   │   │   └── Pagination.tsx       # Pagination component
│   │   │   ├── empty-data/
│   │   │   │   └── empty-data.tsx       # Empty state component
│   │   │   ├── accordion.tsx            # Accordion component
│   │   │   ├── checkbox.tsx             # Checkbox component
│   │   │   ├── dialog.tsx               # Dialog component
│   │   │   ├── form.tsx                 # Form component
│   │   │   ├── input.tsx                # Input component
│   │   │   ├── label.tsx                # Label component
│   │   │   ├── page.tsx                 # Page wrapper component
│   │   │   └── table.tsx                # Table component
│   │   └── icons/
│   │       ├── EditIcon.tsx
│   │       ├── LockOpenIcon.tsx
│   │       └── index.ts
│   │
│   ├── features/
│   │   ├── users/
│   │   │   ├── components/
│   │   │   │   ├── UserTable.tsx        # User list table
│   │   │   │   └── formUserDialog.tsx   # User form dialog
│   │   │   ├── hooks/
│   │   │   │   └── useUser.ts           # User management hook
│   │   │   └── schema/
│   │   │       └── userSchema.ts        # User validation schema
│   │   │
│   │   └── roles/
│   │       ├── components/
│   │       │   ├── RoleTable.tsx        # Role list table
│   │       │   └── formRoleDialog.tsx   # Role form dialog
│   │       ├── hooks/
│   │       │   └── useRole.ts           # Role management hook
│   │       └── schema/
│   │           └── roleSchema.ts        # Role validation schema
│   │
│   ├── models/
│   │   ├── auth/
│   │   │   ├── request/
│   │   │   │   ├── loginRequest.ts
│   │   │   │   ├── registerRequest.ts
│   │   │   │   ├── forgotPasswordRequest.ts
│   │   │   │   └── resetPasswordRequest.ts
│   │   │   └── response/
│   │   │       ├── authResponse.ts
│   │   │       └── refreshTokenResponse.ts
│   │   │
│   │   ├── user/
│   │   │   ├── entity/
│   │   │   │   └── user.ts              # User entity type
│   │   │   ├── request/
│   │   │   │   ├── createUserRequest.ts
│   │   │   │   ├── updateUserRequest.ts
│   │   │   │   └── changePasswordRequest.ts
│   │   │   └── response/
│   │   │       ├── userListResponse.ts
│   │   │       └── userDetailResponse.ts
│   │   │
│   │   ├── role/
│   │   │   ├── entity/
│   │   │   │   └── role.ts              # Role entity type
│   │   │   ├── request/
│   │   │   │   ├── createRoleRequest.ts
│   │   │   │   └── updateRoleRequest.ts
│   │   │   └── response/
│   │   │       ├── roleResponse.ts
│   │   │       └── rolesListResponse.ts
│   │   │
│   │   ├── common/
│   │   │   ├── api.ts                   # Common API types
│   │   │   └── paginationParams.ts      # Pagination types
│   │   │
│   │   ├── auth.ts                      # Auth type exports
│   │   ├── user.ts                      # User type exports
│   │   └── role.ts                      # Role type exports
│   │
│   ├── pages/
│   │   ├── users/
│   │   │   └── index.tsx                # User management page
│   │   ├── roles/
│   │   │   └── index.tsx                # Role management page
│   │   ├── demo/
│   │   │   └── index.tsx                # Demo page
│   │   └── error/
│   │       └── ErrorPage.tsx            # Error page
│   │
│   ├── providers/
│   │   └── authProvider/
│   │       ├── authContext.ts           # Auth context definition
│   │       ├── AuthProvider.tsx         # Auth context provider
│   │       └── useAuth.ts               # Auth hook
│   │
│   ├── services/
│   │   ├── userService.ts               # User API service
│   │   ├── roleService.ts               # Role API service
│   │   ├── authService.ts               # Auth API service
│   │   └── dashboardService.ts          # Dashboard API service
│   │
│   ├── lib/
│   │   ├── api.ts                       # API client wrapper
│   │   ├── axios.ts                     # Axios configuration
│   │   ├── sessionStorage.ts            # Session storage utilities
│   │   ├── toast.ts                     # Toast helper
│   │   ├── toast-example.tsx            # Toast example
│   │   └── utils.ts                     # Utility functions
│   │
│   ├── router/
│   │   └── index.tsx                    # Route configuration
│   │
│   ├── stores/
│   │   ├── loading/
│   │   │   └── loadingSlice.ts          # Loading state slice
│   │   └── index.ts                     # Store configuration
│   │
│   ├── assets/
│   │   └── react.svg
│   │
│   ├── App.tsx                          # Root app component
│   ├── App.css
│   ├── index.css                        # Global styles
│   ├── main.tsx                         # Entry point
│   └── vite-env.d.ts                    # Vite environment types
│
├── public/
│   └── vite.svg
│
├── docs/
│   └── summary.md                       # This file
│
├── index.html                           # HTML entry point
├── package.json                         # Dependencies & scripts
├── package-lock.json
├── bun.lock                             # Bun lock file
├── tsconfig.json                        # TypeScript config
├── tsconfig.app.json                    # App TypeScript config
├── tsconfig.node.json                   # Node TypeScript config
├── vite.config.ts                       # Vite configuration
├── eslint.config.js                     # ESLint config
├── eslint.config.ts                     # ESLint config (TS)
├── components.json                      # Component config
├── README.md                            # Project README
└── .gitignore
```

---

## [object Object]

### 1. Layered Architecture

```
┌─────────────────────────────────────┐
│     Pages (UI Layer)                │
│  - UserPage, RolePage, DemoPage     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Features (Business Logic)         │
│  - useUser, useRole hooks           │
│  - Form validation schemas          │
│  - Feature components               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Services (API Layer)              │
│  - UserService, RoleService         │
│  - AuthService                      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   API Client (HTTP Layer)           │
│  - Axios with interceptors          │
│  - Token management                 │
│  - Error handling                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Models (Data Types)               │
│  - TypeScript interfaces            │
│  - Request/Response types           │
└─────────────────────────────────────┘
```

### 2. Feature-Based Architecture

Each feature (users, roles) is organized with:

```
feature/
├── components/          # UI components specific to feature
├── hooks/              # Custom hooks for business logic
├── schema/             # Zod validation schemas
└── utils/              # Feature-specific utilities (optional)
```

### 3. Component Hierarchy

```
App
├── AuthProvider (Context)
├── GlobalLoading (Global state)
├── Toaster (Notifications)
└── RouterProvider
    └── AdminLayout
        ├── Sidebar
        │   ├── Navigation Items
        │   └── Footer Items
        └── Main Content
            ├── UserPage
            │   ├── UserTable
            │   └── CreateUserDialog
            ├── RolePage
            │   ├── RoleTable
            │   └── CreateRoleDialog
            ├── DemoPage
            └── ErrorPage
```

---

## 🎯 Key Features

### 1. User Management

**Capabilities**:

- ✅ Display users list with pagination
- ✅ Create new users
- ✅ Edit user information
- ✅ Activate/deactivate users
- ✅ Assign roles to users
- ✅ Form validation with Zod

**Components**:

- `UserPage` - Main page
- `UserTable` - List display with pagination
- `CreateUserDialog` - Form for create/edit
- `useUser` - Custom hook for operations

**API Endpoints**:

```
GET    /api/v1/users/list              # List users
GET    /api/v1/users/:id               # Get user details
POST   /api/v1/users                   # Create user
PUT    /api/v1/users/:id               # Update user
DELETE /api/v1/users/:id               # Delete user
POST   /api/v1/users/:id/activate      # Activate user
POST   /api/v1/users/:id/deactivate    # Deactivate user
```

### 2. Role Management

**Capabilities**:

- ✅ Display roles list with pagination
- ✅ Create new roles
- ✅ Edit roles
- ✅ Delete roles
- ✅ Manage Active/Inactive status

**Components**:

- `RolePage` - Main page
- `RoleTable` - List display with pagination
- `CreateRoleDialog` - Form for create/edit
- `useRole` - Custom hook for operations

**API Endpoints**:

```
GET    /api/v1/roles/list              # List roles
GET    /api/v1/roles/:id               # Get role details
POST   /api/v1/roles                   # Create role
PUT    /api/v1/roles/:id               # Update role
DELETE /api/v1/roles/:id               # Delete role
```

### 3. Authentication

**Current Implementation**:

- ✅ Context-based authentication system
- ✅ Token management (localStorage)
- ✅ Protected routes capability
- ✅ Login/logout functionality
- ⚠️ **TODO**: Implement actual API integration

**Features**:

- Bearer token in Authorization header
- Auto-logout on 401 (Unauthorized)
- Token refresh capability (structure ready)
- Session storage utilities

**API Endpoints**:

```
POST   /api/v1/auth/login              # Login
POST   /api/v1/auth/logout             # Logout
POST   /api/v1/auth/refresh-token      # Refresh token
POST   /api/v1/auth/forgot-password    # Forgot password
POST   /api/v1/auth/reset-password     # Reset password
POST   /api/v1/auth/register           # Register
```

### 4. UI/UX Features

- ✅ Responsive design (mobile-first)
- ✅ Sidebar navigation with collapsible menu
- ✅ Toast notifications (success, error, info)
- ✅ Loading states (global and component-level)
- ✅ Confirmation dialogs for destructive actions
- ✅ Empty data states
- ✅ Dark/Light theme support (Tailwind)
- ✅ Accessible components (Radix UI)
- ✅ Pagination controls
- ✅ Form validation feedback

---

## 📡 Data Flow

### User Management Flow

```
User clicks "Create User"
         ↓
UserPage opens CreateUserDialog
         ↓
User fills form and submits
         ↓
Form validation (Zod schema)
         ↓
useUser().createUser(userData)
         ↓
UserService.createUser(userData)
         ↓
api.post('/api/v1/users', userData)
         ↓
Axios interceptor adds Bearer token
         ↓
Backend API processes request
         ↓
Response returned
         ↓
Hook updates state
         ↓
Toast notification shown
         ↓
UserTable refreshed with new data
```

### Pagination Flow

```
User clicks page number
         ↓
handlePageChange(page)
         ↓
setPagination({ ...pagination, page })
         ↓
fetchUsers({ page, pageSize })
         ↓
UserService.getUsers(params)
         ↓
API request with query parameters
         ↓
Response with paginated data
         ↓
setUsers(response.data)
         ↓
UserTable re-renders with new data
```

### Authentication Flow

```
User enters credentials
         ↓
AuthProvider.login(email, password)
         ↓
AuthService.login(credentials)
         ↓
api.post('/api/v1/auth/login', credentials)
         ↓
Backend validates and returns token
         ↓
localStorage.setItem('accessToken', token)
         ↓
setIsAuthenticated(true)
         ↓
Axios interceptor uses token for requests
         ↓
User can access protected pages
```

---

## 🔐 Authentication System

### Architecture

```
AuthProvider (Context)
├── State
│   ├── isAuthenticated: boolean
│   ├── user: User | null
│   └── error: string | null
│
├── Methods
│   ├── login(email, password)
│   ├── logout()
│   └── refreshToken()
│
└── Consumers
    ├── useAuth() hook
    └── AdminLayout (checks authentication)
```

### Token Management

**Storage**:

- `accessToken` - Stored in localStorage
- `refreshToken` - Stored in localStorage (optional)

**Axios Interceptor**:

```typescript
// Request interceptor
- Retrieves token from sessionStorage
- Adds "Authorization: Bearer {token}" header

// Response interceptor
- Handles 401 (Unauthorized) → logout & redirect to login
- Handles 403 (Forbidden) → redirect to 403 page
- Handles 404 (Not Found) → redirect to 404 page
- Handles 500 (Server Error) → redirect to error page
```

### Current TODOs

- [ ] Implement actual login API call
- [ ] Fetch user info from token or API
- [ ] Implement token refresh logic
- [ ] Add protected route guards
- [ ] Implement logout API call

---

## 📡 API Integration

### Service Layer Pattern

Each feature has a dedicated service class:

```typescript
class UserService {
  apiRoute = {
    GET_USERS: '/api/v1/users/list',
    GET_USER_BY_ID: '/api/v1/users/:id',
    CREATE_USER: '/api/v1/users',
    UPDATE_USER: '/api/v1/users/:id',
    DELETE_USER: '/api/v1/users/:id',
    ACTIVATE_USER: '/api/v1/users/:id/activate',
    DEACTIVATE_USER: '/api/v1/users/:id/deactivate',
  };

  async getUsers(
    params?: PaginationParams
  ): Promise<ApiResponse<UserListResponse>>;
  async getUserById(id: string): Promise<ApiResponse<UserDetailResponse>>;
  async createUser(
    userData: CreateUserRequest
  ): Promise<ApiResponse<UserDetailResponse>>;
  async updateUser(
    id: string,
    userData: UpdateUserRequest
  ): Promise<ApiResponse<UserDetailResponse>>;
  async deleteUser(id: string): Promise<ApiResponse<void>>;
  async activateUser(id: string): Promise<ApiResponse<boolean>>;
  async deactivateUser(id: string): Promise<ApiResponse<boolean>>;
}
```

### API Response Format

```typescript
interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
  message?: string;
  errors?: string[];
}
```

### Pagination Response Format

```typescript
interface UserListResponse {
  items: User[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
```

### Axios Configuration

**Base URL**: `http://localhost:3000/api` (configurable via `VITE_API_BASE_URL`)

**Default Headers**:

```
Content-Type: application/json
Authorization: Bearer {token}
```

**Timeout**: 15 seconds

**Interceptors**:

- Request: Add Bearer token
- Response: Handle errors and redirects

---

## 🎨 Component System

### UI Component Library

All UI components are built with:

- **Radix UI** - Headless components
- **Tailwind CSS** - Styling
- **Class Variance Authority** - Variants

### Base Components

| Component      | Location                      | Purpose                     |
| -------------- | ----------------------------- | --------------------------- |
| **Button**     | `components/ui/button/`       | Action button with variants |
| **Dialog**     | `components/ui/dialog.tsx`    | Modal dialog                |
| **Input**      | `components/ui/input.tsx`     | Text input field            |
| **Label**      | `components/ui/label.tsx`     | Form label                  |
| **Table**      | `components/ui/table.tsx`     | Data table                  |
| **Checkbox**   | `components/ui/checkbox.tsx`  | Checkbox input              |
| **Accordion**  | `components/ui/accordion.tsx` | Accordion component         |
| **Typography** | `components/ui/typography/`   | Text styles                 |
| **Page**       | `components/ui/page.tsx`      | Page wrapper                |
| **Pagination** | `components/ui/pagination/`   | Pagination controls         |

### Feature Components

| Component            | Location                     | Purpose          |
| -------------------- | ---------------------------- | ---------------- |
| **UserTable**        | `features/users/components/` | User list table  |
| **CreateUserDialog** | `features/users/components/` | User form dialog |
| **RoleTable**        | `features/roles/components/` | Role list table  |
| **CreateRoleDialog** | `features/roles/components/` | Role form dialog |

### Layout Components

| Component       | Location                     | Purpose            |
| --------------- | ---------------------------- | ------------------ |
| **AdminLayout** | `components/layout/`         | Main admin layout  |
| **Sidebar**     | `components/layout/sidebar/` | Navigation sidebar |
| **RootLayout**  | `components/layout/`         | Root layout        |

### Special Components

| Component         | Location                    | Purpose                  |
| ----------------- | --------------------------- | ------------------------ |
| **GlobalLoading** | `components/ui/loading/`    | Global loading indicator |
| **ConfirmDialog** | `components/ui/dialog/`     | Confirmation dialog      |
| **EmptyData**     | `components/ui/empty-data/` | Empty state display      |

---

## 🔧 Development Setup

### Prerequisites

- Node.js >= 18
- npm, yarn, or bun

### Installation

```bash
# Install dependencies
npm install

# Or with yarn
yarn install

# Or with bun
bun install
```

### Running Development Server

```bash
npm run dev
```

**Output**:

```
VITE v7.1.3  ready in 2648 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Build for Production

```bash
npm run build
```

**Process**:

1. TypeScript compilation (`tsc -b`)
2. Vite build with optimizations

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

**Checks**:

- ESLint rules
- TypeScript errors
- React best practices

### Available Scripts

| Script      | Command                | Purpose                  |
| ----------- | ---------------------- | ------------------------ |
| **dev**     | `vite`                 | Start dev server         |
| **build**   | `tsc -b && vite build` | Build for production     |
| **lint**    | `eslint .`             | Run linter               |
| **preview** | `vite preview`         | Preview production build |
| **prepare** | `husky install`        | Setup git hooks          |

### Environment Variables

Create a `.env` file in the project root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# App Configuration
VITE_APP_NAME=Admin Dashboard
```

### Port Configuration

- **Development**: Port 3000 (configured in `vite.config.ts`)
- **API Base URL**: `http://localhost:3000/api` (configurable)

---

## 📋 Current TODOs

### Authentication

- [ ] Implement actual login API integration
- [ ] Fetch user info from token or API endpoint
- [ ] Implement token refresh logic
- [ ] Add protected route guards
- [ ] Implement logout API call
- [ ] Add remember me functionality

### Features

- [ ] Complete Dashboard page
- [ ] Implement Settings pages (Profile, Security, Communication, Permissions)
- [ ] Implement Help page
- [ ] Add user search functionality
- [ ] Add role search functionality
- [ ] Implement bulk actions (delete, activate, deactivate)

### Error Handling

- [ ] Integrate ErrorPage component
- [ ] Add global error boundary
- [ ] Implement error logging
- [ ] Add 404 and 403 pages

### Documentation

- [ ] Complete API documentation
- [ ] Add component storybook
- [ ] Add developer guide
- [ ] Add deployment guide

### Testing

- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Add E2E tests

### Performance

- [ ] Implement code splitting
- [ ] Optimize bundle size
- [ ] Add image optimization
- [ ] Implement lazy loading

### Accessibility

- [ ] Audit accessibility compliance
- [ ] Add ARIA labels
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility

---

## ✅ Code Quality Standards

### TypeScript

- **Strict Mode**: Enabled
- **Target**: ES2020
- **Module**: ESNext
- **JSX**: React-JSX

**Standards**:

- All files use `.ts` or `.tsx` extensions
- All data models have TypeScript interfaces
- All API calls are type-safe
- No `any` types without justification

### Naming Conventions

**Files**:

- Components: PascalCase (e.g., `UserTable.tsx`)
- Utilities: camelCase (e.g., `userService.ts`)
- Types: PascalCase (e.g., `UserResponse.ts`)

**Variables**:

- Constants: UPPER_SNAKE_CASE
- Functions: camelCase
- Components: PascalCase
- Private members: \_camelCase

### Component Structure

```typescript
// 1. Imports
import { useState } from 'react';
import Button from '@/components/ui/button';

// 2. Type definitions
interface ComponentProps {
  title: string;
  onClose: () => void;
}

// 3. Component
export function MyComponent({ title, onClose }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState(false);

  // 5. Handlers
  const handleClick = () => {
    setState(!state);
  };

  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>Toggle</Button>
    </div>
  );
}

export default MyComponent;
```

### Custom Hooks Pattern

```typescript
export const useMyHook = () => {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Logic here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return { state, loading, error, fetchData };
};
```

### Error Handling

- Try-catch blocks for async operations
- Proper error messages for users
- Console errors for debugging
- Toast notifications for user feedback

### Code Organization

- One component per file
- Related files grouped in folders
- Clear separation of concerns
- Reusable utilities in `lib/`
- Type definitions in `models/`

### Linting Rules

- ESLint enabled with React plugin
- Prettier for code formatting
- Husky for pre-commit hooks
- TypeScript strict mode

---

## 🚀 Deployment

### Build Process

```bash
npm run build
```

**Output**: `dist/` folder with optimized production build

### Environment Setup

1. Set `VITE_API_BASE_URL` to production API URL
2. Build the project
3. Deploy `dist/` folder to static hosting

### Hosting Options

- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting service

---

## 📚 Additional Resources

### Project Files

- **README.md** - Main project documentation
- **package.json** - Dependencies and scripts
- **vite.config.ts** - Vite configuration
- **tsconfig.json** - TypeScript configuration
- **eslint.config.ts** - ESLint configuration

### Key Utilities

- **lib/api.ts** - API wrapper
- **lib/axios.ts** - Axios configuration
- **lib/toast.ts** - Toast helper
- **lib/utils.ts** - Utility functions
- **lib/sessionStorage.ts** - Storage utilities

### Hooks

- **useAuth()** - Authentication hook
- **useUser()** - User management hook
- **useRole()** - Role management hook
- **useSidebar()** - Sidebar state hook

---

## 📝 Notes

### Current Status

- ✅ Core architecture established
- ✅ User and Role management features
- ✅ UI component library
- ✅ API integration structure
- ✅ Authentication context setup
- ⚠️ Some features are placeholders
- ⚠️ API endpoints need backend implementation

### Strengths

1. **Well-organized** - Clear folder structure and separation of concerns
2. **Type-safe** - Full TypeScript implementation
3. **Scalable** - Feature-based architecture allows easy expansion
4. **Accessible** - Radix UI components ensure accessibility
5. **Modern** - Uses latest React 19 and Vite
6. **Responsive** - Mobile-first design with Tailwind CSS

### Areas for Improvement

1. Complete authentication implementation
2. Add comprehensive error handling
3. Implement all placeholder pages
4. Add unit and integration tests
5. Add API documentation
6. Implement loading states globally

---

## 👤 Project Author

**Sabo**

---

**Document Generated**: December 10, 2025  
**Project Status**: Active Development  
**Last Updated**: December 10, 2025
