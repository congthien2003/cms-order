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
import type { Category } from '@/models/pos';
import type { PagedList, PaginationParams } from '@/models/common/api';
import Pagination from '@/components/ui/pagination/Pagination';
import EmptyData from '@/components/ui/empty-data/empty-data';

type CategoryTableProps = {
  categories: PagedList<Category> | null;
  pagination: PaginationParams;
  handlePageChange: (page: number) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
};

const CategoryTable = ({
  categories,
  pagination,
  handlePageChange,
  onEdit,
  onDelete,
  onToggleStatus,
}: CategoryTableProps) => {
  if (!categories || categories.items.length === 0) {
    return <EmptyData />;
  }

  const pageSize = pagination.pageSize ?? 10;
  const page = pagination.page ?? 1;
  const totalPages = Math.ceil(categories.totalCount / pageSize);

  return (
    <div className="w-full flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên danh mục</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead className="text-center">Thứ tự</TableHead>
            <TableHead className="text-center">Số sản phẩm</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.items.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="max-w-xs truncate">
                {category.description || '-'}
              </TableCell>
              <TableCell className="text-center">
                {category.sortOrder}
              </TableCell>
              <TableCell className="text-center">
                {category.productsCount ?? category.productCount ?? 0}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={category.isActive ? 'default' : 'secondary'}>
                  {category.isActive ? 'Hoạt động' : 'Vô hiệu'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleStatus(category)}
                    title={category.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                  >
                    {category.isActive ? (
                      <ToggleRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(category)}
                    title="Chỉnh sửa"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(category)}
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
            totalCount={categories.totalCount}
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryTable;
