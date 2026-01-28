import { useState, useCallback } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmDialog from '@/components/ui/dialog/ConfirmDialog';
import Page from '@/components/ui/page';
import type {
  Topping,
  CreateToppingRequest,
  UpdateToppingRequest,
} from '@/models/pos';

// Feature imports
import {
  ToppingTable,
  FormToppingDialog,
  useTopping,
} from '@/features/toppings';

export default function ToppingsPage() {
  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deletingTopping, setDeletingTopping] = useState<Topping | null>(null);

  // Hook
  const {
    loading,
    toppings,
    pagination,
    editingTopping,
    handlePageChange,
    handleSearch,
    createTopping,
    updateTopping,
    deleteTopping,
    toggleStatus,
    setEditingTopping,
    clearEditingTopping,
  } = useTopping();

  // Handlers
  const handleOpenCreateDialog = useCallback(() => {
    setIsEditMode(false);
    clearEditingTopping();
    setIsFormOpen(true);
  }, [clearEditingTopping]);

  const handleOpenEditDialog = useCallback(
    (topping: Topping) => {
      setIsEditMode(true);
      setEditingTopping(topping);
      setIsFormOpen(true);
    },
    [setEditingTopping]
  );

  const handleOpenDeleteDialog = useCallback((topping: Topping) => {
    setDeletingTopping(topping);
    setIsDeleteOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: CreateToppingRequest | UpdateToppingRequest) => {
      if (isEditMode && editingTopping) {
        const response = await updateTopping(editingTopping.id, data);
        if (response?.success) {
          setIsFormOpen(false);
        }
      } else {
        const response = await createTopping(data as CreateToppingRequest);
        if (response?.success) {
          setIsFormOpen(false);
        }
      }
    },
    [isEditMode, editingTopping, createTopping, updateTopping]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingTopping) return;

    const response = await deleteTopping(deletingTopping.id);
    if (response?.success) {
      setIsDeleteOpen(false);
      setDeletingTopping(null);
    }
  }, [deletingTopping, deleteTopping]);

  const handleToggleStatus = useCallback(
    async (topping: Topping) => {
      await toggleStatus(topping);
    },
    [toggleStatus]
  );

  return (
    <Page title="Topping">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Quản lý topping cho đồ uống</p>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm topping
          </Button>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Danh sách topping</CardTitle>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm topping..."
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
              <ToppingTable
                toppings={toppings}
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
        <FormToppingDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleFormSubmit}
          isEdit={isEditMode}
          toppingData={editingTopping}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa topping "${deletingTopping?.name}"? Hành động này không thể hoàn tác.`}
          onConfirm={handleConfirmDelete}
          confirmText="Xóa"
          cancelText="Hủy"
          variant="destructive"
        />
      </div>
    </Page>
  );
}
