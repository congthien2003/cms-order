import api from '@/lib/axios';
import type { ApiResponse, PagedList } from '@/models/common/api';
import type {
  Order,
  OrderReceipt,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  UpdatePaymentStatusRequest,
  GetOrdersRequest,
} from '@/models/pos';

const BASE_URL = '/Orders';

export const orderService = {
  // Get orders list with pagination
  getList: async (
    params?: GetOrdersRequest
  ): Promise<ApiResponse<PagedList<Order>>> => {
    const response = await api.get(BASE_URL, { params });
    return response.data;
  },

  // Get today's orders
  getToday: async (): Promise<ApiResponse<Order[]>> => {
    const response = await api.get(`${BASE_URL}/today`);
    return response.data;
  },

  // Get order queue (pending/preparing orders)
  getQueue: async (): Promise<ApiResponse<Order[]>> => {
    const response = await api.get(`${BASE_URL}/queue`);
    return response.data;
  },

  // Get order by ID
  getById: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Get order by order number
  getByNumber: async (orderNumber: string): Promise<ApiResponse<Order>> => {
    const response = await api.get(`${BASE_URL}/number/${orderNumber}`);
    return response.data;
  },

  // Get order receipt
  getReceipt: async (id: string): Promise<ApiResponse<OrderReceipt>> => {
    const response = await api.get(`${BASE_URL}/${id}/receipt`);
    return response.data;
  },

  // Create new order
  create: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  // Update order status
  updateStatus: async (
    id: string,
    data: UpdateOrderStatusRequest
  ): Promise<ApiResponse<Order>> => {
    const response = await api.patch(`${BASE_URL}/${id}/status`, data);
    return response.data;
  },

  // Update payment status
  updatePaymentStatus: async (
    id: string,
    data: UpdatePaymentStatusRequest
  ): Promise<ApiResponse<Order>> => {
    const response = await api.patch(`${BASE_URL}/${id}/payment-status`, data);
    return response.data;
  },

  // Cancel order
  cancel: async (id: string, reason?: string): Promise<ApiResponse<Order>> => {
    const response = await api.post(`${BASE_URL}/${id}/cancel`, { reason });
    return response.data;
  },
};

export default orderService;
