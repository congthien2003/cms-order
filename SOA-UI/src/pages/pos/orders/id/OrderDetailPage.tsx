import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Page from '@/components/ui/page';
import { orderService } from '@/services/orderService';
import type { Order } from '@/models/pos';
import { showErrorToast } from '@/lib/toast';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await orderService.getById(id);
        if (response.success) {
          setOrder(response.data);
        }
      } catch {
        showErrorToast('Không thể tải thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <Page title="Không tìm thấy">
        <div className="text-center py-10">
          <p>Đơn hàng không tồn tại hoặc đã bị xóa.</p>
          <Button variant="link" onClick={() => navigate('/orders')}>
            Quay lại danh sách
          </Button>
        </div>
      </Page>
    );
  }

  const createdAt = order.createdAt || order.createdDate;

  return (
    <Page title="Chi tiết đơn hàng">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/orders')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Đơn #{order.orderNumber || order.id.slice(0, 8)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4 items-center">
              <Badge variant="outline">{order.status}</Badge>
              <Badge variant="secondary">{order.paymentStatus}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Khách hàng</p>
                <p>{order.customerName || '---'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                <p>{order.customerPhone || '---'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng tiền</p>
                <p className="text-lg font-bold text-primary">
                  {order.totalAmount.toLocaleString('vi-VN')} ₫
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Thời gian tạo</p>
                <p>{createdAt ? new Date(createdAt).toLocaleString('vi-VN') : '-'}</p>
              </div>
            </div>

            {(() => {
              const orderWithNote = order as Order & { note?: string | null };
              return orderWithNote.note ? (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ghi chú</p>
                  <p className="whitespace-pre-wrap">{orderWithNote.note}</p>
                </div>
              ) : null;
            })()}

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Items</p>
              {order.items && order.items.length > 0 ? (
                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{item.itemTotal.toLocaleString('vi-VN')} ₫</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Không có item nào.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
