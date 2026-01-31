import api from "@/lib/api";
import { ApiResponse, PaginationParams } from "@/models/common";
import {
	Order,
	OrderListResponse,
	OrderDetailResponse,
	CreateOrderRequest,
	UpdateOrderStatusRequest,
} from "@/models/order";

interface OrderQueryParams extends PaginationParams {
	status?: string;
	fromDate?: string;
	toDate?: string;
}

class OrderService {
	private apiRoute = {
		GET_LIST: "/orders",
		GET_BY_ID: "/orders/:id",
		CREATE: "/orders",
		UPDATE_STATUS: "/orders/:id/status",
		CANCEL: "/orders/:id/cancel",
	};

	/**
	 * Get orders list
	 */
	async getList(
		params?: OrderQueryParams,
	): Promise<ApiResponse<OrderListResponse>> {
		return api.get<ApiResponse<OrderListResponse>>(this.apiRoute.GET_LIST, {
			params,
		});
	}

	/**
	 * Get order by ID
	 */
	async getById(id: string): Promise<ApiResponse<OrderDetailResponse>> {
		return api.get<ApiResponse<OrderDetailResponse>>(
			this.apiRoute.GET_BY_ID.replace(":id", id),
		);
	}

	/**
	 * Create new order
	 */
	async create(data: CreateOrderRequest): Promise<ApiResponse<Order>> {
		return api.post<ApiResponse<Order>>(this.apiRoute.CREATE, data);
	}

	/**
	 * Update order status
	 */
	async updateStatus(
		id: string,
		data: UpdateOrderStatusRequest,
	): Promise<ApiResponse<Order>> {
		return api.patch<ApiResponse<Order>>(
			this.apiRoute.UPDATE_STATUS.replace(":id", id),
			data,
		);
	}

	/**
	 * Cancel order
	 */
	async cancel(id: string): Promise<ApiResponse<Order>> {
		return api.post<ApiResponse<Order>>(
			this.apiRoute.CANCEL.replace(":id", id),
		);
	}

	/**
	 * Get today's orders
	 */
	async getTodayOrders(): Promise<ApiResponse<OrderListResponse>> {
		const today = new Date().toISOString().split("T")[0];
		return this.getList({ fromDate: today, toDate: today });
	}

	/**
	 * Get pending orders
	 */
	async getPendingOrders(): Promise<ApiResponse<OrderListResponse>> {
		return this.getList({ status: "pending" });
	}
}

export default new OrderService();
