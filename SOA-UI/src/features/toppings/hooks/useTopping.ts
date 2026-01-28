import { useState, useCallback, useEffect } from 'react';
import { toppingService } from '@/services';
import type {
  Topping,
  CreateToppingRequest,
  UpdateToppingRequest,
} from '@/models/pos';
import type {
  ApiResponse,
  PagedList,
  PaginationParams,
} from '@/models/common/api';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

export const useTopping = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toppings, setToppings] = useState<PagedList<Topping> | null>(null);
  const [editingTopping, setEditingTopping] = useState<Topping | null>(null);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchToppings = useCallback(
    async (params?: {
      page?: number;
      pageSize?: number;
      searchTerm?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await toppingService.getList({
          pageNumber: params?.page ?? pagination.page,
          pageSize: params?.pageSize ?? pagination.pageSize,
          searchTerm: params?.searchTerm ?? (searchTerm || undefined),
        });
        if (response?.success && response.data) {
          setToppings(response.data);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch toppings';
        setError(errorMessage);
        showErrorToast('Không thể tải danh sách topping');
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.pageSize, searchTerm]
  );

  useEffect(() => {
    fetchToppings();
  }, [fetchToppings]);

  const handlePageChange = useCallback(
    (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
      fetchToppings({
        page,
        pageSize: pagination.pageSize,
        searchTerm: searchTerm || undefined,
      });
    },
    [pagination.pageSize, searchTerm, fetchToppings]
  );

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchToppings({
        page: 1,
        pageSize: pagination.pageSize,
        searchTerm: term || undefined,
      });
    },
    [pagination.pageSize, fetchToppings]
  );

  const getToppingById = useCallback(
    async (id: string): Promise<ApiResponse<Topping> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await toppingService.getById(id);
        if (response?.success && response.data) {
          setEditingTopping(response.data);
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch topping';
        setError(errorMessage);
        showErrorToast('Không thể tải thông tin topping');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createTopping = useCallback(
    async (
      data: CreateToppingRequest
    ): Promise<ApiResponse<Topping> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await toppingService.create(data);
        if (response?.success) {
          showSuccessToast('Tạo topping thành công');
          fetchToppings();
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create topping';
        setError(errorMessage);
        showErrorToast('Tạo topping thất bại');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchToppings]
  );

  const updateTopping = useCallback(
    async (
      id: string,
      data: UpdateToppingRequest
    ): Promise<ApiResponse<Topping> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await toppingService.update(id, data);
        if (response?.success) {
          showSuccessToast('Cập nhật topping thành công');
          fetchToppings();
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update topping';
        setError(errorMessage);
        showErrorToast('Cập nhật topping thất bại');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchToppings]
  );

  const deleteTopping = useCallback(
    async (id: string): Promise<ApiResponse<void> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await toppingService.delete(id);
        if (response?.success) {
          showSuccessToast('Xóa topping thành công');
          fetchToppings();
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete topping';
        setError(errorMessage);
        showErrorToast('Xóa topping thất bại');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchToppings]
  );

  const toggleStatus = useCallback(
    async (topping: Topping): Promise<ApiResponse<Topping> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await toppingService.toggleStatus(topping.id);
        if (response?.success) {
          showSuccessToast(
            `${topping.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'} topping thành công`
          );
          fetchToppings();
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
    [fetchToppings]
  );

  const clearEditingTopping = useCallback(() => {
    setEditingTopping(null);
  }, []);

  return {
    // State
    loading,
    error,
    toppings,
    editingTopping,
    pagination,
    searchTerm,

    // Actions
    fetchToppings,
    handlePageChange,
    handleSearch,
    getToppingById,
    createTopping,
    updateTopping,
    deleteTopping,
    toggleStatus,
    clearEditingTopping,
    setEditingTopping,
  };
};

export default useTopping;
