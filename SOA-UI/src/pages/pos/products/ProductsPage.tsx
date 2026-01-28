import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ConfirmDialog from '@/components/ui/dialog/ConfirmDialog';
import Page from '@/components/ui/page';
import type { Product } from '@/models/pos';

// Feature imports
import { ProductTable, useProduct } from '@/features/products';

export default function ProductsPage() {
  const navigate = useNavigate();

  // Dialog states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Hook
  const {
    loading,
    products,
    categories,
    pagination,
    categoryFilter,
    handlePageChange,
    handleSearch,
    handleCategoryFilter,
    deleteProduct,
    toggleStatus,
  } = useProduct();

  // Handlers
  const handleOpenDeleteDialog = useCallback((product: Product) => {
    setDeletingProduct(product);
    setIsDeleteOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingProduct) return;

    const response = await deleteProduct(deletingProduct.id);
    if (response?.success) {
      setIsDeleteOpen(false);
      setDeletingProduct(null);
    }
  }, [deletingProduct, deleteProduct]);

  const handleToggleStatus = useCallback(
    async (product: Product) => {
      await toggleStatus(product);
    },
    [toggleStatus]
  );

  return (
    <Page title="Sản phẩm">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Quản lý sản phẩm của cửa hàng</p>
          <Button onClick={() => navigate('/products/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Button>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle>Danh sách sản phẩm</CardTitle>
              <div className="flex items-center gap-4">
                <Select
                  value={categoryFilter || 'all'}
                  onValueChange={handleCategoryFilter}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tất cả danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    className="pl-9"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ProductTable
                products={products}
                pagination={pagination}
                handlePageChange={handlePageChange}
                onDelete={handleOpenDeleteDialog}
                onToggleStatus={handleToggleStatus}
              />
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa sản phẩm "${deletingProduct?.name}"? Hành động này không thể hoàn tác.`}
          onConfirm={handleConfirmDelete}
          confirmText="Xóa"
          cancelText="Hủy"
          variant="destructive"
        />
      </div>
    </Page>
  );
}
