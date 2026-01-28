import api from '@/lib/axios';
import type { ApiResponse, PagedList } from '@/models/common/api';
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductSize,
  ProductTopping,
} from '@/models/pos';

const BASE_URL = '/v1/products';

export const productService = {
  // Get products list with pagination
  getList: async (params?: {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
    categoryId?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<PagedList<Product>>> => {
    const response = await api.post(`${BASE_URL}/list`, params || {});
    return response.data;
  },

  // Get products by category (for POS menu)
  getByCategory: async (
    categoryId: string
  ): Promise<ApiResponse<Product[]>> => {
    const response = await api.get(`${BASE_URL}/by-category/${categoryId}`);
    return response.data;
  },

  // Get product by ID
  getById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Create new product
  create: async (data: CreateProductRequest): Promise<ApiResponse<Product>> => {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  // Update product
  update: async (
    id: string,
    data: UpdateProductRequest
  ): Promise<ApiResponse<Product>> => {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Delete product
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Toggle product status
  toggleStatus: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await api.patch(`${BASE_URL}/${id}/toggle-status`);
    return response.data;
  },

  // === Product Sizes ===

  // Add size to product
  addSize: async (
    productId: string,
    data: {
      sizeName: string;
      priceAdjustment: number;
      isDefault?: boolean;
    }
  ): Promise<ApiResponse<ProductSize>> => {
    const response = await api.post(`${BASE_URL}/${productId}/sizes`, data);
    return response.data;
  },

  // Update size
  updateSize: async (
    productId: string,
    sizeId: string,
    data: {
      sizeName: string;
      priceAdjustment: number;
      isDefault?: boolean;
      isActive?: boolean;
    }
  ): Promise<ApiResponse<ProductSize>> => {
    const response = await api.put(
      `${BASE_URL}/${productId}/sizes/${sizeId}`,
      data
    );
    return response.data;
  },

  // Delete size
  deleteSize: async (
    productId: string,
    sizeId: string
  ): Promise<ApiResponse<void>> => {
    const response = await api.delete(
      `${BASE_URL}/${productId}/sizes/${sizeId}`
    );
    return response.data;
  },

  // === Product Toppings ===

  // Get product toppings
  getToppings: async (
    productId: string
  ): Promise<ApiResponse<ProductTopping[]>> => {
    const response = await api.get(`${BASE_URL}/${productId}/toppings`);
    return response.data;
  },

  // Add topping to product
  addTopping: async (
    productId: string,
    data: {
      toppingId: string;
      isDefault?: boolean;
    }
  ): Promise<ApiResponse<ProductTopping>> => {
    const response = await api.post(`${BASE_URL}/${productId}/toppings`, data);
    return response.data;
  },

  // Remove topping from product
  removeTopping: async (
    productId: string,
    toppingId: string
  ): Promise<ApiResponse<void>> => {
    const response = await api.delete(
      `${BASE_URL}/${productId}/toppings/${toppingId}`
    );
    return response.data;
  },

  // Update product toppings (bulk)
  updateToppings: async (
    productId: string,
    data: {
      toppingIds: string[];
    }
  ): Promise<ApiResponse<ProductTopping[]>> => {
    const response = await api.put(`${BASE_URL}/${productId}/toppings`, data);
    return response.data;
  },
};

export default productService;
