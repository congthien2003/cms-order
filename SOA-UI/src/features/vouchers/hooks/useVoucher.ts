import { useState, useCallback, useEffect } from 'react';
import { voucherService } from '@/services';
import type {
  Voucher,
  CreateVoucherRequest,
  UpdateVoucherRequest,
} from '@/models/pos';
import type {
  ApiResponse,
  PagedList,
  PaginationParams,
} from '@/models/common/api';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

export const useVoucher = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vouchers, setVouchers] = useState<PagedList<Voucher> | null>(null);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchVouchers = useCallback(
    async (params?: {
      page?: number;
      pageSize?: number;
      searchTerm?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await voucherService.getList({
          pageNumber: params?.page ?? pagination.page,
          pageSize: params?.pageSize ?? pagination.pageSize,
          searchTerm: params?.searchTerm ?? (searchTerm || undefined),
        });
        if (response?.success && response.data) {
          setVouchers(response.data);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch vouchers';
        setError(errorMessage);
        showErrorToast('Không thể tải danh sách voucher');
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.pageSize, searchTerm]
  );

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const handlePageChange = useCallback(
    (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
      fetchVouchers({
        page,
        pageSize: pagination.pageSize,
        searchTerm: searchTerm || undefined,
      });
    },
    [pagination.pageSize, searchTerm, fetchVouchers]
  );

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchVouchers({
        page: 1,
        pageSize: pagination.pageSize,
        searchTerm: term || undefined,
      });
    },
    [pagination.pageSize, fetchVouchers]
  );

  const getVoucherById = useCallback(
    async (id: string): Promise<ApiResponse<Voucher> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await voucherService.getById(id);
        if (response?.success && response.data) {
          setEditingVoucher(response.data);
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch voucher';
        setError(errorMessage);
        showErrorToast('Không thể tải thông tin voucher');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createVoucher = useCallback(
    async (
      data: CreateVoucherRequest
    ): Promise<ApiResponse<Voucher> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await voucherService.create(data);
        if (response?.success) {
          showSuccessToast('Tạo voucher thành công');
          fetchVouchers();
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create voucher';
        setError(errorMessage);
        showErrorToast('Tạo voucher thất bại');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchVouchers]
  );

  const updateVoucher = useCallback(
    async (
      id: string,
      data: UpdateVoucherRequest
    ): Promise<ApiResponse<Voucher> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await voucherService.update(id, data);
        if (response?.success) {
          showSuccessToast('Cập nhật voucher thành công');
          fetchVouchers();
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update voucher';
        setError(errorMessage);
        showErrorToast('Cập nhật voucher thất bại');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchVouchers]
  );

  const deleteVoucher = useCallback(
    async (id: string): Promise<ApiResponse<void> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await voucherService.delete(id);
        if (response?.success) {
          showSuccessToast('Xóa voucher thành công');
          fetchVouchers();
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete voucher';
        setError(errorMessage);
        showErrorToast('Xóa voucher thất bại');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchVouchers]
  );

  const toggleStatus = useCallback(
    async (voucher: Voucher): Promise<ApiResponse<Voucher> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await voucherService.toggleStatus(voucher.id);
        if (response?.success) {
          showSuccessToast(
            `${voucher.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'} voucher thành công`
          );
          fetchVouchers();
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to toggle status';
        setError(errorMessage);
        showErrorToast('Không thể thay đổi trạng thái');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchVouchers]
  );

  const clearEditingVoucher = useCallback(() => {
    setEditingVoucher(null);
  }, []);

  // Helper: Generate random voucher code
  const generateVoucherCode = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }, []);

  // Helper: Format discount display
  const formatDiscount = useCallback((voucher: Voucher) => {
    if (voucher.discountType === 'Percentage') {
      return `${voucher.discountValue}%`;
    }
    return `${voucher.discountValue.toLocaleString('vi-VN')} ₫`;
  }, []);

  // Helper: Copy voucher code to clipboard
  const copyToClipboard = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    showSuccessToast('Đã sao chép mã voucher');
  }, []);

  return {
    // State
    loading,
    error,
    vouchers,
    editingVoucher,
    pagination,
    searchTerm,

    // Actions
    fetchVouchers,
    handlePageChange,
    handleSearch,
    getVoucherById,
    createVoucher,
    updateVoucher,
    deleteVoucher,
    toggleStatus,
    clearEditingVoucher,
    setEditingVoucher,

    // Helpers
    generateVoucherCode,
    formatDiscount,
    copyToClipboard,
  };
};

export default useVoucher;
