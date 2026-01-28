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
  Eye,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ImageOff,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '@/models/pos';
import type { PagedList, PaginationParams } from '@/models/common/api';
import Pagination from '@/components/ui/pagination/Pagination';
import EmptyData from '@/components/ui/empty-data/empty-data';

type ProductTableProps = {
  products: PagedList<Product> | null;
  pagination: PaginationParams;
  handlePageChange: (page: number) => void;
  onDelete: (product: Product) => void;
  onToggleStatus: (product: Product) => void;
};

const ProductTable = ({
  products,
  pagination,
  handlePageChange,
  onDelete,
  onToggleStatus,
}: ProductTableProps) => {
  const navigate = useNavigate();

  if (!products || products.items.length === 0) {
    return <EmptyData />;
  }

  const pageSize = pagination.pageSize ?? 10;
  const page = pagination.page ?? 1;
  const totalPages = Math.ceil(products.totalCount / pageSize);

  return (
    <div className="w-full flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Ảnh</TableHead>
            <TableHead>Tên sản phẩm</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead className="text-right">Giá cơ bản</TableHead>
            <TableHead className="text-center">Size</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.items.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                    <ImageOff className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{product.categoryName}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {product.basePrice.toLocaleString('vi-VN')} ₫
              </TableCell>
              <TableCell className="text-center">
                {product.sizes?.length || 0} sizes
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={product.isActive ? 'default' : 'secondary'}>
                  {product.isActive ? 'Đang bán' : 'Ngừng bán'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleStatus(product)}
                    title={product.isActive ? 'Ngừng bán' : 'Mở bán'}
                  >
                    {product.isActive ? (
                      <ToggleRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/products/${product.id}`)}
                    title="Xem chi tiết"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/products/${product.id}/edit`)}
                    title="Chỉnh sửa"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(product)}
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
            totalCount={products.totalCount}
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ProductTable;
