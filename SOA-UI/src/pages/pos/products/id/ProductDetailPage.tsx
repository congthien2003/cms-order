import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, Edit, Trash2, ImageOff, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Page from '@/components/ui/page';
import { productService } from '@/services/productService';
import type { Product } from '@/models/pos';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import ConfirmDialog from '@/components/ui/dialog/ConfirmDialog';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    setLoading(true);
    try {
      const response = await productService.getById(productId);
      if (response.success) {
        setProduct(response.data);
      }
    } catch (error) {
      showErrorToast('Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!id) return;
    try {
      const response = await productService.delete(id);
      if (response.success) {
        showSuccessToast('Xóa sản phẩm thành công');
        navigate('/products');
      }
    } catch (error) {
      showErrorToast('Không thể xóa sản phẩm');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <Page title="Không tìm thấy">
        <div className="text-center py-10">
          <p>Sản phẩm không tồn tại hoặc đã bị xóa.</p>
          <Button variant="link" onClick={() => navigate('/products')}>
            Quay lại danh sách
          </Button>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Chi tiết sản phẩm">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/products')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/products/${id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardContent className="pt-6">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center border">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageOff className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div className="mt-4 space-y-2 text-center">
                <Badge variant={product.isActive ? 'default' : 'secondary'}>
                  {product.isActive ? 'Đang bán' : 'Ngừng bán'}
                </Badge>
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <p className="text-muted-foreground">{product.categoryName}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Giá cơ bản</p>
                  <p className="text-lg font-bold text-primary">{product.basePrice.toLocaleString('vi-VN')} ₫</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Thứ tự hiển thị</p>
                  <p className="text-lg">{product.sortOrder}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Mô tả</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {product.description || 'Không có mô tả cho sản phẩm này.'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Kích thước (Sizes)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {product.sizes && product.sizes.length > 0 ? (
                  product.sizes.map((size) => (
                    <div key={size.id} className="p-4 rounded-lg border bg-card flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-lg">{size.sizeName}</span>
                        {size.isDefault && (
                          <Badge variant="outline" className="text-[10px] uppercase">Mặc định</Badge>
                        )}
                      </div>
                      <p className="text-primary font-semibold">
                        {size.priceAdjustment >= 0 ? '+' : ''}
                        {size.priceAdjustment.toLocaleString('vi-VN')} ₫
                      </p>
                      <div className="flex items-center gap-1 mt-auto">
                        {size.isActive ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-destructive" />
                        )}
                        <span className="text-[12px] text-muted-foreground">
                          {size.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-full">Sản phẩm này chưa cấu hình các kích thước khác.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <ConfirmDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`}
          onConfirm={handleConfirmDelete}
          confirmText="Xóa"
          variant="destructive"
        />
      </div>
    </Page>
  );
}
