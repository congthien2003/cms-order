import api from '@/lib/axios';
import type { ApiResponse } from '@/models/common/api';
import type {
  ErrorLogDetail,
  ErrorLogPagedResponse,
  ErrorLogQueryParams,
} from '@/models/error-log';

const BASE_URL = '/v1/error-logs';

const routes = {
  list: BASE_URL,
  byId: (id: string) => `${BASE_URL}/${id}`,
};

const errorLogService = {
  getList: async (
    params?: ErrorLogQueryParams
  ): Promise<ApiResponse<ErrorLogPagedResponse>> => {
    const response = await api.get(routes.list, { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<ErrorLogDetail>> => {
    const response = await api.get(routes.byId(id));
    return response.data;
  },
};

export default errorLogService;
