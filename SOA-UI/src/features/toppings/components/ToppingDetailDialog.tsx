import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ImageOff } from 'lucide-react';
import type { Topping } from '@/models/pos';

interface ToppingDetailDialogProps {
  topping: Topping | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ToppingDetailDialog({
  topping,
  open,
  onOpenChange,
}: ToppingDetailDialogProps) {
  if (!topping) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chi tiết Topping</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex items-center justify-center border">
              {topping.imageUrl ? (
                <img src={topping.imageUrl} alt={topping.name} className="w-full h-full object-cover" />
              ) : (
                <ImageOff className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{topping.name}</h3>
                <Badge variant={topping.isActive ? 'default' : 'secondary'}>
                  {topping.isActive ? 'Hoạt động' : 'Vô hiệu'}
                </Badge>
              </div>
              <p className="text-xl font-bold text-primary">
                {topping.price.toLocaleString('vi-VN')} ₫
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Thứ tự hiển thị</p>
              <p>{topping.sortOrder}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
              <p>{topping.createdAt ? new Date(topping.createdAt).toLocaleDateString('vi-VN') : '-'}</p>
            </div>
          </div>

          <div className="text-[12px] text-muted-foreground pt-2">
            <p>ID: {topping.id}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
