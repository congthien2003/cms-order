import { useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Page from '@/components/ui/page';
import type { OrderStatus } from '@/models/pos';

// Feature imports
import {
  OrderTable,
  ORDER_STATUSES,
  useOrder,
  type TabType,
} from '@/features/orders';

export default function OrdersPage() {
  // Hook
  const {
    loading,
    orders,
    todayOrders,
    queueOrders,
    pagination,
    statusFilter,
    activeTab,
    fetchQueueOrders,
    handleTabChange,
    handlePageChange,
    handleSearch,
    handleStatusFilter,
    updateOrderStatus,
  } = useOrder();

  // Handlers
  const handleUpdateStatus = useCallback(
    async (orderId: string, newStatus: OrderStatus) => {
      await updateOrderStatus(orderId, newStatus);
    },
    [updateOrderStatus]
  );

  return (
    <Page title="Đơn hàng">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Quản lý đơn hàng của cửa hàng</p>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => handleTabChange(v as TabType)}
        >
          <TabsList>
            <TabsTrigger value="queue">Hàng đợi</TabsTrigger>
            <TabsTrigger value="today">Hôm nay</TabsTrigger>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
          </TabsList>

          {/* Queue Tab */}
          <TabsContent value="queue">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <CardTitle>Đơn hàng đang xử lý</CardTitle>
                  <button
                    type="button"
                    className="text-sm text-primary underline-offset-4 hover:underline"
                    onClick={() => fetchQueueOrders()}
                  >
                    Refresh
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <OrderTable
                    orders={queueOrders}
                    onUpdateStatus={handleUpdateStatus}
                    emptyMessage="Không có đơn hàng trong hàng đợi"
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Today Tab */}
          <TabsContent value="today">
            <Card>
              <CardHeader>
                <CardTitle>Đơn hàng hôm nay</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <OrderTable
                    orders={todayOrders}
                    onUpdateStatus={handleUpdateStatus}
                    emptyMessage="Chưa có đơn hàng nào hôm nay"
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Orders Tab */}
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
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <OrderTable
                    orders={orders}
                    pagination={pagination}
                    handlePageChange={handlePageChange}
                    onUpdateStatus={handleUpdateStatus}
                    showPagination={true}
                    emptyMessage="Chưa có đơn hàng nào"
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Page>
  );
}
