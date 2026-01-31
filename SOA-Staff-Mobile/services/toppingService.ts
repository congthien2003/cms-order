import api from "@/lib/api";
import { ApiResponse } from "@/models/common";
import { Topping, ToppingListResponse } from "@/models/topping";

class ToppingService {
	private apiRoute = {
		GET_LIST: "/toppings",
		GET_BY_ID: "/toppings/:id",
		GET_BY_PRODUCT: "/toppings/product/:productId",
	};

	/**
	 * Get all toppings
	 */
	async getList(): Promise<ApiResponse<ToppingListResponse>> {
		return api.get<ApiResponse<ToppingListResponse>>(this.apiRoute.GET_LIST);
	}

	/**
	 * Get active toppings only
	 */
	async getActiveToppings(): Promise<ApiResponse<ToppingListResponse>> {
		return api.get<ApiResponse<ToppingListResponse>>(this.apiRoute.GET_LIST, {
			params: { isActive: true },
		});
	}

	/**
	 * Get toppings available for a specific product
	 */
	async getByProduct(
		productId: string,
	): Promise<ApiResponse<ToppingListResponse>> {
		return api.get<ApiResponse<ToppingListResponse>>(
			this.apiRoute.GET_BY_PRODUCT.replace(":productId", productId),
		);
	}

	/**
	 * Get topping by ID
	 */
	async getById(id: string): Promise<ApiResponse<Topping>> {
		return api.get<ApiResponse<Topping>>(
			this.apiRoute.GET_BY_ID.replace(":id", id),
		);
	}
}

export default new ToppingService();
