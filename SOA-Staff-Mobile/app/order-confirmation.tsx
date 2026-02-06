import { useEffect, useState, useCallback } from "react";
import { View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { SafeArea } from "@/components/ui/safe-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { Divider } from "@/components/ui/divider";
import {
  Heading1,
  Heading2,
  Heading3,
  Body,
  Caption,
  Label,
} from "@/components/ui/typography";
import { usePrint } from "@/hooks/usePrint";
import { useSocket } from "@/hooks/useSocket";
import { Order } from "@/models/order";
import orderService from "@/services/orderService";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDateTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { orderId, orderNumber } = useLocalSearchParams<{
    orderId: string;
    orderNumber: string;
  }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { printInvoice, isPrinting } = usePrint();
  const { emit } = useSocket();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await orderService.getById(orderId);
        if (response.isSuccess && response.data) {
          setOrder(response.data);
          // Notify admin via socket
          emit("NewOrder", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, emit]);

  const handlePrint = useCallback(async () => {
    if (order) {
      await printInvoice(order);
    }
  }, [order, printInvoice]);

  const handleNewOrder = useCallback(() => {
    router.dismissAll();
    router.replace("/(tabs)");
  }, [router]);

  if (isLoading) {
    return (
      <SafeArea>
        <Loading />
      </SafeArea>
    );
  }

  if (!order) {
    return (
      <SafeArea>
        <View className="flex-1 items-center justify-center p-6">
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Body className="text-center mt-4 text-gray-500">
            Không tìm thấy thông tin đơn hàng
          </Body>
          <Button variant="primary" onPress={handleNewOrder} className="mt-4">
            Về trang chủ
          </Button>
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <View className="flex-1 bg-gray-50">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}>
          {/* Success Header */}
          <View className="bg-green-500 px-6 py-8 items-center">
            <View className="w-16 h-16 rounded-full bg-white items-center justify-center mb-3">
              <Ionicons name="checkmark-circle" size={48} color="#22c55e" />
            </View>
            <Heading2 className="text-white text-center">
              Đặt hàng thành công!
            </Heading2>
            <Caption className="text-green-100 text-center mt-1">
              Đơn hàng đã được gửi đến quầy
            </Caption>
          </View>

          <View className="p-4 gap-4">
            {/* Order Number */}
            <Card variant="outlined">
              <View className="p-4 items-center">
                <Caption className="text-gray-500 mb-1">Mã đơn hàng</Caption>
                <Heading1 className="text-primary-600">
                  #{order.orderNumber}
                </Heading1>
                <Caption className="text-gray-400 mt-1">
                  {formatDateTime(order.createdAt)}
                </Caption>
              </View>
            </Card>

            {/* Order Items */}
            <Card variant="outlined">
              <View className="p-4">
                <Label className="font-semibold mb-3">Chi tiết đơn hàng</Label>
                <View className="gap-2">
                  {order.items.map((item) => (
                    <View
                      key={item.id}
                      className="flex-row justify-between items-start">
                      <View className="flex-1 mr-2">
                        <Body numberOfLines={1}>{item.productName}</Body>
                        <Caption className="text-gray-500">
                          Size: {item.sizeName}
                          {item.toppings.length > 0 &&
                            ` • ${item.toppings.map((t) => t.toppingName).join(", ")}`}
                        </Caption>
                      </View>
                      <View className="items-end">
                        <Caption className="text-gray-500">
                          x{item.quantity}
                        </Caption>
                        <Body className="font-medium">
                          {formatCurrency(item.subtotal)}
                        </Body>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </Card>

            {/* Price Summary */}
            <Card variant="outlined">
              <View className="p-4 gap-2">
                <View className="flex-row justify-between">
                  <Body className="text-gray-600">Tạm tính</Body>
                  <Body>{formatCurrency(order.subtotal)}</Body>
                </View>

                {order.discountAmount > 0 && (
                  <View className="flex-row justify-between">
                    <Body className="text-green-600">
                      Giảm giá
                      {order.voucherCode && ` (${order.voucherCode})`}
                    </Body>
                    <Body className="text-green-600">
                      -{formatCurrency(order.discountAmount)}
                    </Body>
                  </View>
                )}

                {order.includeVat && order.vatAmount > 0 && (
                  <View className="flex-row justify-between">
                    <Body className="text-gray-600">
                      VAT ({(order.vatRate * 100).toFixed(0)}%)
                    </Body>
                    <Body>{formatCurrency(order.vatAmount)}</Body>
                  </View>
                )}

                <Divider className="my-1" />

                <View className="flex-row justify-between">
                  <Heading3>Tổng cộng</Heading3>
                  <Heading3 className="text-primary-600">
                    {formatCurrency(order.totalAmount)}
                  </Heading3>
                </View>
              </View>
            </Card>

            {order.note && (
              <Card variant="outlined">
                <View className="p-4">
                  <Label className="font-semibold mb-1">Ghi chú</Label>
                  <Body className="text-gray-600">{order.note}</Body>
                </View>
              </Card>
            )}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className="px-4 py-3 border-t border-gray-200 bg-white gap-3">
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onPress={handlePrint}
            loading={isPrinting}
            disabled={isPrinting}
            leftIcon={
              <Ionicons name="print-outline" size={20} color="#2563eb" />
            }>
            In hóa đơn
          </Button>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleNewOrder}
            leftIcon={
              <Ionicons name="add-circle-outline" size={20} color="white" />
            }>
            Đơn hàng mới
          </Button>
        </View>
      </View>
    </SafeArea>
  );
}
