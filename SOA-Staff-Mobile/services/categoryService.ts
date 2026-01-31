import api from "@/lib/api";
import { ApiResponse, PaginationParams } from "@/models/common";
import { Category, CategoryListResponse } from "@/models/category";

class CategoryService {
	private apiRoute = {
		GET_LIST: "/categories",
		GET_BY_ID: "/categories/:id",
	};

	/**
	 * Get all categories
	 */
	async getList(
		params?: PaginationParams,
	): Promise<ApiResponse<CategoryListResponse>> {
		return api.get<ApiResponse<CategoryListResponse>>(this.apiRoute.GET_LIST, {
			params,
		});
	}

	/**
	 * Get active categories only (for mobile app)
	 */
	async getActiveCategories(): Promise<ApiResponse<CategoryListResponse>> {
		return api.get<ApiResponse<CategoryListResponse>>(this.apiRoute.GET_LIST, {
			params: { isActive: true },
		});
	}

	/**
	 * Get category by ID
	 */
	async getById(id: string): Promise<ApiResponse<Category>> {
		return api.get<ApiResponse<Category>>(
			this.apiRoute.GET_BY_ID.replace(":id", id),
		);
	}
}

export default new CategoryService();
