import api from "@/lib/api";
import { ApiResponse, PaginationParams } from "@/models/common";
import { Category, CategoryListResponse } from "@/models/category";

class CategoryService {
  /**
   * API routes matching CategoryController
   * Controller: api/v{v:apiVersion}/categories
   */
  private apiRoute = {
    GET_LIST: "/v1/categories/list",
    GET_BY_ID: "/v1/categories",
  };

  /**
   * Get paginated list of categories
   * API: POST /v1/categories/list (body: GetListParameters)
   */
  async getList(
    params?: PaginationParams & { isActive?: boolean },
  ): Promise<ApiResponse<CategoryListResponse>> {
    return api.post<ApiResponse<CategoryListResponse>>(this.apiRoute.GET_LIST, {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 50,
      searchTerm: params?.searchTerm ?? "",
      sortBy: params?.sortBy ?? null,
      sortDescending: params?.sortDescending ?? false,
      isActive: params?.isActive ?? null,
    });
  }

  /**
   * Get active categories only (for mobile app)
   * API: POST /v1/categories/list (body with isActive: true)
   */
  async getActiveCategories(): Promise<ApiResponse<CategoryListResponse>> {
    return this.getList({ isActive: true, pageSize: 100 });
  }

  /**
   * Get category by ID
   * API: GET /v1/categories/{id}
   */
  async getById(id: string): Promise<ApiResponse<Category>> {
    return api.get<ApiResponse<Category>>(`${this.apiRoute.GET_BY_ID}/${id}`);
  }
}

export default new CategoryService();
