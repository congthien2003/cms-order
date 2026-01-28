import api from '@/lib/axios';
import type { ApiResponse } from '@/models/common/api';
import type { ShopSettings, UpdateShopSettingsRequest } from '@/models/pos';

const BASE_URL = '/Settings';

export const settingsService = {
  // Get shop settings
  get: async (): Promise<ApiResponse<ShopSettings>> => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  // Update shop settings
  update: async (
    data: UpdateShopSettingsRequest
  ): Promise<ApiResponse<ShopSettings>> => {
    const response = await api.put(BASE_URL, data);
    return response.data;
  },
};

export default settingsService;
