// Dashboard types

export interface DashboardSummary {
  todayRevenue: number;
  todayOrdersCount: number;
  todayOrderCount?: number; // Alias
  todayCompletedOrders: number;
  completedOrdersCount?: number; // Alias
  todayCancelledOrders: number;
  pendingOrders: number;
  pendingOrdersCount?: number; // Alias
  preparingOrders: number;
  readyOrders: number;
  yesterdayRevenue: number;
  revenueChangePercent: number;
  yesterdayOrderCount: number;
  orderCountChangePercent: number;
  totalProducts?: number;
  activeProducts?: number;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface RevenueStatistics {
  fromDate: string;
  toDate: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  dailyRevenue: DailyRevenue[];
}

export interface OrdersByStatus {
  status: string;
  count: number;
  pending?: number;
  confirmed?: number;
  preparing?: number;
  ready?: number;
  completed?: number;
  cancelled?: number;
  total?: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  categoryName: string | null;
  quantitySold: number;
  quantity?: number; // Alias
  revenue: number;
}

export interface TopProductsResponse {
  fromDate: string;
  toDate: string;
  products: TopProduct[];
}

export interface CategoryRevenue {
  categoryId: string;
  categoryName: string;
  revenue: number;
  percentage: number;
  orderCount: number;
}

// Alias for consistency
export type RevenueByCategory = CategoryRevenue;

export interface RevenueByCategoryResponse {
  fromDate: string;
  toDate: string;
  totalRevenue: number;
  categories: CategoryRevenue[];
}

// Shop Settings
export interface ShopSettings {
  id: string;
  shopName: string;
  address: string;
  phone?: string;
  phoneNumber?: string;
  email?: string;
  logo?: string | null;
  defaultVATPercentage?: number;
  isVATEnabled?: boolean;
  receiptFooter?: string | null;
  updatedAt?: string | null;
  openTime?: string;
  closeTime?: string;
  isOpen?: boolean;
  taxRate?: number;
  serviceFee?: number;
  currency?: string;
}

export interface UpdateShopSettingsRequest {
  shopName?: string;
  address?: string;
  phone?: string;
  phoneNumber?: string;
  email?: string;
  logo?: string;
  defaultVATPercentage?: number;
  isVATEnabled?: boolean;
  receiptFooter?: string;
  openTime?: string;
  closeTime?: string;
  isOpen?: boolean;
  taxRate?: number;
  serviceFee?: number;
  currency?: string;
}
