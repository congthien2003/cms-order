import api from '@/lib/axios';
import type { ApiResponse, PagedList } from '@/models/common/api';
import type {
  Voucher,
  CreateVoucherRequest,
  UpdateVoucherRequest,
  ValidateVoucherRequest,
  ValidateVoucherResponse,
} from '@/models/pos';

const BASE_URL = '/Vouchers';

export const voucherService = {
  // Get vouchers list with pagination
  getList: async (params?: {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<PagedList<Voucher>>> => {
    const response = await api.get(BASE_URL, { params });
    return response.data;
  },

  // Get voucher by ID
  getById: async (id: string): Promise<ApiResponse<Voucher>> => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Validate voucher code
  validate: async (
    data: ValidateVoucherRequest
  ): Promise<ApiResponse<ValidateVoucherResponse>> => {
    const response = await api.post(`${BASE_URL}/validate`, data);
    return response.data;
  },

  // Create new voucher
  create: async (data: CreateVoucherRequest): Promise<ApiResponse<Voucher>> => {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  // Update voucher
  update: async (
    id: string,
    data: UpdateVoucherRequest
  ): Promise<ApiResponse<Voucher>> => {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Delete voucher
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Toggle voucher status
  toggleStatus: async (id: string): Promise<ApiResponse<Voucher>> => {
    const response = await api.patch(`${BASE_URL}/${id}/toggle-status`);
    return response.data;
  },
};

export default voucherService;
