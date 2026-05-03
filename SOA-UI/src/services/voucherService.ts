import api from '@/lib/axios';
import type { ApiResponse, PagedList } from '@/models/common/api';
import type {
  Voucher,
  CreateVoucherRequest,
  UpdateVoucherRequest,
  ValidateVoucherRequest,
  ValidateVoucherResponse,
} from '@/models/pos';

const BASE_URL = '/v1/vouchers';

const routes = {
  list: BASE_URL,
  byId: (id: string) => `${BASE_URL}/${id}`,
  validate: `${BASE_URL}/validate`,
  toggleStatus: (id: string) => `${BASE_URL}/${id}/toggle-status`,
};

export const voucherService = {
  // Get vouchers list with pagination
  getList: async (params?: {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<PagedList<Voucher>>> => {
    const response = await api.get(routes.list, { params });
    return response.data;
  },

  // Get voucher by ID
  getById: async (id: string): Promise<ApiResponse<Voucher>> => {
    const response = await api.get(routes.byId(id));
    return response.data;
  },

  // Validate voucher code
  validate: async (
    data: ValidateVoucherRequest
  ): Promise<ApiResponse<ValidateVoucherResponse>> => {
    const response = await api.post(routes.validate, data);
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
    const response = await api.put(routes.byId(id), data);
    return response.data;
  },

  // Delete voucher
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(routes.byId(id));
    return response.data;
  },

  // Toggle voucher status
  toggleStatus: async (id: string): Promise<ApiResponse<Voucher>> => {
    const response = await api.patch(routes.toggleStatus(id));
    return response.data;
  },
};

export default voucherService;
