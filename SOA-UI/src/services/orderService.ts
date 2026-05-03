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

const BASE_URL = '/v1/orders';

const routes = {
  list: BASE_URL,
  today: `${BASE_URL}/today`,
  queue: `${BASE_URL}/queue`,
  byId: (id: string) => `${BASE_URL}/${id}`,
  byNumber: (orderNumber: string) => `${BASE_URL}/number/${orderNumber}`,
  receipt: (id: string) => `${BASE_URL}/${id}/receipt`,
  status: (id: string) => `${BASE_URL}/${id}/status`,
  paymentStatus: (id: string) => `${BASE_URL}/${id}/payment-status`,
  cancel: (id: string) => `${BASE_URL}/${id}/cancel`,
};

export const orderService = {
  // Get orders list with pagination
  getList: async (
    params?: GetOrdersRequest
  ): Promise<ApiResponse<PagedList<Order>>> => {
    const response = await api.get(routes.list, { params });
    return response.data;
  },

  // Get today's orders
  getToday: async (): Promise<ApiResponse<Order[]>> => {
    const response = await api.get(routes.today);
    return response.data;
  },

  // Get order queue (pending/preparing orders)
  getQueue: async (): Promise<ApiResponse<Order[]>> => {
    const response = await api.get(routes.queue);
    return response.data;
  },

  // Get order by ID
  getById: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await api.get(routes.byId(id));
    return response.data;
  },

  // Get order by order number
  getByNumber: async (orderNumber: string): Promise<ApiResponse<Order>> => {
    const response = await api.get(routes.byNumber(orderNumber));
    return response.data;
  },

  // Get order receipt
  getReceipt: async (id: string): Promise<ApiResponse<OrderReceipt>> => {
    const response = await api.get(routes.receipt(id));
    return response.data;
  },

  // Create new order
  create: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    const response = await api.post(routes.list, data);
    return response.data;
  },

  // Update order status
  updateStatus: async (
    id: string,
    data: UpdateOrderStatusRequest
  ): Promise<ApiResponse<Order>> => {
    const response = await api.patch(routes.status(id), data);
    return response.data;
  },

  // Update payment status
  updatePaymentStatus: async (
    id: string,
    data: UpdatePaymentStatusRequest
  ): Promise<ApiResponse<Order>> => {
    const response = await api.patch(routes.paymentStatus(id), data);
    return response.data;
  },

  // Cancel order
  cancel: async (id: string, reason?: string): Promise<ApiResponse<Order>> => {
    const response = await api.post(routes.cancel(id), { reason });
    return response.data;
  },
};

export default orderService;
