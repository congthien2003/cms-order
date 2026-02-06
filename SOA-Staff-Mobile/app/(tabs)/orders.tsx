import { useCallback, useState, useMemo, useEffect } from "react";
import { View, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { SafeArea } from "@/components/ui/safe-area";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading2, Body, Caption, Label } from "@/components/ui/typography";
import { useOrders } from "@/features/orders";
import { Order, OrderStatus } from "@/models/order";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  pending: { label: "Chờ xác nhận", color: "warning", icon: "time-outline" },
  confirmed: {
    label: "Đã xác nhận",
    color: "primary",
    icon: "checkmark-circle-outline",
  },
  preparing: { label: "Đang pha chế", color: "primary", icon: "cafe-outline" },
  ready: {
    label: "Sẵn sàng",
    color: "success",
    icon: "checkmark-done-outline",
  },
  completed: {
    label: "Hoàn thành",
    color: "success",
    icon: "checkmark-done-circle-outline",
  },
  cancelled: { label: "Đã hủy", color: "error", icon: "close-circle-outline" },
};

type FilterStatus = "all" | OrderStatus;

function OrderCard({ order }: { order: Order }) {
  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const itemNames = order.items
    .map((item) => `${item.productName} x${item.quantity}`)
    .slice(0, 3);

  return (
    <View
      className="bg-white rounded-xl border border-gray-100 mx-4 mb-3 p-4"
      style={{
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      }}>
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <Body className="font-bold">#{order.orderNumber}</Body>
          <Badge variant={statusInfo.color as any}>{statusInfo.label}</Badge>
        </View>
        <Caption className="text-gray-400">
          {formatTime(order.createdAt)}
        </Caption>
      </View>

      <View className="mb-2">
        {itemNames.map((name, idx) => (
          <Caption key={idx} className="text-gray-600">
            • {name}
          </Caption>
        ))}
        {order.items.length > 3 && (
          <Caption className="text-gray-400">
            ...và {order.items.length - 3} sản phẩm khác
          </Caption>
        )}
      </View>

      <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
        <Caption className="text-gray-500">{itemCount} sản phẩm</Caption>
        <Label className="text-primary-600 font-bold">
          {formatCurrency(order.totalAmount)}
        </Label>
      </View>
    </View>
  );
}

export default function OrdersScreen() {
  const { orders, isLoading, error, refetch, fetchTodayOrders } = useOrders({
    autoFetch: false,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>("all");

  // Fetch today orders on mount
  useEffect(() => {
    fetchTodayOrders();
  }, [fetchTodayOrders]);

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTodayOrders();
    setRefreshing(false);
  }, [fetchTodayOrders]);

  const filterOptions: { key: FilterStatus; label: string }[] = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ" },
    { key: "preparing", label: "Pha chế" },
    { key: "ready", label: "Sẵn sàng" },
    { key: "completed", label: "Xong" },
  ];

  const renderOrder = useCallback(
    ({ item }: { item: Order }) => <OrderCard order={item} />,
    [],
  );

  return (
    <SafeArea>
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-4 pt-2 pb-3 border-b border-gray-100">
          <Heading2 className="mb-3">Đơn hàng hôm nay</Heading2>

          {/* Filter Tabs */}
          <View className="flex-row gap-2">
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                onPress={() => setFilter(option.key)}
                className={`px-3 py-1.5 rounded-full ${
                  filter === option.key ? "bg-primary-600" : "bg-gray-100"
                }`}>
                <Caption
                  className={
                    filter === option.key
                      ? "text-white font-medium"
                      : "text-gray-600"
                  }>
                  {option.label}
                </Caption>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Orders List */}
        {isLoading && !refreshing ? (
          <Loading />
        ) : error ? (
          <EmptyState
            title="Không thể tải đơn hàng"
            description={error}
            icon="alert-circle-outline"
            actionLabel="Thử lại"
            onAction={fetchTodayOrders}
          />
        ) : (
          <FlatList
            data={filteredOrders}
            renderItem={renderOrder}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 12 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            ListEmptyComponent={
              <EmptyState
                title="Chưa có đơn hàng"
                description={
                  filter === "all"
                    ? "Đơn hàng trong ngày sẽ hiển thị ở đây"
                    : "Không có đơn hàng nào với trạng thái này"
                }
                icon="receipt-outline"
              />
            }
          />
        )}
      </View>
    </SafeArea>
  );
}
