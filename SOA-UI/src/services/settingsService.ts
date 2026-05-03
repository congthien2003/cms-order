import api from '@/lib/axios';
import type { ApiResponse } from '@/models/common/api';
import type { ShopSettings, UpdateShopSettingsRequest } from '@/models/pos';

const BASE_URL = '/v1/settings';

const routes = {
  base: BASE_URL,
};

export const settingsService = {
  // Get shop settings
  get: async (): Promise<ApiResponse<ShopSettings>> => {
    const response = await api.get(routes.base);
    return response.data;
  },

  // Update shop settings
  update: async (
    data: UpdateShopSettingsRequest
  ): Promise<ApiResponse<ShopSettings>> => {
    const response = await api.put(routes.base, data);
    return response.data;
  },
};

export default settingsService;
