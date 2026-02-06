import { useCallback } from "react";
import { View, FlatList, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { SafeArea } from "@/components/ui/safe-area";
import { Button } from "@/components/ui/button";
import { QuantityInput } from "@/components/ui/quantity-input";
import { EmptyState } from "@/components/ui/empty-state";
import { Divider } from "@/components/ui/divider";
import {
  Heading2,
  Heading3,
  Body,
  Caption,
  Label,
} from "@/components/ui/typography";
import { useCart, CartItem } from "@/features/cart";

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/100x100.png?text=No+Image";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  const toppingsText = item.selectedToppings
    .map((t) => `${t.name}${t.quantity > 1 ? ` x${t.quantity}` : ""}`)
    .join(", ");

  return (
    <View className="flex-row bg-white rounded-xl border border-gray-100 overflow-hidden mb-3 mx-4">
      <Image
        source={{ uri: item.productImageUrl || PLACEHOLDER_IMAGE }}
        style={{ width: 80, height: 80 }}
        contentFit="cover"
      />
      <View className="flex-1 p-3">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-2">
            <Body className="font-semibold" numberOfLines={1}>
              {item.productName}
            </Body>
            <Caption className="text-gray-500">
              Size: {item.selectedSize.name}
            </Caption>
            {toppingsText && (
              <Caption className="text-gray-500" numberOfLines={1}>
                {toppingsText}
              </Caption>
            )}
            {item.note && (
              <Caption className="text-gray-400 italic" numberOfLines={1}>
                {item.note}
              </Caption>
            )}
          </View>
          <TouchableOpacity
            onPress={() => onRemove(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <QuantityInput
            value={item.quantity}
            onChange={(qty) => onUpdateQuantity(item.id, qty)}
            min={1}
            max={99}
          />
          <Label className="text-primary-600 font-bold">
            {formatCurrency(item.subtotal)}
          </Label>
        </View>
      </View>
    </View>
  );
}

export default function CartScreen() {
  const router = useRouter();
  const {
    items,
    subtotal,
    itemCount,
    isEmpty,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const handleRemoveItem = useCallback(
    (id: string) => {
      Alert.alert("Xóa sản phẩm", "Bạn muốn xóa sản phẩm này khỏi giỏ hàng?", [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", style: "destructive", onPress: () => removeItem(id) },
      ]);
    },
    [removeItem],
  );

  const handleClearCart = useCallback(() => {
    Alert.alert("Xóa giỏ hàng", "Bạn muốn xóa toàn bộ giỏ hàng?", [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa tất cả", style: "destructive", onPress: clearCart },
    ]);
  }, [clearCart]);

  const handleCheckout = useCallback(() => {
    router.push("/checkout");
  }, [router]);

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => (
      <CartItemCard
        item={item}
        onUpdateQuantity={updateQuantity}
        onRemove={handleRemoveItem}
      />
    ),
    [updateQuantity, handleRemoveItem],
  );

  return (
    <SafeArea>
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-4 py-3 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <Heading2>Giỏ hàng</Heading2>
            {!isEmpty && (
              <TouchableOpacity onPress={handleClearCart}>
                <Caption className="text-red-500">Xóa tất cả</Caption>
              </TouchableOpacity>
            )}
          </View>
          {!isEmpty && (
            <Caption className="text-gray-500 mt-1">
              {itemCount} sản phẩm
            </Caption>
          )}
        </View>

        {/* Cart Items */}
        {isEmpty ? (
          <EmptyState
            title="Giỏ hàng trống"
            description="Hãy thêm sản phẩm từ menu để bắt đầu"
            icon="cart-outline"
            actionLabel="Xem Menu"
            onAction={() => router.push("/(tabs)")}
          />
        ) : (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 12 }}
          />
        )}

        {/* Bottom Bar */}
        {!isEmpty && (
          <View className="px-4 py-3 border-t border-gray-200 bg-white">
            <View className="flex-row items-center justify-between mb-3">
              <Body className="text-gray-500">Tạm tính</Body>
              <Heading3 className="text-primary-600">
                {formatCurrency(subtotal)}
              </Heading3>
            </View>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleCheckout}
              rightIcon={
                <Ionicons name="arrow-forward" size={20} color="white" />
              }>
              Tiến hành thanh toán
            </Button>
          </View>
        )}
      </View>
    </SafeArea>
  );
}
