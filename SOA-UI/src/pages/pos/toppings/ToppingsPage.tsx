import { useState, useEffect } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  ToggleLeft,
  ToggleRight,
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
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toppingService } from '@/services';
import type {
  Topping,
  CreateToppingRequest,
  UpdateToppingRequest,
} from '@/models/pos';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { Pagination } from '@/components/ui/pagination';

export default function ToppingsPage() {
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingTopping, setEditingTopping] = useState<Topping | null>(null);
  const [deletingTopping, setDeletingTopping] = useState<Topping | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState<CreateToppingRequest>({
    name: '',
    price: 0,
    description: '',
  });

  const fetchToppings = async () => {
    try {
      setIsLoading(true);
      const response = await toppingService.getList({
        pageNumber,
        pageSize,
        searchTerm: searchTerm || undefined,
      });
      if (response.success) {
        setToppings(response.data.items);
        setTotalCount(response.data.totalCount);
      }
    } catch {
      showErrorToast('Không thể tải danh sách topping');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchToppings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPageNumber(1);
  };

  const openCreateDialog = () => {
    setEditingTopping(null);
    setFormData({ name: '', price: 0, description: '' });
    setIsFormOpen(true);
  };

  const openEditDialog = (topping: Topping) => {
    setEditingTopping(topping);
    setFormData({
      name: topping.name,
      price: topping.price,
      description: topping.description || '',
    });
    setIsFormOpen(true);
  };

  const openDeleteDialog = (topping: Topping) => {
    setDeletingTopping(topping);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showErrorToast('Vui lòng nhập tên topping');
      return;
    }

    if (formData.price < 0) {
      showErrorToast('Giá không hợp lệ');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingTopping) {
        const updateData: UpdateToppingRequest = {
          name: formData.name,
          price: formData.price,
          description: formData.description,
        };
        const response = await toppingService.update(
          editingTopping.id,
          updateData
        );
        if (response.success) {
          showSuccessToast('Cập nhật topping thành công');
          fetchToppings();
        }
      } else {
        const response = await toppingService.create(formData);
        if (response.success) {
          showSuccessToast('Tạo topping thành công');
          fetchToppings();
        }
      }
      setIsFormOpen(false);
    } catch {
      showErrorToast(
        editingTopping ? 'Cập nhật thất bại' : 'Tạo topping thất bại'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTopping) return;

    try {
      setIsSubmitting(true);
      const response = await toppingService.delete(deletingTopping.id);
      if (response.success) {
        showSuccessToast('Xóa topping thành công');
        fetchToppings();
      }
      setIsDeleteOpen(false);
    } catch {
      showErrorToast('Xóa topping thất bại');
    } finally {
      setIsSubmitting(false);
      setDeletingTopping(null);
    }
  };

  const handleToggleStatus = async (topping: Topping) => {
    try {
      const response = await toppingService.toggleStatus(topping.id);
      if (response.success) {
        showSuccessToast(
          `${topping.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'} thành công`
        );
        fetchToppings();
      }
    } catch {
      showErrorToast('Không thể thay đổi trạng thái');
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Topping</h1>
          <p className="text-muted-foreground">Quản lý topping cho đồ uống</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm topping
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách topping</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm topping..."
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
          ) : toppings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có topping nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên topping</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead className="text-right">Giá</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {toppings.map((topping) => (
                    <TableRow key={topping.id}>
                      <TableCell className="font-medium">
                        {topping.name}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {topping.description || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {topping.price.toLocaleString('vi-VN')} ₫
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={topping.isActive ? 'default' : 'secondary'}
                        >
                          {topping.isActive ? 'Hoạt động' : 'Vô hiệu'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(topping)}
                            title={
                              topping.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'
                            }
                          >
                            {topping.isActive ? (
                              <ToggleRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(topping)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(topping)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTopping ? 'Chỉnh sửa topping' : 'Thêm topping mới'}
            </DialogTitle>
            <DialogDescription>
              {editingTopping
                ? 'Cập nhật thông tin topping'
                : 'Điền thông tin để tạo topping mới'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên topping *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nhập tên topping"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Giá *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Nhập mô tả topping"
                rows={3}
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
              {editingTopping ? 'Cập nhật' : 'Tạo mới'}
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
              Bạn có chắc chắn muốn xóa topping "{deletingTopping?.name}"? Hành
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
