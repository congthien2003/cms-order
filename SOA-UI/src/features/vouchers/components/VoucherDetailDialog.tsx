import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Voucher } from '@/models/pos';

interface VoucherDetailDialogProps {
  voucher: Voucher | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VoucherDetailDialog({
  voucher,
  open,
  onOpenChange,
}: VoucherDetailDialogProps) {
  if (!voucher) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chi tiết Voucher</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-primary">{voucher.code}</h3>
              <p className="font-medium">{voucher.name}</p>
            </div>
            <Badge variant={voucher.isActive ? 'default' : 'secondary'}>
              {voucher.isActive ? 'Hoạt động' : 'Vô hiệu'}
            </Badge>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Loại giảm giá</p>
              <p>{voucher.discountType === 'Percentage' ? 'Phần trăm (%)' : 'Số tiền cố định'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Giá trị giảm</p>
              <p className="font-bold">
                {voucher.discountType === 'Percentage' 
                  ? `${voucher.discountValue}%` 
                  : `${voucher.discountValue.toLocaleString('vi-VN')} ₫`}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Đơn tối thiểu</p>
              <p>{voucher.minOrderAmount?.toLocaleString('vi-VN') ?? 0} ₫</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Giảm tối đa</p>
              <p>{voucher.maxDiscountAmount?.toLocaleString('vi-VN') ?? 'Không giới hạn'} ₫</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ngày bắt đầu</p>
              <p>{formatDate(voucher.startDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ngày kết thúc</p>
              <p>{formatDate(voucher.endDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Giới hạn sử dụng</p>
              <p>{voucher.usageLimit ?? 'Không giới hạn'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Đã sử dụng</p>
              <p>{voucher.usedCount}</p>
            </div>
          </div>

          {voucher.description && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Mô tả</p>
              <p className="text-sm mt-1 whitespace-pre-wrap">{voucher.description}</p>
            </div>
          )}

          <div className="text-[12px] text-muted-foreground pt-2">
            <p>ID: {voucher.id}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
