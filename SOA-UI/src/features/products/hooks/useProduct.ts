import { useState, useCallback, useEffect } from 'react';
import { productService, categoryService } from '@/services';
import type {
  Product,
  Category,
  CreateProductRequest,
  UpdateProductRequest,
} from '@/models/pos';
import type {
  ApiResponse,
  PagedList,
  PaginationParams,
} from '@/models/common/api';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

export const useProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<PagedList<Product> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  // Fetch categories for dropdown
  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryService.getAllActive();
      if (response?.success) {
        setCategories(response.data);
      }
    } catch {
      console.error('Failed to fetch categories');
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const fetchProducts = useCallback(
    async (params?: {
      page?: number;
      pageSize?: number;
      searchTerm?: string;
      categoryId?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await productService.getList({
          page: params?.page ?? pagination.page,
          pageSize: params?.pageSize ?? pagination.pageSize,
          searchTerm: params?.searchTerm ?? (searchTerm || undefined),
          categoryId: params?.categoryId ?? (categoryFilter || undefined),
        });
        if (response?.success && response.data) {
          setProducts(response.data);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch products';
        setError(errorMessage);
        showErrorToast('Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.pageSize, searchTerm, categoryFilter]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePageChange = useCallback(
    (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
      fetchProducts({
        page,
        pageSize: pagination.pageSize,
        searchTerm: searchTerm || undefined,
        categoryId: categoryFilter || undefined,
      });
    },
    [pagination.pageSize, searchTerm, categoryFilter, fetchProducts]
  );

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchProducts({
        page: 1,
        pageSize: pagination.pageSize,
        searchTerm: term || undefined,
        categoryId: categoryFilter || undefined,
      });
    },
    [pagination.pageSize, categoryFilter, fetchProducts]
  );

  const handleCategoryFilter = useCallback(
    (value: string) => {
      const filterId = value === 'all' ? '' : value;
      setCategoryFilter(filterId);
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchProducts({
        page: 1,
        pageSize: pagination.pageSize,
        searchTerm: searchTerm || undefined,
        categoryId: filterId || undefined,
      });
    },
    [pagination.pageSize, searchTerm, fetchProducts]
  );

  const getProductById = useCallback(
    async (id: string): Promise<ApiResponse<Product> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await productService.getById(id);
        if (response?.success && response.data) {
          setEditingProduct(response.data);
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch product';
        setError(errorMessage);
        showErrorToast('Không thể tải thông tin sản phẩm');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createProduct = useCallback(
    async (
      data: CreateProductRequest
    ): Promise<ApiResponse<Product> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await productService.create(data);
        if (response?.success) {
          showSuccessToast('Tạo sản phẩm thành công');
          fetchProducts();
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create product';
        setError(errorMessage);
        showErrorToast('Tạo sản phẩm thất bại');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts]
  );

  const updateProduct = useCallback(
    async (
      id: string,
      data: UpdateProductRequest
    ): Promise<ApiResponse<Product> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await productService.update(id, data);
        if (response?.success) {
          showSuccessToast('Cập nhật sản phẩm thành công');
          fetchProducts();
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update product';
        setError(errorMessage);
        showErrorToast('Cập nhật sản phẩm thất bại');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts]
  );

  const deleteProduct = useCallback(
    async (id: string): Promise<ApiResponse<void> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await productService.delete(id);
        if (response?.success) {
          showSuccessToast('Xóa sản phẩm thành công');
          fetchProducts();
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete product';
        setError(errorMessage);
        showErrorToast('Xóa sản phẩm thất bại');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts]
  );

  const toggleStatus = useCallback(
    async (product: Product): Promise<ApiResponse<Product> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await productService.toggleStatus(product.id);
        if (response?.success) {
          showSuccessToast(
            `${product.isActive ? 'Ngừng bán' : 'Mở bán'} sản phẩm thành công`
          );
          fetchProducts();
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
    [fetchProducts]
  );

  const clearEditingProduct = useCallback(() => {
    setEditingProduct(null);
  }, []);

  return {
    // State
    loading,
    error,
    products,
    categories,
    editingProduct,
    pagination,
    searchTerm,
    categoryFilter,

    // Actions
    fetchProducts,
    fetchCategories,
    handlePageChange,
    handleSearch,
    handleCategoryFilter,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleStatus,
    clearEditingProduct,
    setEditingProduct,
  };
};

export default useProduct;
