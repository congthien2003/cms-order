import { useState, useCallback, useEffect } from 'react';
import { settingsService } from '@/services';
import type { ShopSettings, UpdateShopSettingsRequest } from '@/models/pos';
import type { ApiResponse } from '@/models/common/api';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

export const useSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [formData, setFormData] = useState<UpdateShopSettingsRequest>({
    shopName: '',
    address: '',
    phoneNumber: '',
    openTime: '',
    closeTime: '',
    isOpen: true,
    taxRate: 0,
    serviceFee: 0,
    currency: 'VND',
  });

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await settingsService.get();
      if (response?.success && response.data) {
        setSettings(response.data);
        setFormData({
          shopName: response.data.shopName || '',
          address: response.data.address || '',
          phoneNumber: response.data.phoneNumber || response.data.phone || '',
          openTime: response.data.openTime || '',
          closeTime: response.data.closeTime || '',
          isOpen: response.data.isOpen ?? true,
          taxRate: response.data.taxRate || 0,
          serviceFee: response.data.serviceFee || 0,
          currency: response.data.currency || 'VND',
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch settings';
      setError(errorMessage);
      showErrorToast('Không thể tải cài đặt');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback(
    async (
      data?: UpdateShopSettingsRequest
    ): Promise<ApiResponse<ShopSettings> | null> => {
      setSaving(true);
      setError(null);
      try {
        const response = await settingsService.update(data || formData);
        if (response?.success) {
          showSuccessToast('Lưu cài đặt thành công');
          if (response.data) {
            setSettings(response.data);
          }
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update settings';
        setError(errorMessage);
        showErrorToast('Không thể lưu cài đặt');
        return null;
      } finally {
        setSaving(false);
      }
    },
    [formData]
  );

  const updateFormField = useCallback(
    <K extends keyof UpdateShopSettingsRequest>(
      field: K,
      value: UpdateShopSettingsRequest[K]
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return {
    // State
    loading,
    saving,
    error,
    settings,
    formData,

    // Actions
    fetchSettings,
    updateSettings,
    updateFormField,
    setFormData,
  };
};

export default useSettings;
