import api from "@/lib/api";
import { ApiResponse, PaginationParams } from "@/models/common";
import {
  Order,
  OrderListResponse,
  OrderDetailResponse,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
} from "@/models/order";

interface OrderQueryParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  fromDate?: string;
  toDate?: string;
}

class OrderService {
  /**
   * API routes matching OrdersController
   * Controller: api/orders (non-versioned)
   */
  private apiRoute = {
    BASE: "/orders",
    QUEUE: "/orders/queue",
    TODAY: "/orders/today",
  };

  /**
   * Get orders list with filters
   * API: GET /orders?pageNumber=&pageSize=&search=&status=&fromDate=&toDate=
   */
  async getList(
    params?: OrderQueryParams,
  ): Promise<ApiResponse<OrderListResponse>> {
    return api.get<ApiResponse<OrderListResponse>>(this.apiRoute.BASE, {
      params: {
        pageNumber: params?.pageNumber ?? 1,
        pageSize: params?.pageSize ?? 20,
        search: params?.search,
        status: params?.status,
        paymentStatus: params?.paymentStatus,
        fromDate: params?.fromDate,
        toDate: params?.toDate,
      },
    });
  }

  /**
   * Get order by ID
   * API: GET /orders/{id}
   */
  async getById(id: string): Promise<ApiResponse<OrderDetailResponse>> {
    return api.get<ApiResponse<OrderDetailResponse>>(
      `${this.apiRoute.BASE}/${id}`,
    );
  }

  /**
   * Get order by order number
   * API: GET /orders/number/{orderNumber}
   */
  async getByNumber(
    orderNumber: string,
  ): Promise<ApiResponse<OrderDetailResponse>> {
    return api.get<ApiResponse<OrderDetailResponse>>(
      `${this.apiRoute.BASE}/number/${orderNumber}`,
    );
  }

  /**
   * Get orders in queue (Pending, Confirmed, Preparing, Ready)
   * API: GET /orders/queue
   */
  async getQueue(): Promise<ApiResponse<OrderListResponse>> {
    return api.get<ApiResponse<OrderListResponse>>(this.apiRoute.QUEUE);
  }

  /**
   * Get today's orders
   * API: GET /orders/today
   */
  async getTodayOrders(): Promise<ApiResponse<OrderListResponse>> {
    return api.get<ApiResponse<OrderListResponse>>(this.apiRoute.TODAY);
  }

  /**
   * Create new order
   * API: POST /orders
   */
  async create(data: CreateOrderRequest): Promise<ApiResponse<Order>> {
    return api.post<ApiResponse<Order>>(this.apiRoute.BASE, data);
  }

  /**
   * Update order status
   * API: PATCH /orders/{id}/status
   */
  async updateStatus(
    id: string,
    data: UpdateOrderStatusRequest,
  ): Promise<ApiResponse<Order>> {
    return api.patch<ApiResponse<Order>>(
      `${this.apiRoute.BASE}/${id}/status`,
      data,
    );
  }

  /**
   * Update payment status
   * API: PATCH /orders/{id}/payment
   */
  async updatePaymentStatus(
    id: string,
    data: { paymentStatus: string; paymentMethod?: string },
  ): Promise<ApiResponse<Order>> {
    return api.patch<ApiResponse<Order>>(
      `${this.apiRoute.BASE}/${id}/payment`,
      data,
    );
  }

  /**
   * Cancel order
   * API: POST /orders/{id}/cancel
   */
  async cancel(id: string, reason?: string): Promise<ApiResponse<Order>> {
    return api.post<ApiResponse<Order>>(`${this.apiRoute.BASE}/${id}/cancel`, {
      reason,
    });
  }

  /**
   * Get order receipt for printing
   * API: GET /orders/{id}/receipt
   */
  async getReceipt(id: string): Promise<ApiResponse<any>> {
    return api.get<ApiResponse<any>>(`${this.apiRoute.BASE}/${id}/receipt`);
  }

  /**
   * Quick action - Confirm order
   * API: POST /orders/{id}/confirm
   */
  async confirmOrder(id: string): Promise<ApiResponse<Order>> {
    return api.post<ApiResponse<Order>>(`${this.apiRoute.BASE}/${id}/confirm`);
  }

  /**
   * Quick action - Start preparing
   * API: POST /orders/{id}/prepare
   */
  async prepareOrder(id: string): Promise<ApiResponse<Order>> {
    return api.post<ApiResponse<Order>>(`${this.apiRoute.BASE}/${id}/prepare`);
  }

  /**
   * Quick action - Mark order as ready
   * API: POST /orders/{id}/ready
   */
  async markReady(id: string): Promise<ApiResponse<Order>> {
    return api.post<ApiResponse<Order>>(`${this.apiRoute.BASE}/${id}/ready`);
  }

  /**
   * Quick action - Complete order
   * API: POST /orders/{id}/complete
   */
  async completeOrder(id: string): Promise<ApiResponse<Order>> {
    return api.post<ApiResponse<Order>>(`${this.apiRoute.BASE}/${id}/complete`);
  }

  /**
   * Get pending orders
   */
  async getPendingOrders(): Promise<ApiResponse<OrderListResponse>> {
    return this.getList({ status: "Pending" });
  }
}

export default new OrderService();
