import { useEffect, useState, useCallback, useMemo } from "react";
import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { SafeArea } from "@/components/ui/safe-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import { QuantityInput } from "@/components/ui/quantity-input";
import { Badge } from "@/components/ui/badge";
import {
  Heading2,
  Heading3,
  Body,
  Caption,
  Label,
} from "@/components/ui/typography";
import { Divider } from "@/components/ui/divider";
import { useProductDetail } from "@/features/products";
import { useCart } from "@/features/cart";
import { ProductSize } from "@/models/product";
import { Topping } from "@/models/topping";

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/400x300.png?text=No+Image";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

interface SelectedTopping extends Topping {
  quantity: number;
}

export default function ProductDetailScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { product, isLoading, error, fetchProduct } = useProductDetail();
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<SelectedTopping[]>(
    [],
  );
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  // Auto-select default size when product loads
  useEffect(() => {
    if (product?.sizes) {
      const defaultSize =
        product.sizes.find((s) => s.isDefault) || product.sizes[0];
      if (defaultSize) {
        setSelectedSize(defaultSize);
      }
    }
  }, [product]);

  const toggleTopping = useCallback(
    (topping: { id: string; name: string; price: number }) => {
      setSelectedToppings((prev) => {
        const exists = prev.find((t) => t.id === topping.id);
        if (exists) {
          return prev.filter((t) => t.id !== topping.id);
        }
        return [
          ...prev,
          {
            ...topping,
            imageUrl: undefined,
            isActive: true,
            createdAt: "",
            quantity: 1,
          } as SelectedTopping,
        ];
      });
    },
    [],
  );

  const updateToppingQuantity = useCallback(
    (toppingId: string, qty: number) => {
      if (qty <= 0) {
        setSelectedToppings((prev) => prev.filter((t) => t.id !== toppingId));
        return;
      }
      setSelectedToppings((prev) =>
        prev.map((t) => (t.id === toppingId ? { ...t, quantity: qty } : t)),
      );
    },
    [],
  );

  const toppingsTotal = useMemo(() => {
    return selectedToppings.reduce((sum, t) => sum + t.price * t.quantity, 0);
  }, [selectedToppings]);

  const unitPrice = useMemo(() => {
    if (!selectedSize) return 0;
    return selectedSize.price + toppingsTotal;
  }, [selectedSize, toppingsTotal]);

  const totalPrice = useMemo(() => {
    return unitPrice * quantity;
  }, [unitPrice, quantity]);

  const handleAddToCart = useCallback(() => {
    if (!product || !selectedSize) {
      Alert.alert("Lỗi", "Vui lòng chọn size sản phẩm");
      return;
    }

    addItem({
      productId: product.id,
      productName: product.name,
      productImageUrl: product.imageUrl,
      selectedSize,
      selectedToppings,
      quantity,
      note: note.trim() || undefined,
    });

    Alert.alert("Thành công", `Đã thêm ${product.name} vào giỏ hàng`, [
      { text: "Tiếp tục mua", onPress: () => router.back() },
      {
        text: "Xem giỏ hàng",
        onPress: () => {
          router.back();
          router.push("/(tabs)/cart");
        },
      },
    ]);
  }, [
    product,
    selectedSize,
    selectedToppings,
    quantity,
    note,
    addItem,
    router,
  ]);

  console.log(product?.availableToppings);

  if (isLoading) {
    return (
      <SafeArea>
        <Loading />
      </SafeArea>
    );
  }

  if (error || !product) {
    return (
      <SafeArea>
        <View className="flex-1 items-center justify-center p-6">
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Body className="text-center mt-4 text-gray-500">
            {error || "Không tìm thấy sản phẩm"}
          </Body>
          <Button
            variant="outline"
            onPress={() => router.back()}
            className="mt-4">
            Quay lại
          </Button>
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <View className="flex-1 bg-white">
        {/* Header with close button */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Heading3 className="flex-1 text-center" numberOfLines={1}>
            {product.name}
          </Heading3>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Product Image */}
          <Image
            source={{ uri: product.imageUrl || PLACEHOLDER_IMAGE }}
            style={{ width: "100%", height: 220 }}
            contentFit="cover"
            transition={200}
          />

          <View className="px-4 py-4">
            {/* Product Info */}
            <Heading2>{product.name}</Heading2>
            {product.description && (
              <Body className="text-gray-500 mt-1">{product.description}</Body>
            )}
            {product.categoryName && (
              <Badge
                variant="default"
                style={{
                  marginTop: 2,
                }}>
                {product.categoryName}
              </Badge>
            )}

            <Divider className="my-4" />

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <View className="mb-4">
                <Label className="mb-2 font-semibold">Chọn Size</Label>
                <View className="flex-row flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize?.id === size.id;
                    return (
                      <TouchableOpacity
                        key={size.id}
                        onPress={() => setSelectedSize(size)}
                        className={`px-4 py-2.5 rounded-lg border ${isSelected
                          ? "bg-primary-600 border-primary-600"
                          : "bg-white border-gray-300"
                          }`}>
                        <Body
                          className={`font-medium ${isSelected ? "text-white" : "text-gray-700"
                            }`}>
                          {size.name}
                        </Body>
                        <Caption
                          className={
                            isSelected ? "text-primary-100" : "text-gray-500"
                          }>
                          {formatCurrency(size.price)}
                        </Caption>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Toppings */}
            {product.availableToppings &&
              product.availableToppings.length > 0 && (
                <View className="mb-4">
                  <Label className="mb-2 font-semibold">Topping</Label>
                  <View className="gap-2">
                    {product.availableToppings.map((topping, index) => {
                      const selected = selectedToppings.find(
                        (t) => t.id === topping.toppingId,
                      );
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => toggleTopping({ id: topping.toppingId, name: topping.toppingName, price: topping.price })}
                          className={`flex-row items-center justify-between p-3 rounded-lg border ${selected
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 bg-white"
                            }`}>
                          <View className="flex-row items-center flex-1">
                            <View
                              className={`w-5 h-5 rounded border mr-3 items-center justify-center ${selected
                                ? "bg-primary-600 border-primary-600"
                                : "border-gray-300"
                                }`}>
                              {selected && (
                                <Ionicons
                                  name="checkmark"
                                  size={14}
                                  color="white"
                                />
                              )}
                            </View>
                            <Body className="text-gray-700">{topping.toppingName}</Body>
                          </View>
                          <View className="flex-row items-center gap-3">
                            <Caption className="text-gray-600">
                              +{formatCurrency(topping.price)}
                            </Caption>
                            {selected && (
                              <QuantityInput
                                value={selected.quantity}
                                onChange={(qty) =>
                                  updateToppingQuantity(topping.toppingId, qty)
                                }
                                min={1}
                                max={10}
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

            {/* Quantity */}
            <View className="mb-4">
              <Label className="mb-2 font-semibold">Số lượng</Label>
              <QuantityInput
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={99}
              />
            </View>

            {/* Note */}
            <View className="mb-4">
              <Label className="mb-2 font-semibold">Ghi chú</Label>
              <Input
                placeholder="Ít đá, nhiều đường..."
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={2}
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Bar - Add to Cart */}
        <View className="px-4 py-3 border-t border-gray-200 bg-white">
          <View className="flex-row items-center justify-between mb-2">
            <Body className="text-gray-500">Tổng cộng</Body>
            <Heading3 className="text-primary-600">
              {formatCurrency(totalPrice)}
            </Heading3>
          </View>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleAddToCart}
            leftIcon={<Ionicons name="cart-outline" size={20} color="white" />}>
            Thêm vào giỏ hàng
          </Button>
        </View>
      </View>
    </SafeArea>
  );
}
