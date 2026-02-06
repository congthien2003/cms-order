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
  /**
   * API routes matching ProductsController
   * Controller: api/v{v:apiVersion}/products
   */
  private apiRoute = {
    GET_LIST: "/v1/products/list",
    GET_BY_ID: "/v1/products",
    GET_BY_CATEGORY: "/v1/products/by-category",
  };

  /**
   * Get paginated list of products
   * API: POST /v1/products/list (body: GetProductsListParameters)
   */
  async getList(
    params?: ProductQueryParams,
  ): Promise<ApiResponse<ProductListResponse>> {
    return api.post<ApiResponse<ProductListResponse>>(this.apiRoute.GET_LIST, {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
      searchTerm: params?.searchTerm ?? "",
      sortBy: params?.sortBy ?? null,
      sortDescending: params?.sortDescending ?? false,
      isActive: params?.isActive ?? null,
      categoryId: params?.categoryId ?? null,
    });
  }

  /**
   * Get active products only (for mobile app)
   */
  async getActiveProducts(
    categoryId?: string,
  ): Promise<ApiResponse<ProductListResponse>> {
    return this.getList({ isActive: true, categoryId, pageSize: 50 });
  }

  /**
   * Get products by category
   * API: GET /v1/products/by-category/{categoryId}?page=&pageSize=&searchTerm=
   */
  async getByCategory(
    categoryId: string,
    page: number = 1,
    pageSize: number = 20,
    searchTerm?: string,
  ): Promise<ApiResponse<ProductListResponse>> {
    return api.get<ApiResponse<ProductListResponse>>(
      `${this.apiRoute.GET_BY_CATEGORY}/${categoryId}`,
      {
        params: { page, pageSize, searchTerm },
      },
    );
  }

  /**
   * Get product detail by ID (includes sizes, toppings)
   * API: GET /v1/products/{id}
   */
  async getById(id: string): Promise<ApiResponse<ProductDetailResponse>> {
    return api.get<ApiResponse<ProductDetailResponse>>(
      `${this.apiRoute.GET_BY_ID}/${id}`,
    );
  }
}

export default new ProductService();
