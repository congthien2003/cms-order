import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Copy,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { voucherService } from '@/services';
import type {
  Voucher,
  CreateVoucherRequest,
  UpdateVoucherRequest,
  DiscountType,
} from '@/models/pos';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { Pagination } from '@/components/ui/pagination';

type FormDataType = {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  startDate: string;
  endDate: string;
};

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [deletingVoucher, setDeletingVoucher] = useState<Voucher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState<FormDataType>({
    code: '',
    description: '',
    discountType: 'Percentage',
    discountValue: 0,
    minimumOrderAmount: 0,
    maximumDiscount: undefined,
    usageLimit: undefined,
    startDate: '',
    endDate: '',
  });

  const fetchVouchers = async () => {
    try {
      setIsLoading(true);
      const response = await voucherService.getList({
        pageNumber,
        pageSize,
        searchTerm: searchTerm || undefined,
      });
      if (response.success) {
        setVouchers(response.data.items);
        setTotalCount(response.data.totalCount);
      }
    } catch {
      showErrorToast('Không thể tải danh sách voucher');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPageNumber(1);
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const openCreateDialog = () => {
    setEditingVoucher(null);
    setFormData({
      code: '',
      description: '',
      discountType: 'Percentage',
      discountValue: 0,
      minimumOrderAmount: 0,
      maximumDiscount: undefined,
      usageLimit: undefined,
      startDate: '',
      endDate: '',
    });
    setIsFormOpen(true);
  };

  const openEditDialog = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      code: voucher.code,
      description: voucher.description || '',
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      minimumOrderAmount: voucher.minimumOrderAmount ?? undefined,
      maximumDiscount: voucher.maximumDiscount ?? undefined,
      usageLimit: voucher.usageLimit ?? undefined,
      startDate: voucher.startDate
        ? new Date(voucher.startDate).toISOString().slice(0, 16)
        : '',
      endDate: voucher.endDate
        ? new Date(voucher.endDate).toISOString().slice(0, 16)
        : '',
    });
    setIsFormOpen(true);
  };

  const openDeleteDialog = (voucher: Voucher) => {
    setDeletingVoucher(voucher);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.code.trim()) {
      showErrorToast('Vui lòng nhập mã voucher');
      return;
    }

    if (formData.discountValue <= 0) {
      showErrorToast('Giá trị giảm giá phải lớn hơn 0');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingVoucher) {
        const updateData: UpdateVoucherRequest = {
          code: formData.code,
          description: formData.description,
          discountType: formData.discountType,
          discountValue: formData.discountValue,
          minimumOrderAmount: formData.minimumOrderAmount,
          maximumDiscount: formData.maximumDiscount,
          usageLimit: formData.usageLimit,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
        };
        const response = await voucherService.update(
          editingVoucher.id,
          updateData
        );
        if (response.success) {
          showSuccessToast('Cập nhật voucher thành công');
          fetchVouchers();
        }
      } else {
        const createData: CreateVoucherRequest = {
          code: formData.code,
          description: formData.description,
          discountType: formData.discountType,
          discountValue: formData.discountValue,
          minimumOrderAmount: formData.minimumOrderAmount,
          maximumDiscount: formData.maximumDiscount,
          usageLimit: formData.usageLimit,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
        };
        const response = await voucherService.create(createData);
        if (response.success) {
          showSuccessToast('Tạo voucher thành công');
          fetchVouchers();
        }
      }
      setIsFormOpen(false);
    } catch {
      showErrorToast(
        editingVoucher ? 'Cập nhật thất bại' : 'Tạo voucher thất bại'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingVoucher) return;

    try {
      setIsSubmitting(true);
      const response = await voucherService.delete(deletingVoucher.id);
      if (response.success) {
        showSuccessToast('Xóa voucher thành công');
        fetchVouchers();
      }
      setIsDeleteOpen(false);
    } catch {
      showErrorToast('Xóa voucher thất bại');
    } finally {
      setIsSubmitting(false);
      setDeletingVoucher(null);
    }
  };

  const handleToggleStatus = async (voucher: Voucher) => {
    try {
      const response = await voucherService.toggleStatus(voucher.id);
      if (response.success) {
        showSuccessToast(
          `${voucher.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'} thành công`
        );
        fetchVouchers();
      }
    } catch {
      showErrorToast('Không thể thay đổi trạng thái');
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    showSuccessToast('Đã sao chép mã voucher');
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDiscount = useMemo(
    () => (voucher: Voucher) => {
      if (voucher.discountType === 'Percentage') {
        return `${voucher.discountValue}%`;
      }
      return `${voucher.discountValue.toLocaleString('vi-VN')} ₫`;
    },
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Voucher</h1>
          <p className="text-muted-foreground">Quản lý mã giảm giá</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm voucher
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách voucher</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm voucher..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : vouchers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có voucher nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã voucher</TableHead>
                    <TableHead>Giảm giá</TableHead>
                    <TableHead className="text-center">Đã dùng</TableHead>
                    <TableHead>Hiệu lực</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vouchers.map((voucher) => (
                    <TableRow key={voucher.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="px-2 py-1 bg-muted rounded font-mono text-sm">
                            {voucher.code}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(voucher.code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatDiscount(voucher)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {voucher.usedCount} / {voucher.usageLimit || '∞'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(voucher.startDate)} -{' '}
                          {formatDate(voucher.endDate)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={voucher.isActive ? 'default' : 'secondary'}
                        >
                          {voucher.isActive ? 'Hoạt động' : 'Vô hiệu'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(voucher)}
                            title={
                              voucher.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'
                            }
                          >
                            {voucher.isActive ? (
                              <ToggleRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(voucher)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(voucher)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination
                    pageSize={pageSize}
                    totalCount={totalCount}
                    totalPages={totalPages}
                    currentPage={pageNumber}
                    onPageChange={setPageNumber}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingVoucher ? 'Chỉnh sửa voucher' : 'Thêm voucher mới'}
            </DialogTitle>
            <DialogDescription>
              {editingVoucher
                ? 'Cập nhật thông tin voucher'
                : 'Điền thông tin để tạo voucher mới'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="code">Mã voucher *</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="VD: SALE2024"
                  className="uppercase"
                />
                <Button type="button" variant="outline" onClick={generateCode}>
                  Tạo mã
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountType">Loại giảm giá</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value: DiscountType) =>
                    setFormData({ ...formData, discountType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Percentage">Phần trăm (%)</SelectItem>
                    <SelectItem value="FixedAmount">Số tiền cố định</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountValue">Giá trị giảm *</Label>
                <Input
                  id="discountValue"
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountValue: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minimumOrderAmount">Đơn tối thiểu</Label>
                <Input
                  id="minimumOrderAmount"
                  type="number"
                  value={formData.minimumOrderAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minimumOrderAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maximumDiscount">Giảm tối đa</Label>
                <Input
                  id="maximumDiscount"
                  type="number"
                  value={formData.maximumDiscount || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maximumDiscount: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="Không giới hạn"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageLimit">Giới hạn sử dụng</Label>
              <Input
                id="usageLimit"
                type="number"
                value={formData.usageLimit || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    usageLimit: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="Không giới hạn"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Ngày kết thúc</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả voucher"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingVoucher ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa voucher "{deletingVoucher?.code}"? Hành
              động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
