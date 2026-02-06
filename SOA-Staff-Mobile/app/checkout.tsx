import { useState, useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  Switch,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { SafeArea } from "@/components/ui/safe-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import {
  Heading2,
  Heading3,
  Body,
  Caption,
  Label,
} from "@/components/ui/typography";
import { useCart } from "@/features/cart";
import { useVoucher } from "@/features/cart";
import { useCreateOrder } from "@/features/orders";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export default function CheckoutScreen() {
  const router = useRouter();
  const cart = useCart();
  const {
    validateVoucher,
    voucherResult,
    isLoading: voucherLoading,
    error: voucherError,
    clearVoucher,
  } = useVoucher();
  const {
    createOrder,
    isLoading: orderLoading,
    error: orderError,
  } = useCreateOrder();

  const [voucherCode, setVoucherCode] = useState("");
  const [showItems, setShowItems] = useState(false);

  // Apply voucher
  const handleApplyVoucher = useCallback(async () => {
    if (!voucherCode.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập mã khuyến mãi");
      return;
    }

    const result = await validateVoucher(voucherCode.trim(), cart.subtotal);
    if (result?.isValid) {
      cart.applyVoucher(voucherCode.trim(), result.discountAmount);
    }
  }, [voucherCode, cart, validateVoucher]);

  // Remove voucher
  const handleRemoveVoucher = useCallback(() => {
    setVoucherCode("");
    cart.removeVoucher();
    clearVoucher();
  }, [cart, clearVoucher]);

  // Submit order
  const handleSubmitOrder = useCallback(async () => {
    if (cart.isEmpty) {
      Alert.alert("Lỗi", "Giỏ hàng trống");
      return;
    }

    const order = await createOrder();
    if (order) {
      router.replace({
        pathname: "/order-confirmation",
        params: { orderId: order.id, orderNumber: order.orderNumber },
      });
    } else if (orderError) {
      Alert.alert("Lỗi", orderError);
    }
  }, [cart.isEmpty, createOrder, orderError, router]);

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 gap-4">
          {/* Order Summary */}
          <Card variant="outlined">
            <View className="p-4">
              <TouchableOpacity
                onPress={() => setShowItems(!showItems)}
                className="flex-row items-center justify-between">
                <Label className="font-semibold">
                  Đơn hàng ({cart.itemCount} sản phẩm)
                </Label>
                <Ionicons
                  name={showItems ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#64748b"
                />
              </TouchableOpacity>

              {showItems && (
                <View className="mt-3 gap-2">
                  {cart.items.map((item) => (
                    <View
                      key={item.id}
                      className="flex-row justify-between items-start">
                      <View className="flex-1 mr-2">
                        <Body numberOfLines={1}>
                          {item.productName} (Size {item.selectedSize.name})
                        </Body>
                        {item.selectedToppings.length > 0 && (
                          <Caption className="text-gray-500">
                            +{" "}
                            {item.selectedToppings
                              .map((t) => t.name)
                              .join(", ")}
                          </Caption>
                        )}
                      </View>
                      <View className="items-end">
                        <Caption className="text-gray-500">
                          x{item.quantity}
                        </Caption>
                        <Body>{formatCurrency(item.subtotal)}</Body>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </Card>

          {/* Voucher */}
          <Card variant="outlined">
            <View className="p-4">
              <Label className="font-semibold mb-3">Mã khuyến mãi</Label>
              {cart.voucherCode ? (
                <View className="flex-row items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="pricetag" size={18} color="#16a34a" />
                    <Body className="text-green-700 font-medium">
                      {cart.voucherCode}
                    </Body>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Caption className="text-green-600">
                      -{formatCurrency(cart.discountAmount)}
                    </Caption>
                    <TouchableOpacity onPress={handleRemoveVoucher}>
                      <Ionicons name="close-circle" size={20} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View className="flex-row gap-2">
                  <View className="flex-1">
                    <Input
                      placeholder="Nhập mã voucher..."
                      value={voucherCode}
                      onChangeText={setVoucherCode}
                      autoCapitalize="characters"
                      editable={!voucherLoading}
                    />
                  </View>
                  <Button
                    variant="outline"
                    onPress={handleApplyVoucher}
                    loading={voucherLoading}
                    disabled={voucherLoading}>
                    Áp dụng
                  </Button>
                </View>
              )}
              {voucherError && !cart.voucherCode && (
                <Caption className="text-red-500 mt-2">{voucherError}</Caption>
              )}
              {voucherResult && !voucherResult.isValid && (
                <Caption className="text-red-500 mt-2">
                  {voucherResult.message}
                </Caption>
              )}
            </View>
          </Card>

          {/* VAT Toggle */}
          <Card variant="outlined">
            <View className="p-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Label className="font-semibold">Tính VAT (10%)</Label>
                  <Caption className="text-gray-500">
                    Bao gồm thuế giá trị gia tăng
                  </Caption>
                </View>
                <Switch
                  value={cart.includeVat}
                  onValueChange={cart.setIncludeVat}
                  trackColor={{ false: "#d1d5db", true: "#93c5fd" }}
                  thumbColor={cart.includeVat ? "#2563eb" : "#f4f4f5"}
                />
              </View>
            </View>
          </Card>

          {/* Order Note */}
          <Card variant="outlined">
            <View className="p-4">
              <Label className="font-semibold mb-2">Ghi chú đơn hàng</Label>
              <Input
                placeholder="Ghi chú thêm..."
                value={cart.note}
                onChangeText={cart.setNote}
                multiline
                numberOfLines={3}
              />
            </View>
          </Card>

          {/* Price Breakdown */}
          <Card variant="outlined">
            <View className="p-4 gap-2">
              <Label className="font-semibold mb-1">Chi tiết thanh toán</Label>

              <View className="flex-row justify-between">
                <Body className="text-gray-600">Tạm tính</Body>
                <Body>{formatCurrency(cart.subtotal)}</Body>
              </View>

              {cart.discountAmount > 0 && (
                <View className="flex-row justify-between">
                  <Body className="text-green-600">Giảm giá</Body>
                  <Body className="text-green-600">
                    -{formatCurrency(cart.discountAmount)}
                  </Body>
                </View>
              )}

              {cart.includeVat && (
                <View className="flex-row justify-between">
                  <Body className="text-gray-600">VAT (10%)</Body>
                  <Body>{formatCurrency(cart.vatAmount)}</Body>
                </View>
              )}

              <Divider className="my-1" />

              <View className="flex-row justify-between">
                <Heading3>Tổng cộng</Heading3>
                <Heading3 className="text-primary-600">
                  {formatCurrency(cart.totalAmount)}
                </Heading3>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="px-4 py-3 border-t border-gray-200 bg-white">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleSubmitOrder}
          loading={orderLoading}
          disabled={orderLoading || cart.isEmpty}
          leftIcon={
            <Ionicons name="checkmark-circle" size={20} color="white" />
          }>
          Xác nhận đơn hàng • {formatCurrency(cart.totalAmount)}
        </Button>
      </View>
    </View>
  );
}
