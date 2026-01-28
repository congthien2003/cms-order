import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { dashboardPosService } from '@/services';
import type {
  DashboardSummary,
  OrdersByStatus,
  TopProduct,
} from '@/models/pos';
import { showErrorToast } from '@/lib/toast';

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [ordersByStatus, setOrdersByStatus] = useState<OrdersByStatus[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [summaryRes, ordersRes, productsRes] = await Promise.all([
          dashboardPosService.getSummary(),
          dashboardPosService.getOrdersByStatus(),
          dashboardPosService.getTopProducts({ limit: 5 }),
        ]);

        if (summaryRes.success) setSummary(summaryRes.data);
        if (ordersRes.success) setOrdersByStatus(ordersRes.data);
        if (productsRes.success) setTopProducts(productsRes.data);
      } catch {
        showErrorToast('Không thể tải dữ liệu dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    {
      title: 'Doanh thu hôm nay',
      value: summary?.todayRevenue.toLocaleString('vi-VN') + ' ₫' || '0 ₫',
      description: `${summary?.todayOrdersCount || summary?.todayOrderCount || 0} đơn hàng`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Đơn hàng chờ xử lý',
      value: summary?.pendingOrdersCount || summary?.pendingOrders || 0,
      description: 'Cần xử lý ngay',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Đơn hoàn thành',
      value:
        summary?.completedOrdersCount || summary?.todayCompletedOrders || 0,
      description: 'Hôm nay',
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Sản phẩm',
      value: summary?.totalProducts || 0,
      description: `${summary?.activeProducts || 0} đang bán`,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan hoạt động kinh doanh</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders by Status & Top Products */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Đơn hàng theo trạng thái
            </CardTitle>
            <CardDescription>Tổng quan đơn hàng hôm nay</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ordersByStatus.length > 0 ? (
                ordersByStatus.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <StatusIcon status={item.status} />
                      <span className="text-sm font-medium">
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                    <span className="text-sm font-bold">{item.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Chưa có dữ liệu
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sản phẩm bán chạy
            </CardTitle>
            <CardDescription>Top 5 sản phẩm bán chạy nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">
                          {product.productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.quantitySold || product.quantity} đã bán
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold">
                      {product.revenue.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Chưa có dữ liệu
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  switch (status.toLowerCase()) {
    case 'pending':
      return <Clock className="h-4 w-4 text-orange-500" />;
    case 'preparing':
      return <Loader2 className="h-4 w-4 text-blue-500" />;
    case 'ready':
      return <Package className="h-4 w-4 text-green-500" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Chờ xử lý',
    preparing: 'Đang pha chế',
    ready: 'Sẵn sàng',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
  };
  return labels[status.toLowerCase()] || status;
}
