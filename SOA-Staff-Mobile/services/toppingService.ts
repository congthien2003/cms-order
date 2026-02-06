import api from "@/lib/api";
import { ApiResponse } from "@/models/common";
import { Topping, ToppingListResponse } from "@/models/topping";

class ToppingService {
  /**
   * API routes matching ToppingsController
   * Controller: api/toppings (non-versioned)
   */
  private apiRoute = {
    BASE: "/toppings",
  };

  /**
   * Get list of toppings with optional filters
   * API: GET /toppings?isActive=&searchTerm=&pageNumber=&pageSize=
   */
  async getList(params?: {
    isActive?: boolean;
    searchTerm?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<ApiResponse<ToppingListResponse>> {
    return api.get<ApiResponse<ToppingListResponse>>(this.apiRoute.BASE, {
      params: {
        isActive: params?.isActive,
        searchTerm: params?.searchTerm,
        pageNumber: params?.pageNumber ?? 1,
        pageSize: params?.pageSize ?? 50,
      },
    });
  }

  /**
   * Get active toppings only
   * API: GET /toppings?isActive=true
   */
  async getActiveToppings(): Promise<ApiResponse<ToppingListResponse>> {
    return this.getList({ isActive: true });
  }

  /**
   * Get topping by ID
   * API: GET /toppings/{id}
   */
  async getById(id: string): Promise<ApiResponse<Topping>> {
    return api.get<ApiResponse<Topping>>(`${this.apiRoute.BASE}/${id}`);
  }
}

export default new ToppingService();
