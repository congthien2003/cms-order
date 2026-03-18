import { useCallback, useState, useMemo, useEffect } from "react";
import { View, TouchableOpacity, RefreshControl } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import { SafeArea } from "@/components/ui/safe-area";
import { Loading } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Heading3, Body, Caption, Label, Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOrders } from "@/features/orders";
import { Order } from "@/models/order";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/100x100.png?text=Order";

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

type FilterStatus = "pending" | "preparing" | "completed";

export default function OrdersScreen() {
  const { orders, isLoading, error, fetchTodayOrders, updateOrderStatus } = useOrders({
    autoFetch: false,
  }) as any; 
  
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>("pending");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchTodayOrders();
  }, [fetchTodayOrders]);

  const filteredOrders = useMemo(() => {
    let result = orders;
    
    // Map UI filters to actual data statuses
    if (filter === "pending") {
      result = result?.filter((o: Order) => o.status === "pending" || o.status === "confirmed") || [];
    } else if (filter === "preparing") {
      result = result?.filter((o: Order) => o.status === "preparing" || o.status === "ready") || [];
    } else if (filter === "completed") {
      result = result?.filter((o: Order) => o.status === "completed") || [];
    }

    if (searchText.trim()) {
      const query = searchText.toLowerCase();
      result = result?.filter((o: Order) => 
        o.orderNumber?.toLowerCase().includes(query) || 
        o.customerName?.toLowerCase().includes(query)
      ) || [];
    }

    return result || [];
  }, [orders, filter, searchText]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTodayOrders();
    setRefreshing(false);
  }, [fetchTodayOrders]);

  const renderOrder = useCallback(({ item }: { item: Order }) => {
    const isPending = item.status === "pending" || item.status === "confirmed";
    const isPreparing = item.status === "preparing";
    const isReady = item.status === "ready";
    
    let statusLabel = isPending ? "Pending" : (isPreparing ? "Preparing" : (isReady ? "Ready" : "Completed"));
    let statusBgColor = isPending ? "bg-primary-100 dark:bg-primary-900" : "bg-warning-100 dark:bg-warning-900";
    let statusTextColor = isPending ? "primary" : "warning";
    if (item.status === "completed") {
      statusBgColor = "bg-success-100 dark:bg-success-900";
      statusTextColor = "success";
    }

    const itemNames = item.items.map((i) => `${i.quantity}x ${i.productName}`).join(", ");
    const customerInfo = item.customerName ? `Customer: ${item.customerName}` : 
                         (item.tableNumber ? `Table ${item.tableNumber}` : "Takeaway");

    const imageUrl = item.items[0]?.productImageUrl || PLACEHOLDER_IMAGE;

    return (
      <Card variant="elevated" padding="none" className="mb-4 overflow-hidden border border-secondary-100 dark:border-slate-700">
        <View className="p-4 border-b border-secondary-50 dark:border-slate-700 flex-row justify-between items-start">
          <View>
            <Heading3 className="tracking-tight">Order #{item.orderNumber}</Heading3>
            <Caption weight="medium">{customerInfo}</Caption>
          </View>
          <View className={`${statusBgColor} px-2 py-1 rounded-full`}>
            <Typography variant="caption" color={statusTextColor as any} weight="bold" className="uppercase text-[10px]">{statusLabel}</Typography>
          </View>
        </View>
        <View className="p-4">
          <View className="flex-row gap-3 mb-4">
            <View className="w-16 h-16 rounded-lg bg-secondary-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image source={{ uri: imageUrl }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
            </View>
            <View className="flex-col justify-center flex-1">
              <Body weight="medium" className="leading-tight line-clamp-2">
                {itemNames}
              </Body>
              <Caption className="mt-1">Today, {formatTime(item.createdAt)}</Caption>
            </View>
          </View>
          
          <View className="flex-row items-center justify-between mt-2">
            <Heading3>{formatCurrency(item.totalAmount)}</Heading3>
            
            {isPending && (
              <View className="flex-row gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-20"
                >
                  Edit
                </Button>
                <Button 
                  variant="destructive"
                  size="sm"
                  className="w-20"
                  onPress={() => updateOrderStatus?.(item.id, "cancelled")}
                >
                  Void
                </Button>
              </View>
            )}

            {(isPreparing || isReady) && (
              <Button 
                variant="primary" 
                size="md"
                className="flex-1 ml-4"
                onPress={() => updateOrderStatus?.(item.id, isPreparing ? "ready" : "completed")}
              >
                {isPreparing ? "Mark as Ready" : "Complete Order"}
              </Button>
            )}
          </View>
        </View>
      </Card>
    );
  }, [updateOrderStatus]);

  return (
    <SafeArea>
      <View className="flex-1 bg-gray-50 dark:bg-[#10221c] max-w-[480px] mx-auto w-full">
        {/* Header */}
        <View className="flex-row items-center bg-white dark:bg-slate-900 p-4 pb-2 justify-between sticky top-0 z-10 border-b border-secondary-100 dark:border-slate-800">
          <TouchableOpacity className="w-10 items-center justify-center -ml-2">
            <Ionicons name="menu" size={28} className="text-slate-900 dark:text-slate-100" />
          </TouchableOpacity>
          <Heading3 className="flex-1 text-center">Order Management</Heading3>
          <TouchableOpacity className="w-10 items-center justify-end -mr-2">
            <Ionicons name="notifications" size={24} className="text-slate-900 dark:text-slate-100" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="px-4 py-3 bg-white dark:bg-slate-900">
          <Input
            placeholder="Search by Order ID or customer"
            value={searchText}
            onChangeText={setSearchText}
            leftIcon={<Ionicons name="search" size={20} color="#9ca3af" />}
            rightIcon={
              searchText ? (
                <TouchableOpacity onPress={() => setSearchText("")}>
                  <Ionicons name="close-circle" size={20} color="#9ca3af" />
                </TouchableOpacity>
              ) : undefined
            }
          />
        </View>

        {/* Segmented Filter */}
        <View className="flex-row px-4 py-3 bg-white dark:bg-slate-900 z-10">
          <View className="flex-row h-11 flex-1 items-center justify-center rounded-xl bg-secondary-100 dark:bg-slate-800 p-1">
            <TouchableOpacity
              onPress={() => setFilter("pending")}
              className={`flex-1 h-full items-center justify-center rounded-lg px-2 ${filter === "pending" ? "bg-white dark:bg-slate-700 shadow-sm" : ""}`}
            >
              <Label color={filter === "pending" ? "primary" : "muted"} weight={filter === "pending" ? "bold" : "semibold"}>Pending</Label>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFilter("preparing")}
              className={`flex-1 h-full items-center justify-center rounded-lg px-2 ${filter === "preparing" ? "bg-white dark:bg-slate-700 shadow-sm" : ""}`}
            >
              <Label color={filter === "preparing" ? "primary" : "muted"} weight={filter === "preparing" ? "bold" : "semibold"}>Preparing</Label>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFilter("completed")}
              className={`flex-1 h-full items-center justify-center rounded-lg px-2 ${filter === "completed" ? "bg-white dark:bg-slate-700 shadow-sm" : ""}`}
            >
              <Label color={filter === "completed" ? "primary" : "muted"} weight={filter === "completed" ? "bold" : "semibold"}>Completed</Label>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order List */}
        <View className="flex-1 bg-gray-50 dark:bg-[#10221c]">
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
            <FlashList
              data={filteredOrders}
              renderItem={renderOrder}
              keyExtractor={(item) => item.id}
              estimatedItemSize={200}
              contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
              ListEmptyComponent={
                <EmptyState
                  title={searchText ? "Không tìm thấy" : "Chưa có đơn hàng"}
                  description={
                    searchText
                      ? "Không có đơn hàng nào khớp với tìm kiếm"
                      : "Không có đơn hàng nào với trạng thái này"
                  }
                  icon="receipt-outline"
                />
              }
            />
          )}
        </View>
      </View>
    </SafeArea>
  );
}
