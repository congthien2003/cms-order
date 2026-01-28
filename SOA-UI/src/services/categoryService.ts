import api from '@/lib/axios';
import type { ApiResponse, PagedList } from '@/models/common/api';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/models/pos';

const BASE_URL = '/v1/categories';

export const categoryService = {
  // Get categories list with pagination
  getList: async (params?: {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<PagedList<Category>>> => {
    const response = await api.post(`${BASE_URL}/list`, params || {});
    return response.data;
  },

  // Get all active categories (for dropdowns)
  getAllActive: async (): Promise<ApiResponse<Category[]>> => {
    const response = await api.post(`${BASE_URL}/list`, {
      pageSize: 1000,
      isActive: true,
    });
    return {
      ...response.data,
      data: response.data.data?.items || [],
    };
  },

  // Get category by ID
  getById: async (id: string): Promise<ApiResponse<Category>> => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Create new category
  create: async (
    data: CreateCategoryRequest
  ): Promise<ApiResponse<Category>> => {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  // Update category
  update: async (
    id: string,
    data: UpdateCategoryRequest
  ): Promise<ApiResponse<Category>> => {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Delete category
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Toggle category status
  toggleStatus: async (id: string): Promise<ApiResponse<Category>> => {
    const response = await api.patch(`${BASE_URL}/${id}/toggle-status`);
    return response.data;
  },
};

export default categoryService;
