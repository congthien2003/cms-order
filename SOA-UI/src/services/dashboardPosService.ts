import api from '@/lib/axios';
import type { ApiResponse } from '@/models/common/api';
import type {
  DashboardSummary,
  RevenueStatistics,
  OrdersByStatus,
  TopProduct,
  CategoryRevenue,
} from '@/models/pos';

const BASE_URL = '/Dashboard';

export interface GetRevenueStatisticsRequest {
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
}

export const dashboardPosService = {
  // Get dashboard summary
  getSummary: async (): Promise<ApiResponse<DashboardSummary>> => {
    const response = await api.get(`${BASE_URL}/summary`);
    return response.data;
  },

  // Get revenue statistics
  getRevenueStatistics: async (
    params?: GetRevenueStatisticsRequest
  ): Promise<ApiResponse<RevenueStatistics[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.groupBy) queryParams.append('groupBy', params.groupBy);

    const queryString = queryParams.toString();
    const url = queryString
      ? `${BASE_URL}/revenue?${queryString}`
      : `${BASE_URL}/revenue`;
    const response = await api.get(url);
    return response.data;
  },

  // Get orders grouped by status
  getOrdersByStatus: async (): Promise<ApiResponse<OrdersByStatus[]>> => {
    const response = await api.get(`${BASE_URL}/orders-by-status`);
    return response.data;
  },

  // Get top selling products
  getTopProducts: async (params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<ApiResponse<TopProduct[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `${BASE_URL}/top-products?${queryString}`
      : `${BASE_URL}/top-products`;
    const response = await api.get(url);
    return response.data;
  },

  // Get revenue by category
  getRevenueByCategory: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<CategoryRevenue[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const queryString = queryParams.toString();
    const url = queryString
      ? `${BASE_URL}/revenue-by-category?${queryString}`
      : `${BASE_URL}/revenue-by-category`;
    const response = await api.get(url);
    return response.data;
  },
};

export default dashboardPosService;
