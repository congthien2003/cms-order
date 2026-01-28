# 📋 Project Planning - Store Order Management System (MVP v1.0)

> **Ngày tạo:** 27/01/2026  
> **Cập nhật:** 28/01/2026 - Phase 1 Completed ✅  
> **Mục tiêu:** Triển khai hệ thống bán hàng (POS) cho cửa hàng bán nước  
> **Tech Stack:** .NET API + EF Core + PostgreSQL | React + TailwindCSS + Shadcn | React Native Expo

---

## 📊 Progress Summary

**Overall Progress:** 49/130 tasks (37.7%)

- ✅ **Phase 1 COMPLETED:** 19/19 tasks (100%)
- ✅ **Phase 2 COMPLETED:** 16/16 tasks (100%)
- 🔄 **Phase 3 IN PROGRESS:** 5/14 tasks (35.7%) - Voucher API done, Order API pending
- ⬜ **Remaining:** 91 tasks across Phases 3-9

---

## 🎯 Tổng quan các Phase

| Phase   | Nội dung                          | Ưu tiên       | Trạng thái      |
| ------- | --------------------------------- | ------------- | --------------- |
| Phase 1 | Database Design & Domain Setup    | 🔴 Cao        | ✅ Hoàn thành |
| Phase 2 | Backend API - Core Entities       | 🔴 Cao        | ✅ Hoàn thành |
| Phase 3 | Backend API - Order & Promotion   | 🔴 Cao        | 🔄 Đang thực hiện |
| Phase 4 | Backend API - Dashboard & Reports | 🟡 Trung bình | ⬜ Chưa bắt đầu |
| Phase 5 | Backend API - Real-time (SignalR) | 🟡 Trung bình | ⬜ Chưa bắt đầu |
| Phase 6 | Admin UI - Setup & Auth           | 🔴 Cao        | ⬜ Chưa bắt đầu |
| Phase 7 | Admin UI - Entity Management      | 🔴 Cao        | ⬜ Chưa bắt đầu |
| Phase 8 | Admin UI - Order & Dashboard      | 🟡 Trung bình | ⬜ Chưa bắt đầu |
| Phase 9 | Mobile App (React Native)         | 🟢 Phase sau  | ⬜ Chưa bắt đầu |

---

## 📦 PHASE 1: Database Design & Domain Setup

### 1.1 Thiết kế Database Schema

- [x] **TODO-1.1.1:** Thiết kế ERD (Entity Relationship Diagram) ✅
- [x] **TODO-1.1.2:** Xác định các bảng và quan hệ ✅

**Danh sách Entities cần tạo:**

```
1. Category (Danh mục)
   - Id (Guid, PK)
   - Name (string, required)
   - Description (string, nullable)
   - ImageUrl (string, nullable)
   - IsActive (bool)
   - SortOrder (int)
   - CreatedAt (DateTime)
   - UpdatedAt (DateTime)

2. Product (Sản phẩm)
   - Id (Guid, PK)
   - CategoryId (Guid, FK)
   - Name (string, required)
   - Description (string, nullable)
   - ImageUrl (string, nullable)
   - BasePrice (decimal) - Giá cơ bản
   - IsActive (bool)
   - SortOrder (int)
   - CreatedAt (DateTime)
   - UpdatedAt (DateTime)

3. ProductSize (Size sản phẩm)
   - Id (Guid, PK)
   - ProductId (Guid, FK)
   - SizeName (string) - S, M, L, XL
   - PriceAdjustment (decimal) - Giá chênh lệch so với BasePrice
   - IsDefault (bool)
   - IsActive (bool)

4. Topping (Topping)
   - Id (Guid, PK)
   - Name (string, required)
   - Price (decimal)
   - ImageUrl (string, nullable)
   - IsActive (bool)
   - SortOrder (int)
   - CreatedAt (DateTime)
   - UpdatedAt (DateTime)

5. ProductTopping (Mapping Product - Topping)
   - Id (Guid, PK)
   - ProductId (Guid, FK)
   - ToppingId (Guid, FK)
   - IsDefault (bool) - Topping mặc định của sản phẩm

6. Voucher (Khuyến mãi)
   - Id (Guid, PK)
   - Code (string, unique)
   - Name (string)
   - Description (string, nullable)
   - DiscountType (enum: Percentage, FixedAmount)
   - DiscountValue (decimal)
   - MinOrderAmount (decimal, nullable) - Đơn tối thiểu
   - MaxDiscountAmount (decimal, nullable) - Giảm tối đa
   - StartDate (DateTime)
   - EndDate (DateTime)
   - UsageLimit (int, nullable) - Số lần sử dụng tối đa
   - UsedCount (int)
   - IsActive (bool)
   - CreatedAt (DateTime)
   - UpdatedAt (DateTime)

7. Order (Đơn hàng)
   - Id (Guid, PK)
   - OrderNumber (string, unique) - Mã đơn hàng auto-generate
   - CustomerName (string, nullable)
   - CustomerPhone (string, nullable)
   - SubTotal (decimal) - Tổng tiền trước giảm giá
   - DiscountAmount (decimal) - Số tiền được giảm
   - VATAmount (decimal) - Tiền VAT
   - VATPercentage (decimal) - % VAT (mặc định 10%)
   - IsVATIncluded (bool) - Có tính VAT không
   - TotalAmount (decimal) - Tổng tiền cuối cùng
   - VoucherId (Guid, nullable, FK)
   - VoucherCode (string, nullable) - Lưu lại code tại thời điểm đặt
   - Status (enum: Pending, Confirmed, Preparing, Ready, Completed, Cancelled)
   - PaymentMethod (enum: Cash, BankTransfer, Card)
   - PaymentStatus (enum: Pending, Paid, Refunded)
   - Note (string, nullable)
   - CreatedAt (DateTime)
   - UpdatedAt (DateTime)
   - CreatedBy (Guid, nullable) - User tạo đơn

8. OrderItem (Chi tiết đơn hàng)
   - Id (Guid, PK)
   - OrderId (Guid, FK)
   - ProductId (Guid, FK)
   - ProductName (string) - Lưu lại tên tại thời điểm đặt
   - ProductSizeId (Guid, nullable, FK)
   - SizeName (string, nullable)
   - Quantity (int)
   - UnitPrice (decimal) - Giá đơn vị (đã bao gồm size)
   - ToppingTotal (decimal) - Tổng tiền topping
   - ItemTotal (decimal) - Tổng tiền item
   - Note (string, nullable)

9. OrderItemTopping (Topping trong chi tiết đơn)
   - Id (Guid, PK)
   - OrderItemId (Guid, FK)
   - ToppingId (Guid, FK)
   - ToppingName (string) - Lưu lại tên tại thời điểm đặt
   - Price (decimal) - Lưu lại giá tại thời điểm đặt
   - Quantity (int)

10. ShopSetting (Cài đặt cửa hàng)
    - Id (Guid, PK)
    - ShopName (string)
    - Address (string)
    - Phone (string)
    - Email (string)
    - Logo (string)
    - DefaultVATPercentage (decimal)
    - IsVATEnabled (bool)
    - ReceiptFooter (string) - Dòng chữ cuối hóa đơn
    - UpdatedAt (DateTime)
```

### 1.2 Tạo Domain Entities

- [x] **TODO-1.2.1:** Tạo entity `Category` trong Domain/Entities ✅
- [x] **TODO-1.2.2:** Tạo entity `Product` trong Domain/Entities ✅
- [x] **TODO-1.2.3:** Tạo entity `ProductSize` trong Domain/Entities ✅
- [x] **TODO-1.2.4:** Tạo entity `Topping` trong Domain/Entities ✅
- [x] **TODO-1.2.5:** Tạo entity `ProductTopping` trong Domain/Entities ✅
- [x] **TODO-1.2.6:** Tạo entity `Voucher` trong Domain/Entities ✅
- [x] **TODO-1.2.7:** Tạo entity `Order` trong Domain/Entities ✅
- [x] **TODO-1.2.8:** Tạo entity `OrderItem` trong Domain/Entities ✅
- [x] **TODO-1.2.9:** Tạo entity `OrderItemTopping` trong Domain/Entities ✅
- [x] **TODO-1.2.10:** Tạo entity `ShopSetting` trong Domain/Entities ✅

### 1.3 Tạo Enums

- [x] **TODO-1.3.1:** Tạo enum `DiscountType` (Percentage, FixedAmount) ✅
- [x] **TODO-1.3.2:** Tạo enum `OrderStatus` (Pending, Confirmed, Preparing, Ready, Completed, Cancelled) ✅
- [x] **TODO-1.3.3:** Tạo enum `PaymentMethod` (Cash, BankTransfer, Card) ✅
- [x] **TODO-1.3.4:** Tạo enum `PaymentStatus` (Pending, Paid, Refunded) ✅

### 1.4 Tạo Repository Interfaces

- [x] **TODO-1.4.1:** Tạo interface `ICategoryRepository` ✅
- [x] **TODO-1.4.2:** Tạo interface `IProductRepository` ✅
- [x] **TODO-1.4.3:** Tạo interface `IToppingRepository` ✅
- [x] **TODO-1.4.4:** Tạo interface `IVoucherRepository` ✅
- [x] **TODO-1.4.5:** Tạo interface `IOrderRepository` ✅
- [x] **TODO-1.4.6:** Tạo interface `IShopSettingRepository` ✅

### 1.5 Setup Database & Migrations

- [x] **TODO-1.5.1:** Cấu hình DbContext với các DbSet ✅
- [x] **TODO-1.5.2:** Tạo Entity Configurations (Fluent API) ✅
- [x] **TODO-1.5.3:** Tạo Initial Migration ✅
- [x] **TODO-1.5.4:** Tạo Seed Data cơ bản ✅

---

## 📦 PHASE 2: Backend API - Core Entities (CRUD)

### 2.1 Category Management

- [x] **TODO-2.1.1:** Tạo DTOs cho Category (Request/Response) ✅
- [x] **TODO-2.1.2:** Tạo CategoryService interface và implementation (dùng CQRS pattern) ✅
- [x] **TODO-2.1.3:** Tạo CategoryRepository implementation ✅
- [x] **TODO-2.1.4:** Tạo CategoryController với các endpoints: ✅
  - `POST /api/categories/list` - Lấy danh sách (có phân trang, filter)
  - `GET /api/categories/{id}` - Lấy chi tiết
  - `POST /api/categories` - Tạo mới
  - `PUT /api/categories/{id}` - Cập nhật
  - `DELETE /api/categories/{id}` - Xóa (soft delete)
  - `PATCH /api/categories/{id}/toggle-status` - Bật/tắt trạng thái

### 2.2 Product Management

- [x] **TODO-2.2.1:** Tạo DTOs cho Product (Request/Response) ✅
- [x] **TODO-2.2.2:** Tạo DTOs cho ProductSize ✅
- [x] **TODO-2.2.3:** Tạo ProductService interface và implementation (dùng CQRS pattern) ✅
- [x] **TODO-2.2.4:** Tạo ProductRepository implementation ✅
- [x] **TODO-2.2.5:** Tạo ProductsController với các endpoints: ✅
  - `POST /api/products/list` - Lấy danh sách (có phân trang, filter theo category)
  - `GET /api/products/{id}` - Lấy chi tiết (bao gồm sizes, toppings)
  - `GET /api/products/by-category/{categoryId}` - Lấy theo danh mục
  - `POST /api/products` - Tạo mới (bao gồm sizes)
  - `PUT /api/products/{id}` - Cập nhật
  - `DELETE /api/products/{id}` - Xóa
  - `PATCH /api/products/{id}/toggle-status` - Bật/tắt trạng thái
- [x] **TODO-2.2.6:** Tạo endpoints cho ProductSize: ✅
  - `POST /api/products/{productId}/sizes` - Thêm size
  - `PUT /api/products/{productId}/sizes/{sizeId}` - Cập nhật size
  - `DELETE /api/products/{productId}/sizes/{sizeId}` - Xóa size

### 2.3 Topping Management

- [x] **TODO-2.3.1:** Tạo DTOs cho Topping ✅
- [x] **TODO-2.3.2:** Tạo ToppingService interface và implementation (dùng CQRS pattern) ✅
- [x] **TODO-2.3.3:** Tạo ToppingRepository implementation ✅
- [x] **TODO-2.3.4:** Tạo ToppingsController với các endpoints: ✅
  - `POST /api/toppings/list` - Lấy danh sách
  - `GET /api/toppings/{id}` - Lấy chi tiết
  - `POST /api/toppings` - Tạo mới
  - `PUT /api/toppings/{id}` - Cập nhật
  - `DELETE /api/toppings/{id}` - Xóa
  - `PATCH /api/toppings/{id}/toggle-status` - Bật/tắt trạng thái

### 2.4 Product-Topping Mapping

- [x] **TODO-2.4.1:** Tạo DTOs cho ProductTopping ✅
- [x] **TODO-2.4.2:** Tạo endpoints: ✅
  - `GET /api/products/{productId}/toppings` - Lấy toppings của sản phẩm
  - `POST /api/products/{productId}/toppings` - Gán topping cho sản phẩm
  - `DELETE /api/products/{productId}/toppings/{toppingId}` - Xóa topping khỏi sản phẩm
  - `PUT /api/products/{productId}/toppings` - Cập nhật danh sách topping

---

## 📦 PHASE 3: Backend API - Order & Promotion

### 3.1 Voucher Management

- [x] **TODO-3.1.1:** Tạo DTOs cho Voucher ✅
- [x] **TODO-3.1.2:** Tạo VoucherService interface và implementation (dùng CQRS pattern) ✅
- [x] **TODO-3.1.3:** Tạo VoucherRepository implementation ✅
- [x] **TODO-3.1.4:** Tạo VouchersController với các endpoints: ✅
  - `POST /api/vouchers/list` - Lấy danh sách (có phân trang, filter)
  - `GET /api/vouchers/{id}` - Lấy chi tiết
  - `POST /api/vouchers/validate` - Validate voucher code
  - `POST /api/vouchers` - Tạo mới
  - `PUT /api/vouchers/{id}` - Cập nhật
  - `DELETE /api/vouchers/{id}` - Xóa
  - `PATCH /api/vouchers/{id}/toggle-status` - Bật/tắt trạng thái
- [x] **TODO-3.1.5:** Implement logic validate voucher: ✅
  - Kiểm tra code có tồn tại
  - Kiểm tra thời gian hiệu lực
  - Kiểm tra số lần sử dụng
  - Kiểm tra đơn tối thiểu

### 3.2 Order Management

- [ ] **TODO-3.2.1:** Tạo DTOs cho Order:
  - `CreateOrderRequest`
  - `OrderItemRequest`
  - `OrderResponse`
  - `OrderDetailResponse`
- [ ] **TODO-3.2.2:** Tạo OrderService interface và implementation
- [ ] **TODO-3.2.3:** Tạo OrderRepository implementation
- [ ] **TODO-3.2.4:** Implement logic tính toán đơn hàng:
  - Tính SubTotal
  - Apply Voucher discount
  - Tính VAT (nếu có)
  - Tính TotalAmount
- [ ] **TODO-3.2.5:** Tạo OrderController với các endpoints:
  - `GET /api/orders` - Lấy danh sách (có phân trang, filter theo status, date range)
  - `GET /api/orders/{id}` - Lấy chi tiết đơn
  - `GET /api/orders/by-number/{orderNumber}` - Lấy theo mã đơn
  - `POST /api/orders` - Tạo đơn mới
  - `PATCH /api/orders/{id}/status` - Cập nhật trạng thái đơn
  - `PATCH /api/orders/{id}/payment-status` - Cập nhật trạng thái thanh toán
  - `DELETE /api/orders/{id}` - Hủy đơn (chỉ khi Pending)
- [ ] **TODO-3.2.6:** Tạo logic generate OrderNumber (VD: ORD-20260127-001)

### 3.3 Order Queue (cho Admin)

- [ ] **TODO-3.3.1:** Tạo endpoint lấy orders theo queue:
  - `GET /api/orders/queue` - Lấy đơn đang chờ xử lý (status: Pending, Confirmed, Preparing)
  - `GET /api/orders/today` - Lấy đơn trong ngày
- [ ] **TODO-3.3.2:** Implement filter và sorting cho queue

### 3.4 Receipt/Invoice

- [ ] **TODO-3.4.1:** Tạo endpoint generate receipt:
  - `GET /api/orders/{id}/receipt` - Lấy thông tin hóa đơn để in
- [ ] **TODO-3.4.2:** Tạo ReceiptDTO với đầy đủ thông tin

---

## 📦 PHASE 4: Backend API - Dashboard & Reports

### 4.1 Dashboard Statistics

- [ ] **TODO-4.1.1:** Tạo DashboardService interface và implementation
- [ ] **TODO-4.1.2:** Tạo DashboardController với các endpoints:
  - `GET /api/dashboard/summary` - Tổng quan (doanh thu hôm nay, số đơn, đơn đang chờ)
  - `GET /api/dashboard/revenue` - Doanh thu theo khoảng thời gian
  - `GET /api/dashboard/orders-by-status` - Thống kê đơn theo trạng thái
  - `GET /api/dashboard/top-products` - Top sản phẩm bán chạy
  - `GET /api/dashboard/revenue-by-category` - Doanh thu theo danh mục

### 4.2 Reports

- [ ] **TODO-4.2.1:** Tạo ReportService
- [ ] **TODO-4.2.2:** Tạo các endpoints report:
  - `GET /api/reports/daily` - Báo cáo ngày
  - `GET /api/reports/weekly` - Báo cáo tuần
  - `GET /api/reports/monthly` - Báo cáo tháng
  - `GET /api/reports/custom` - Báo cáo tùy chỉnh theo date range

### 4.3 Shop Settings

- [ ] **TODO-4.3.1:** Tạo DTOs cho ShopSetting
- [ ] **TODO-4.3.2:** Tạo ShopSettingService
- [ ] **TODO-4.3.3:** Tạo endpoints:
  - `GET /api/settings` - Lấy cài đặt cửa hàng
  - `PUT /api/settings` - Cập nhật cài đặt

---

## 📦 PHASE 5: Backend API - Real-time (SignalR)

### 5.1 SignalR Setup

- [ ] **TODO-5.1.1:** Install package Microsoft.AspNetCore.SignalR
- [ ] **TODO-5.1.2:** Cấu hình SignalR trong Program.cs
- [ ] **TODO-5.1.3:** Tạo OrderHub class

### 5.2 SignalR Events

- [ ] **TODO-5.2.1:** Implement các events:
  - `NewOrder` - Khi có đơn mới từ Mobile
  - `OrderStatusChanged` - Khi trạng thái đơn thay đổi
  - `OrderCompleted` - Khi đơn hoàn thành
- [ ] **TODO-5.2.2:** Tạo notification service để broadcast events
- [ ] **TODO-5.2.3:** Integrate SignalR với OrderService

### 5.3 Authentication cho SignalR

- [ ] **TODO-5.3.1:** Cấu hình JWT authentication cho SignalR
- [ ] **TODO-5.3.2:** Tạo connection management (track connected clients)

---

## 📦 PHASE 6: Admin UI - Setup & Auth

### 6.1 Project Setup

- [ ] **TODO-6.1.1:** Verify các packages đã cài đặt (React, TailwindCSS, Shadcn)
- [ ] **TODO-6.1.2:** Cấu hình routing (React Router)
- [ ] **TODO-6.1.3:** Setup Axios interceptors cho API calls
- [ ] **TODO-6.1.4:** Cấu hình environment variables

### 6.2 Layout Components

- [ ] **TODO-6.2.1:** Tạo MainLayout component (Sidebar + Header + Content)
- [ ] **TODO-6.2.2:** Tạo Sidebar component với menu items
- [ ] **TODO-6.2.3:** Tạo Header component (user info, notifications)
- [ ] **TODO-6.2.4:** Tạo Breadcrumb component

### 6.3 Common Components

- [ ] **TODO-6.3.1:** Tạo DataTable component (với sorting, pagination)
- [ ] **TODO-6.3.2:** Tạo ConfirmDialog component
- [ ] **TODO-6.3.3:** Tạo FormModal component
- [ ] **TODO-6.3.4:** Tạo StatusBadge component
- [ ] **TODO-6.3.5:** Tạo Loading/Spinner components
- [ ] **TODO-6.3.6:** Tạo EmptyState component

### 6.4 Authentication

- [ ] **TODO-6.4.1:** Tạo Login page
- [ ] **TODO-6.4.2:** Implement auth context/provider
- [ ] **TODO-6.4.3:** Tạo ProtectedRoute component
- [ ] **TODO-6.4.4:** Implement logout functionality

---

## 📦 PHASE 7: Admin UI - Entity Management

### 7.1 Category Management

- [ ] **TODO-7.1.1:** Tạo Category model/types
- [ ] **TODO-7.1.2:** Tạo categoryService (API calls)
- [ ] **TODO-7.1.3:** Tạo CategoryListPage:
  - DataTable hiển thị danh sách
  - Nút thêm mới
  - Actions: Edit, Delete, Toggle Status
- [ ] **TODO-7.1.4:** Tạo CategoryFormModal (Create/Edit)
- [ ] **TODO-7.1.5:** Tạo CategoryDeleteConfirm

### 7.2 Product Management

- [ ] **TODO-7.2.1:** Tạo Product model/types
- [ ] **TODO-7.2.2:** Tạo productService (API calls)
- [ ] **TODO-7.2.3:** Tạo ProductListPage:
  - DataTable hiển thị danh sách
  - Filter theo Category
  - Nút thêm mới
  - Actions: Edit, Delete, Toggle Status, Manage Sizes, Manage Toppings
- [ ] **TODO-7.2.4:** Tạo ProductFormModal (Create/Edit)
- [ ] **TODO-7.2.5:** Tạo ProductSizeManager component
- [ ] **TODO-7.2.6:** Tạo ProductToppingManager component

### 7.3 Topping Management

- [ ] **TODO-7.3.1:** Tạo Topping model/types
- [ ] **TODO-7.3.2:** Tạo toppingService (API calls)
- [ ] **TODO-7.3.3:** Tạo ToppingListPage
- [ ] **TODO-7.3.4:** Tạo ToppingFormModal (Create/Edit)

### 7.4 Voucher Management

- [ ] **TODO-7.4.1:** Tạo Voucher model/types
- [ ] **TODO-7.4.2:** Tạo voucherService (API calls)
- [ ] **TODO-7.4.3:** Tạo VoucherListPage:
  - DataTable với filter (active, expired)
  - Hiển thị usage count
- [ ] **TODO-7.4.4:** Tạo VoucherFormModal (Create/Edit)

### 7.5 Shop Settings

- [ ] **TODO-7.5.1:** Tạo SettingsPage
- [ ] **TODO-7.5.2:** Tạo form cập nhật thông tin cửa hàng
- [ ] **TODO-7.5.3:** Tạo VAT configuration section

---

## 📦 PHASE 8: Admin UI - Order & Dashboard

### 8.1 Order Management

- [ ] **TODO-8.1.1:** Tạo Order model/types
- [ ] **TODO-8.1.2:** Tạo orderService (API calls)
- [ ] **TODO-8.1.3:** Tạo OrderListPage:
  - DataTable với filter (status, date range)
  - Quick status update
  - View details
- [ ] **TODO-8.1.4:** Tạo OrderDetailModal/Page
- [ ] **TODO-8.1.5:** Tạo OrderStatusBadge component
- [ ] **TODO-8.1.6:** Tạo PaymentStatusBadge component

### 8.2 Order Queue (Real-time)

- [ ] **TODO-8.2.1:** Tạo OrderQueuePage
- [ ] **TODO-8.2.2:** Implement Kanban-style board (theo status)
- [ ] **TODO-8.2.3:** Setup SignalR connection
- [ ] **TODO-8.2.4:** Implement real-time updates khi có đơn mới
- [ ] **TODO-8.2.5:** Tạo notification/sound khi có đơn mới

### 8.3 Dashboard

- [ ] **TODO-8.3.1:** Tạo DashboardPage
- [ ] **TODO-8.3.2:** Tạo StatCard components (Doanh thu, Số đơn, etc.)
- [ ] **TODO-8.3.3:** Tạo RevenueChart component (biểu đồ doanh thu)
- [ ] **TODO-8.3.4:** Tạo TopProductsChart component
- [ ] **TODO-8.3.5:** Tạo RecentOrdersList component
- [ ] **TODO-8.3.6:** Tạo OrdersByStatusChart component

### 8.4 Reports

- [ ] **TODO-8.4.1:** Tạo ReportsPage
- [ ] **TODO-8.4.2:** Tạo date range picker
- [ ] **TODO-8.4.3:** Tạo report tables và charts
- [ ] **TODO-8.4.4:** Implement export to Excel/PDF (optional)

---

## 📦 PHASE 9: Mobile App (React Native Expo) - PHASE SAU

> ⚠️ **Lưu ý:** Phase này sẽ triển khai sau khi hoàn thành Backend và Admin UI

### 9.1 Project Setup

- [ ] **TODO-9.1.1:** Khởi tạo Expo project
- [ ] **TODO-9.1.2:** Cài đặt dependencies (navigation, state management)
- [ ] **TODO-9.1.3:** Setup API client
- [ ] **TODO-9.1.4:** Cấu hình SignalR client

### 9.2 Authentication

- [ ] **TODO-9.2.1:** Tạo Login screen
- [ ] **TODO-9.2.2:** Implement secure token storage
- [ ] **TODO-9.2.3:** Auto-login functionality

### 9.3 Menu & Products

- [ ] **TODO-9.3.1:** Tạo Home screen với danh mục
- [ ] **TODO-9.3.2:** Tạo ProductList screen
- [ ] **TODO-9.3.3:** Tạo ProductDetail screen (chọn size, toppings)

### 9.4 Cart & Order

- [ ] **TODO-9.4.1:** Tạo Cart screen
- [ ] **TODO-9.4.2:** Tạo Checkout screen
- [ ] **TODO-9.4.3:** Implement voucher input
- [ ] **TODO-9.4.4:** Tạo Order confirmation screen

### 9.5 Receipt & Print

- [ ] **TODO-9.5.1:** Tạo Receipt preview screen
- [ ] **TODO-9.5.2:** Implement Bluetooth printer connection
- [ ] **TODO-9.5.3:** Implement print functionality

### 9.6 Real-time Connection

- [ ] **TODO-9.6.1:** Setup SignalR connection
- [ ] **TODO-9.6.2:** Handle connection states
- [ ] **TODO-9.6.3:** Send order events to Admin

---

## 📋 Checklist tổng quan tiến độ

### Backend API

- [x] Phase 1: Database & Domain (19/19 tasks) ✅
- [x] Phase 2: Core Entities CRUD (16/16 tasks) ✅
- [ ] Phase 3: Order & Promotion (5/14 tasks) - Voucher API done ✅
- [ ] Phase 4: Dashboard & Reports (0/10 tasks)
- [ ] Phase 5: Real-time SignalR (0/8 tasks)

### Admin UI

- [ ] Phase 6: Setup & Auth (0/15 tasks)
- [ ] Phase 7: Entity Management (0/17 tasks)
- [ ] Phase 8: Order & Dashboard (0/16 tasks)

### Mobile App

- [ ] Phase 9: React Native (0/15 tasks) - **PHASE SAU**

---

## 📝 Ghi chú thêm

### API Response Format chuẩn

```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "errors": []
}
```

### Pagination Response Format

```json
{
  "success": true,
  "data": {
    "items": [],
    "totalCount": 100,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Thứ tự ưu tiên triển khai

1. **Tuần 1-2:** Phase 1 + Phase 2 (Database + Core CRUD)
2. **Tuần 3:** Phase 3 (Order & Voucher)
3. **Tuần 4:** Phase 4 + Phase 5 (Dashboard + SignalR)
4. **Tuần 5-6:** Phase 6 + Phase 7 (Admin UI Setup + Entity Management)
5. **Tuần 7:** Phase 8 (Admin Order & Dashboard)
6. **Sau demo:** Phase 9 (Mobile App)

---

## 🔄 Version History

| Version | Ngày       | Thay đổi                  |
| ------- | ---------- | ------------------------- |
| 1.0     | 27/01/2026 | Initial planning document |
