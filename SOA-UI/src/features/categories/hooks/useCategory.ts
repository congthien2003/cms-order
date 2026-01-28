import { useState, useCallback, useEffect } from 'react';
import { categoryService } from '@/services';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/models/pos';
import type {
  ApiResponse,
  PagedList,
  PaginationParams,
} from '@/models/common/api';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

export const useCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<PagedList<Category> | null>(
    null
  );
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCategories = useCallback(
    async (params?: {
      page?: number;
      pageSize?: number;
      searchTerm?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await categoryService.getList({
          page: params?.page ?? pagination.page,
          pageSize: params?.pageSize ?? pagination.pageSize,
          searchTerm: params?.searchTerm ?? (searchTerm || undefined),
        });
        if (response?.success && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch categories';
        setError(errorMessage);
        showErrorToast('Không thể tải danh sách danh mục');
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.pageSize, searchTerm]
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handlePageChange = useCallback(
    (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
      fetchCategories({
        page,
        pageSize: pagination.pageSize,
        searchTerm: searchTerm || undefined,
      });
    },
    [pagination.pageSize, searchTerm, fetchCategories]
  );

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchCategories({
        page: 1,
        pageSize: pagination.pageSize,
        searchTerm: term || undefined,
      });
    },
    [pagination.pageSize, fetchCategories]
  );

  const getCategoryById = useCallback(
    async (id: string): Promise<ApiResponse<Category> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await categoryService.getById(id);
        if (response?.success && response.data) {
          setEditingCategory(response.data);
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch category';
        setError(errorMessage);
        showErrorToast('Không thể tải thông tin danh mục');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createCategory = useCallback(
    async (
      data: CreateCategoryRequest
    ): Promise<ApiResponse<Category> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await categoryService.create(data);
        if (response?.success) {
          showSuccessToast('Tạo danh mục thành công');
          fetchCategories();
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create category';
        setError(errorMessage);
        showErrorToast('Tạo danh mục thất bại');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchCategories]
  );

  const updateCategory = useCallback(
    async (
      id: string,
      data: UpdateCategoryRequest
    ): Promise<ApiResponse<Category> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await categoryService.update(id, data);
        if (response?.success) {
          showSuccessToast('Cập nhật danh mục thành công');
          fetchCategories();
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update category';
        setError(errorMessage);
        showErrorToast('Cập nhật danh mục thất bại');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchCategories]
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<ApiResponse<void> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await categoryService.delete(id);
        if (response?.success) {
          showSuccessToast('Xóa danh mục thành công');
          fetchCategories();
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete category';
        setError(errorMessage);
        showErrorToast('Xóa danh mục thất bại');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchCategories]
  );

  const toggleStatus = useCallback(
    async (category: Category): Promise<ApiResponse<Category> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await categoryService.toggleStatus(category.id);
        if (response?.success) {
          showSuccessToast(
            `${category.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'} danh mục thành công`
          );
          fetchCategories();
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
    [fetchCategories]
  );

  const clearEditingCategory = useCallback(() => {
    setEditingCategory(null);
  }, []);

  return {
    // State
    loading,
    error,
    categories,
    editingCategory,
    pagination,
    searchTerm,

    // Actions
    fetchCategories,
    handlePageChange,
    handleSearch,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleStatus,
    clearEditingCategory,
    setEditingCategory,
  };
};

export default useCategory;
