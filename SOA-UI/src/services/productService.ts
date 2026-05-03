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

const routes = {
  list: `${BASE_URL}/list`,
  byCategory: (categoryId: string) => `${BASE_URL}/by-category/${categoryId}`,
  byId: (id: string) => `${BASE_URL}/${id}`,
  toggleStatus: (id: string) => `${BASE_URL}/${id}/toggle-status`,
  sizes: (productId: string) => `${BASE_URL}/${productId}/sizes`,
  sizeById: (productId: string, sizeId: string) =>
    `${BASE_URL}/${productId}/sizes/${sizeId}`,
  toppings: (productId: string) => `${BASE_URL}/${productId}/toppings`,
  toppingById: (productId: string, toppingId: string) =>
    `${BASE_URL}/${productId}/toppings/${toppingId}`,
};

export const productService = {
  // Get products list with pagination
  getList: async (params?: {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
    categoryId?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<PagedList<Product>>> => {
    const response = await api.post(routes.list, params || {});
    return response.data;
  },

  // Get products by category (for POS menu)
  getByCategory: async (
    categoryId: string
  ): Promise<ApiResponse<Product[]>> => {
    const response = await api.get(routes.byCategory(categoryId));
    return response.data;
  },

  // Get product by ID
  getById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await api.get(routes.byId(id));
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
    const response = await api.put(routes.byId(id), data);
    return response.data;
  },

  // Delete product
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(routes.byId(id));
    return response.data;
  },

  // Toggle product status
  toggleStatus: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await api.patch(routes.toggleStatus(id));
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
    const response = await api.post(routes.sizes(productId), data);
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
    const response = await api.put(routes.sizeById(productId, sizeId), data);
    return response.data;
  },

  // Delete size
  deleteSize: async (
    productId: string,
    sizeId: string
  ): Promise<ApiResponse<void>> => {
    const response = await api.delete(routes.sizeById(productId, sizeId));
    return response.data;
  },

  // === Product Toppings ===

  // Get product toppings
  getToppings: async (
    productId: string
  ): Promise<ApiResponse<ProductTopping[]>> => {
    const response = await api.get(routes.toppings(productId));
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
    const response = await api.post(routes.toppings(productId), data);
    return response.data;
  },

  // Remove topping from product
  removeTopping: async (
    productId: string,
    toppingId: string
  ): Promise<ApiResponse<void>> => {
    const response = await api.delete(routes.toppingById(productId, toppingId));
    return response.data;
  },

  // Update product toppings (bulk)
  updateToppings: async (
    productId: string,
    data: {
      toppingIds: string[];
    }
  ): Promise<ApiResponse<ProductTopping[]>> => {
    const response = await api.put(routes.toppings(productId), data);
    return response.data;
  },
};

export default productService;
