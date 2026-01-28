import { useState, useEffect } from 'react';
import {
  Search,
  Loader2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  ChefHat,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { orderService } from '@/services';
import type { Order, OrderStatus, PaymentStatus } from '@/models/pos';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { Pagination } from '@/components/ui/pagination';
import { useNavigate } from 'react-router-dom';

const ORDER_STATUSES: {
  value: OrderStatus;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    value: 'Pending',
    label: 'Chờ xử lý',
    icon: Clock,
    color: 'text-orange-500',
  },
  {
    value: 'Preparing',
    label: 'Đang pha chế',
    icon: ChefHat,
    color: 'text-blue-500',
  },
  { value: 'Ready', label: 'Sẵn sàng', icon: Package, color: 'text-green-500' },
  {
    value: 'Completed',
    label: 'Hoàn thành',
    icon: CheckCircle,
    color: 'text-green-600',
  },
  { value: 'Cancelled', label: 'Đã hủy', icon: XCircle, color: 'text-red-500' },
];

const PAYMENT_STATUSES: {
  value: PaymentStatus;
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
}[] = [
  { value: 'Unpaid', label: 'Chưa thanh toán', variant: 'destructive' },
  { value: 'Paid', label: 'Đã thanh toán', variant: 'default' },
  { value: 'Refunded', label: 'Đã hoàn tiền', variant: 'secondary' },
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [todayOrders, setTodayOrders] = useState<Order[]>([]);
  const [queueOrders, setQueueOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState('all');

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getList({
        pageNumber,
        pageSize,
        search: searchTerm || undefined,
        status: (statusFilter as OrderStatus) || undefined,
      });
      if (response.success) {
        setOrders(response.data.items);
        setTotalCount(response.data.totalCount);
      }
    } catch {
      showErrorToast('Không thể tải danh sách đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTodayOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getToday();
      if (response.success) {
        setTodayOrders(response.data);
      }
    } catch {
      showErrorToast('Không thể tải đơn hàng hôm nay');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQueueOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getQueue();
      if (response.success) {
        setQueueOrders(response.data);
      }
    } catch {
      showErrorToast('Không thể tải hàng đợi đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'all') {
      fetchOrders();
    } else if (activeTab === 'today') {
      fetchTodayOrders();
    } else if (activeTab === 'queue') {
      fetchQueueOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, searchTerm, statusFilter, activeTab]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPageNumber(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value === 'all' ? '' : value);
    setPageNumber(1);
  };

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      const response = await orderService.updateStatus(orderId, {
        status: newStatus,
      });
      if (response.success) {
        showSuccessToast('Cập nhật trạng thái thành công');
        // Refresh data based on active tab
        if (activeTab === 'all') fetchOrders();
        else if (activeTab === 'today') fetchTodayOrders();
        else fetchQueueOrders();
      }
    } catch {
      showErrorToast('Không thể cập nhật trạng thái');
    }
  };

  const getStatusConfig = (status: OrderStatus) => {
    return ORDER_STATUSES.find((s) => s.value === status) || ORDER_STATUSES[0];
  };

  const getPaymentConfig = (status: PaymentStatus) => {
    return (
      PAYMENT_STATUSES.find((s) => s.value === status) || PAYMENT_STATUSES[0]
    );
  };

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

  const totalPages = Math.ceil(totalCount / pageSize);

  const renderOrderTable = (orderList: Order[], showPagination = false) => (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead className="text-center">Số món</TableHead>
            <TableHead className="text-right">Tổng tiền</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead className="text-center">Thanh toán</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderList.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const paymentConfig = getPaymentConfig(order.paymentStatus);
            const StatusIcon = statusConfig.icon;

            return (
              <TableRow key={order.id}>
                <TableCell className="font-mono font-medium">
                  {order.orderNumber}
                </TableCell>
                <TableCell className="text-sm">
                  {formatDate(order.createdDate || order.createdAt)}
                </TableCell>
                <TableCell className="text-center">
                  {order.items?.length || 0}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {order.totalAmount.toLocaleString('vi-VN')} ₫
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                    <span className="text-sm">{statusConfig.label}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={paymentConfig.variant}>
                    {paymentConfig.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {order.status === 'Pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleUpdateStatus(order.id, 'Preparing')
                        }
                      >
                        Pha chế
                      </Button>
                    )}
                    {order.status === 'Preparing' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(order.id, 'Ready')}
                      >
                        Sẵn sàng
                      </Button>
                    )}
                    {order.status === 'Ready' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleUpdateStatus(order.id, 'Completed')
                        }
                      >
                        Hoàn thành
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {showPagination && totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            pageSize={pageSize}
            totalCount={totalCount}
            totalPages={totalPages}
            currentPage={pageNumber}
            onPageChange={setPageNumber}
          />
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Đơn hàng</h1>
          <p className="text-muted-foreground">Quản lý đơn hàng của cửa hàng</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="queue">Hàng đợi</TabsTrigger>
          <TabsTrigger value="today">Hôm nay</TabsTrigger>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
        </TabsList>

        <TabsContent value="queue">
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng đang xử lý</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : queueOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Không có đơn hàng trong hàng đợi
                </div>
              ) : (
                renderOrderTable(queueOrders)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng hôm nay</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : todayOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Chưa có đơn hàng nào hôm nay
                </div>
              ) : (
                renderOrderTable(todayOrders)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <CardTitle>Tất cả đơn hàng</CardTitle>
                <div className="flex items-center gap-4">
                  <Select
                    value={statusFilter || 'all'}
                    onValueChange={handleStatusFilter}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Tất cả trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      {ORDER_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Tìm mã đơn hàng..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Chưa có đơn hàng nào
                </div>
              ) : (
                renderOrderTable(orders, true)
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
