import { useState, useCallback } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmDialog from '@/components/ui/dialog/ConfirmDialog';
import Page from '@/components/ui/page';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/models/pos';

// Feature imports
import {
  CategoryTable,
  FormCategoryDialog,
  useCategory,
} from '@/features/categories';

export default function CategoriesPage() {
  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );

  // Hook
  const {
    loading,
    categories,
    pagination,
    editingCategory,
    handlePageChange,
    handleSearch,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleStatus,
    setEditingCategory,
    clearEditingCategory,
  } = useCategory();

  // Handlers
  const handleOpenCreateDialog = useCallback(() => {
    setIsEditMode(false);
    clearEditingCategory();
    setIsFormOpen(true);
  }, [clearEditingCategory]);

  const handleOpenEditDialog = useCallback(
    (category: Category) => {
      setIsEditMode(true);
      setEditingCategory(category);
      setIsFormOpen(true);
    },
    [setEditingCategory]
  );

  const handleOpenDeleteDialog = useCallback((category: Category) => {
    setDeletingCategory(category);
    setIsDeleteOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
      if (isEditMode && editingCategory) {
        const response = await updateCategory(editingCategory.id, data);
        if (response?.success) {
          setIsFormOpen(false);
        }
      } else {
        const response = await createCategory(data as CreateCategoryRequest);
        if (response?.success) {
          setIsFormOpen(false);
        }
      }
    },
    [isEditMode, editingCategory, createCategory, updateCategory]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingCategory) return;

    const response = await deleteCategory(deletingCategory.id);
    if (response?.success) {
      setIsDeleteOpen(false);
      setDeletingCategory(null);
    }
  }, [deletingCategory, deleteCategory]);

  const handleToggleStatus = useCallback(
    async (category: Category) => {
      await toggleStatus(category);
    },
    [toggleStatus]
  );

  return (
    <Page title="Danh mục">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Quản lý danh mục sản phẩm</p>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm danh mục
          </Button>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Danh sách danh mục</CardTitle>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm danh mục..."
                  className="pl-9"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <CategoryTable
                categories={categories}
                pagination={pagination}
                handlePageChange={handlePageChange}
                onEdit={handleOpenEditDialog}
                onDelete={handleOpenDeleteDialog}
                onToggleStatus={handleToggleStatus}
              />
            )}
          </CardContent>
        </Card>

        {/* Form Dialog */}
        <FormCategoryDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleFormSubmit}
          isEdit={isEditMode}
          categoryData={editingCategory}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa danh mục "${deletingCategory?.name}"? Hành động này không thể hoàn tác.`}
          onConfirm={handleConfirmDelete}
          confirmText="Xóa"
          cancelText="Hủy"
          variant="destructive"
        />
      </div>
    </Page>
  );
}
