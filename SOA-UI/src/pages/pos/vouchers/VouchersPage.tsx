import { useState, useCallback } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmDialog from '@/components/ui/dialog/ConfirmDialog';
import Page from '@/components/ui/page';
import type {
  Voucher,
  CreateVoucherRequest,
  UpdateVoucherRequest,
} from '@/models/pos';

// Feature imports
import {
  VoucherTable,
  FormVoucherDialog,
  useVoucher,
} from '@/features/vouchers';

export default function VouchersPage() {
  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deletingVoucher, setDeletingVoucher] = useState<Voucher | null>(null);

  // Hook
  const {
    loading,
    vouchers,
    pagination,
    editingVoucher,
    handlePageChange,
    handleSearch,
    createVoucher,
    updateVoucher,
    deleteVoucher,
    toggleStatus,
    setEditingVoucher,
    clearEditingVoucher,
    generateVoucherCode,
    formatDiscount,
    copyToClipboard,
  } = useVoucher();

  // Handlers
  const handleOpenCreateDialog = useCallback(() => {
    setIsEditMode(false);
    clearEditingVoucher();
    setIsFormOpen(true);
  }, [clearEditingVoucher]);

  const handleOpenEditDialog = useCallback(
    (voucher: Voucher) => {
      setIsEditMode(true);
      setEditingVoucher(voucher);
      setIsFormOpen(true);
    },
    [setEditingVoucher]
  );

  const handleOpenDeleteDialog = useCallback((voucher: Voucher) => {
    setDeletingVoucher(voucher);
    setIsDeleteOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: CreateVoucherRequest | UpdateVoucherRequest) => {
      if (isEditMode && editingVoucher) {
        const response = await updateVoucher(editingVoucher.id, data);
        if (response?.success) {
          setIsFormOpen(false);
        }
      } else {
        const response = await createVoucher(data as CreateVoucherRequest);
        if (response?.success) {
          setIsFormOpen(false);
        }
      }
    },
    [isEditMode, editingVoucher, createVoucher, updateVoucher]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingVoucher) return;

    const response = await deleteVoucher(deletingVoucher.id);
    if (response?.success) {
      setIsDeleteOpen(false);
      setDeletingVoucher(null);
    }
  }, [deletingVoucher, deleteVoucher]);

  const handleToggleStatus = useCallback(
    async (voucher: Voucher) => {
      await toggleStatus(voucher);
    },
    [toggleStatus]
  );

  return (
    <Page title="Voucher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Quản lý mã giảm giá</p>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm voucher
          </Button>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Danh sách voucher</CardTitle>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm voucher..."
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
              <VoucherTable
                vouchers={vouchers}
                pagination={pagination}
                handlePageChange={handlePageChange}
                onEdit={handleOpenEditDialog}
                onDelete={handleOpenDeleteDialog}
                onToggleStatus={handleToggleStatus}
                onCopyCode={copyToClipboard}
                formatDiscount={formatDiscount}
              />
            )}
          </CardContent>
        </Card>

        {/* Form Dialog */}
        <FormVoucherDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleFormSubmit}
          isEdit={isEditMode}
          voucherData={editingVoucher}
          generateCode={generateVoucherCode}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa voucher "${deletingVoucher?.code}"? Hành động này không thể hoàn tác.`}
          onConfirm={handleConfirmDelete}
          confirmText="Xóa"
          cancelText="Hủy"
          variant="destructive"
        />
      </div>
    </Page>
  );
}
