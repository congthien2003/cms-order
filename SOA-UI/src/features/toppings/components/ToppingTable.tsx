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
import { Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import type { Topping } from '@/models/pos';
import type { PagedList, PaginationParams } from '@/models/common/api';
import Pagination from '@/components/ui/pagination/Pagination';
import EmptyData from '@/components/ui/empty-data/empty-data';

type ToppingTableProps = {
  toppings: PagedList<Topping> | null;
  pagination: PaginationParams;
  handlePageChange: (page: number) => void;
  onEdit: (topping: Topping) => void;
  onDelete: (topping: Topping) => void;
  onToggleStatus: (topping: Topping) => void;
};

const ToppingTable = ({
  toppings,
  pagination,
  handlePageChange,
  onEdit,
  onDelete,
  onToggleStatus,
}: ToppingTableProps) => {
  if (!toppings || toppings.items.length === 0) {
    return <EmptyData />;
  }

  const pageSize = pagination.pageSize ?? 10;
  const page = pagination.page ?? 1;
  const totalPages = Math.ceil(toppings.totalCount / pageSize);

  return (
    <div className="w-full flex flex-col gap-4">
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
          {toppings.items.map((topping) => (
            <TableRow key={topping.id}>
              <TableCell className="font-medium">{topping.name}</TableCell>
              <TableCell className="max-w-xs truncate">
                {topping.description || '-'}
              </TableCell>
              <TableCell className="text-right">
                {topping.price.toLocaleString('vi-VN')} ₫
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={topping.isActive ? 'default' : 'secondary'}>
                  {topping.isActive ? 'Hoạt động' : 'Vô hiệu'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleStatus(topping)}
                    title={topping.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
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
                    onClick={() => onEdit(topping)}
                    title="Chỉnh sửa"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(topping)}
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
            totalCount={toppings.totalCount}
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ToppingTable;
