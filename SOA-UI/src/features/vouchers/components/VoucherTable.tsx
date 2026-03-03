import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Copy,
  Calendar,
  Eye,
} from 'lucide-react';
import type { Voucher } from '@/models/pos';
import type { PagedList, PaginationParams } from '@/models/common/api';
import Pagination from '@/components/ui/pagination/Pagination';
import EmptyData from '@/components/ui/empty-data/empty-data';
import { useState } from 'react';
import { VoucherDetailDialog } from './VoucherDetailDialog';

type VoucherTableProps = {
  vouchers: PagedList<Voucher> | null;
  pagination: PaginationParams;
  handlePageChange: (page: number) => void;
  onEdit: (voucher: Voucher) => void;
  onDelete: (voucher: Voucher) => void;
  onToggleStatus: (voucher: Voucher) => void;
  onCopyCode: (code: string) => void;
  formatDiscount: (voucher: Voucher) => string;
};

const VoucherTable = ({
  vouchers,
  pagination,
  handlePageChange,
  onEdit,
  onDelete,
  onToggleStatus,
  onCopyCode,
  formatDiscount,
}: VoucherTableProps) => {
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  if (!vouchers || vouchers.items.length === 0) {
    return <EmptyData />;
  }

  const handleViewDetail = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsDetailOpen(true);
  };

  const pageSize = pagination.pageSize ?? 10;
  const page = pagination.page ?? 1;
  const totalPages = Math.ceil(vouchers.totalCount / pageSize);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="w-full flex flex-col gap-4">
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
          {vouchers.items.map((voucher) => (
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
                    onClick={() => onCopyCode(voucher.code)}
                    title="Sao chép mã"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{formatDiscount(voucher)}</Badge>
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
                <Badge variant={voucher.isActive ? 'default' : 'secondary'}>
                  {voucher.isActive ? 'Hoạt động' : 'Vô hiệu'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewDetail(voucher)}
                    title="Xem chi tiết"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleStatus(voucher)}
                    title={voucher.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
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
                    onClick={() => onEdit(voucher)}
                    title="Chỉnh sửa"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(voucher)}
                    title="Xóa"
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
            totalCount={vouchers.totalCount}
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <VoucherDetailDialog
        voucher={selectedVoucher}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
};

export default VoucherTable;
