import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Category } from '@/models/pos';

interface CategoryDetailDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryDetailDialog({
  category,
  open,
  onOpenChange,
}: CategoryDetailDialogProps) {
  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chi tiết danh mục</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">{category.name}</h3>
            <Badge variant={category.isActive ? 'default' : 'secondary'}>
              {category.isActive ? 'Hoạt động' : 'Vô hiệu'}
            </Badge>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Thứ tự hiển thị</p>
              <p>{category.sortOrder}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Số sản phẩm</p>
              <p>{category.productsCount ?? category.productCount ?? 0}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Mô tả</p>
            <p className="text-sm mt-1 whitespace-pre-wrap">
              {category.description || 'Không có mô tả cho danh mục này.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[12px] text-muted-foreground pt-2">
            <div>
              <p>ID: {category.id}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
