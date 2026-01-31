import api from "@/lib/api";
import { ApiResponse, PaginationParams } from "@/models/common";
import {
	Product,
	ProductListResponse,
	ProductDetailResponse,
} from "@/models/product";

interface ProductQueryParams extends PaginationParams {
	categoryId?: string;
	isActive?: boolean;
}

class ProductService {
	private apiRoute = {
		GET_LIST: "/products",
		GET_BY_ID: "/products/:id",
		GET_BY_CATEGORY: "/products/category/:categoryId",
	};

	/**
	 * Get all products
	 */
	async getList(
		params?: ProductQueryParams,
	): Promise<ApiResponse<ProductListResponse>> {
		return api.get<ApiResponse<ProductListResponse>>(this.apiRoute.GET_LIST, {
			params,
		});
	}

	/**
	 * Get active products only (for mobile app)
	 */
	async getActiveProducts(
		categoryId?: string,
	): Promise<ApiResponse<ProductListResponse>> {
		return api.get<ApiResponse<ProductListResponse>>(this.apiRoute.GET_LIST, {
			params: { isActive: true, categoryId },
		});
	}

	/**
	 * Get products by category
	 */
	async getByCategory(
		categoryId: string,
	): Promise<ApiResponse<ProductListResponse>> {
		return api.get<ApiResponse<ProductListResponse>>(
			this.apiRoute.GET_BY_CATEGORY.replace(":categoryId", categoryId),
		);
	}

	/**
	 * Get product detail by ID (includes available toppings)
	 */
	async getById(id: string): Promise<ApiResponse<ProductDetailResponse>> {
		return api.get<ApiResponse<ProductDetailResponse>>(
			this.apiRoute.GET_BY_ID.replace(":id", id),
		);
	}
}

export default new ProductService();
