import api from '@/lib/axios';
import type { ApiResponse, PagedList } from '@/models/common/api';
import type {
  Topping,
  CreateToppingRequest,
  UpdateToppingRequest,
} from '@/models/pos';

const BASE_URL = '/v1/toppings';

const routes = {
  list: BASE_URL,
  byId: (id: string) => `${BASE_URL}/${id}`,
  toggleStatus: (id: string) => `${BASE_URL}/${id}/toggle-status`,
};

export const toppingService = {
  // Get toppings list with pagination
  getList: async (params?: {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<PagedList<Topping>>> => {
    const response = await api.get(routes.list, { params });
    return response.data;
  },

  // Get all active toppings (for dropdowns/POS)
  getAllActive: async (): Promise<ApiResponse<Topping[]>> => {
    const response = await api.get(routes.list, {
      params: { pageSize: 1000, isActive: true },
    });
    return {
      ...response.data,
      data: response.data.data?.items || [],
    };
  },

  // Get topping by ID
  getById: async (id: string): Promise<ApiResponse<Topping>> => {
    const response = await api.get(routes.byId(id));
    return response.data;
  },

  // Create new topping
  create: async (data: CreateToppingRequest): Promise<ApiResponse<Topping>> => {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  // Update topping
  update: async (
    id: string,
    data: UpdateToppingRequest
  ): Promise<ApiResponse<Topping>> => {
    const response = await api.put(routes.byId(id), data);
    return response.data;
  },

  // Delete topping
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(routes.byId(id));
    return response.data;
  },

  // Toggle topping status
  toggleStatus: async (id: string): Promise<ApiResponse<Topping>> => {
    const response = await api.patch(routes.toggleStatus(id));
    return response.data;
  },
};

export default toppingService;
