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
import { Eye, Clock, CheckCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Order, OrderStatus, PaymentStatus } from '@/models/pos';
import type { PagedList, PaginationParams } from '@/models/common/api';
import Pagination from '@/components/ui/pagination/Pagination';
import EmptyData from '@/components/ui/empty-data/empty-data';
import { getStatusConfig, getPaymentConfig } from '../constants/orderConstants';

type OrderTableProps = {
  orders: Order[] | PagedList<Order> | null;
  pagination?: PaginationParams;
  handlePageChange?: (page: number) => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  showPagination?: boolean;
  emptyMessage?: string;
};

const OrderTable = ({
  orders,
  pagination,
  handlePageChange,
  onUpdateStatus,
  showPagination = false,
}: OrderTableProps) => {
  const navigate = useNavigate();

  // Handle both array and PagedList types
  const orderList = Array.isArray(orders) ? orders : (orders?.items ?? []);

  const totalCount = Array.isArray(orders)
    ? orders.length
    : (orders?.totalCount ?? 0);

  if (orderList.length === 0) {
    return <EmptyData />;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pageSize = pagination?.pageSize ?? 10;
  const page = pagination?.page ?? 1;
  const totalPages = pagination ? Math.ceil(totalCount / pageSize) : 1;

  const renderStatusBadge = (status: OrderStatus) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;
    return (
      <div className={`flex items-center gap-1 ${config.color}`}>
        <Icon className="h-4 w-4" />
        <span className="text-sm">{config.label}</span>
      </div>
    );
  };

  const renderPaymentBadge = (status: PaymentStatus) => {
    const config = getPaymentConfig(status);
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const renderActionButtons = (order: Order) => {
    const buttons = [];

    // View button
    buttons.push(
      <Button
        key="view"
        variant="ghost"
        size="icon"
        onClick={() => navigate(`/pos/orders/${order.id}`)}
        title="Xem chi tiết"
      >
        <Eye className="h-4 w-4" />
      </Button>
    );

    // Status action buttons based on current status
    switch (order.status) {
      case 'Pending':
        buttons.push(
          <Button
            key="prepare"
            variant="ghost"
            size="icon"
            className="text-blue-500"
            onClick={() => onUpdateStatus(order.id, 'Preparing')}
            title="Bắt đầu pha chế"
          >
            <Clock className="h-4 w-4" />
          </Button>
        );
        break;
      case 'Preparing':
        buttons.push(
          <Button
            key="ready"
            variant="ghost"
            size="icon"
            className="text-green-500"
            onClick={() => onUpdateStatus(order.id, 'Ready')}
            title="Sẵn sàng giao"
          >
            <Package className="h-4 w-4" />
          </Button>
        );
        break;
      case 'Ready':
        buttons.push(
          <Button
            key="complete"
            variant="ghost"
            size="icon"
            className="text-green-600"
            onClick={() => onUpdateStatus(order.id, 'Completed')}
            title="Hoàn thành"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
        );
        break;
    }

    return buttons;
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead className="text-right">Tổng tiền</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead className="text-center">Thanh toán</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderList.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                #{order.orderNumber || order.id.slice(0, 8)}
              </TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell className="text-right">
                {order.totalAmount?.toLocaleString('vi-VN')} đ
              </TableCell>
              <TableCell className="text-center">
                {renderStatusBadge(order.status)}
              </TableCell>
              <TableCell className="text-center">
                {renderPaymentBadge(order.paymentStatus)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {renderActionButtons(order)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showPagination && pagination && handlePageChange && totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            pageSize={pageSize}
            totalCount={totalCount}
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default OrderTable;
