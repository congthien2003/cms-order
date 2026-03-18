import { useEffect, useState, useCallback, useMemo } from "react";
import { View, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { SafeArea } from "@/components/ui/safe-area";
import { Loading } from "@/components/ui/loading";
import { QuantityInput } from "@/components/ui/quantity-input";
import { Body, Caption, Label, Heading2, Heading4, Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useProductDetail } from "@/features/products";
import { useCart } from "@/features/cart";
import { ProductSize } from "@/models/product";
import { Topping } from "@/models/topping";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x300.png?text=No+Image";

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
  const [iceLevel, setIceLevel] = useState<string>("50");
  const [sugarLevel, setSugarLevel] = useState<string>("100");
  const [selectedToppings, setSelectedToppings] = useState<SelectedTopping[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  useEffect(() => {
    if (product?.sizes) {
      const defaultSize = product.sizes.find((s) => s.isDefault) || product.sizes[0];
      if (defaultSize) setSelectedSize(defaultSize);
    }
  }, [product]);

  const handleReset = useCallback(() => {
    if (product?.sizes) {
      const defaultSize = product.sizes.find((s) => s.isDefault) || product.sizes[0];
      if (defaultSize) setSelectedSize(defaultSize);
    }
    setIceLevel("50");
    setSugarLevel("100");
    setSelectedToppings([]);
    setQuantity(1);
    setNote("");
  }, [product]);

  const toggleTopping = useCallback((topping: { id: string; name: string; price: number }) => {
    setSelectedToppings((prev) => {
      const exists = prev.find((t) => t.id === topping.id);
      if (exists) return prev.filter((t) => t.id !== topping.id);
      return [...prev, { ...topping, imageUrl: undefined, isActive: true, createdAt: "", quantity: 1 } as SelectedTopping];
    });
  }, []);

  const updateToppingQuantity = useCallback((toppingId: string, qty: number) => {
    if (qty <= 0) {
      setSelectedToppings((prev) => prev.filter((t) => t.id !== toppingId));
      return;
    }
    setSelectedToppings((prev) => prev.map((t) => (t.id === toppingId ? { ...t, quantity: qty } : t)));
  }, []);

  const toppingsTotal = useMemo(() => {
    return selectedToppings.reduce((sum, t) => sum + t.price * t.quantity, 0);
  }, [selectedToppings]);

  const unitPrice = useMemo(() => {
    if (!selectedSize) return product?.basePrice ?? 0;
    return selectedSize.price + toppingsTotal;
  }, [selectedSize, toppingsTotal, product]);

  const totalPrice = useMemo(() => unitPrice * quantity, [unitPrice, quantity]);

  const handleAddToCart = useCallback(() => {
    if (!product || (!selectedSize && product.sizes && product.sizes.length > 0)) {
      Alert.alert("Lỗi", "Vui lòng chọn size sản phẩm");
      return;
    }

    const customizationNote = [
      `Đá: ${iceLevel}%`,
      `Đường: ${sugarLevel}%`,
      note.trim()
    ].filter(Boolean).join(" | ");

    addItem({
      productId: product.id,
      productName: product.name,
      productImageUrl: product.imageUrl,
      selectedSize: selectedSize || { id: "default", name: "Standard", price: product.basePrice, isDefault: true, createdAt: "" },
      selectedToppings,
      quantity,
      note: customizationNote || undefined,
    });

    router.back();
  }, [product, selectedSize, iceLevel, sugarLevel, selectedToppings, quantity, note, addItem, router]);

  if (isLoading) return <SafeArea><Loading /></SafeArea>;

  if (error || !product) {
    return (
      <SafeArea>
        <View className="flex-1 items-center justify-center p-6 bg-white dark:bg-slate-900">
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Body className="text-center mt-4 text-gray-500">{error || "Không tìm thấy sản phẩm"}</Body>
          <Button variant="outline" onPress={() => router.back()} className="mt-4">
            Quay lại
          </Button>
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <View className="flex-1 bg-gray-50 dark:bg-background-dark w-full">
        {/* Top App Bar */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-secondary-200 dark:border-slate-800 z-10">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
            <Ionicons name="close" size={24} className="text-slate-900 dark:text-slate-100" />
          </TouchableOpacity>
          <View className="flex-col items-center flex-1">
            <Typography variant="h4" className="text-slate-900 dark:text-slate-100 leading-tight" numberOfLines={1}>
              {product.name}
            </Typography>
            <Caption>Tùy chỉnh món</Caption>
          </View>
          <TouchableOpacity onPress={handleReset} className="w-10 h-10 items-center justify-center">
            <Label color="primary" weight="bold">Reset</Label>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Product Preview Header */}
          <View className="px-4 py-6 flex-row items-center gap-4 bg-white dark:bg-slate-900 mb-2 border-b border-secondary-100 dark:border-slate-800">
            <View className="w-20 h-20 rounded-xl bg-primary-50 flex items-center justify-center overflow-hidden">
              <Image
                source={{ uri: product.imageUrl || PLACEHOLDER_IMAGE }}
                style={{ width: "100%", height: "100%" }}
                contentFit="contain"
                transition={200}
              />
            </View>
            <View>
              <Heading2>{formatCurrency(selectedSize?.price || product.basePrice)}</Heading2>
              <Caption>Giá cơ bản • {selectedSize?.name || 'Size chuẩn'}</Caption>
            </View>
          </View>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
             <View className="bg-white dark:bg-slate-900 px-4 py-4 mb-2">
               <Label className="mb-3 text-base" weight="bold">Chọn Size</Label>
               <View className="flex-row bg-gray-50 dark:bg-slate-800 rounded-xl p-1 h-11 w-full gap-1">
                 {product.sizes.map((size) => {
                    const isSelected = selectedSize?.id === size.id;
                    return (
                      <TouchableOpacity
                        key={size.id}
                        onPress={() => setSelectedSize(size)}
                        className={`flex-1 items-center justify-center rounded-lg ${isSelected ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                      >
                        <Label color={isSelected ? "primary" : "muted"} weight={isSelected ? "bold" : "semibold"}>
                          {size.name}
                        </Label>
                      </TouchableOpacity>
                    );
                 })}
               </View>
             </View>
          )}

          {/* Ice Level Selection */}
          <View className="bg-white dark:bg-slate-900 px-4 py-4 mb-2">
            <View className="flex-row items-center gap-2 mb-3">
              <Ionicons name="snow" size={18} color="#2beead" />
              <Label className="text-base" weight="bold">Mức Đá</Label>
            </View>
            <View className="flex-row bg-gray-50 dark:bg-slate-800 rounded-xl p-1 h-11 w-full gap-1">
              {['0', '50', '100'].map((level) => (
                <TouchableOpacity
                  key={level}
                  onPress={() => setIceLevel(level)}
                  className={`flex-1 items-center justify-center rounded-lg ${iceLevel === level ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                >
                  <Label color={iceLevel === level ? "primary" : "muted"} weight={iceLevel === level ? "bold" : "semibold"}>
                    {level}%
                  </Label>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sugar Level Selection */}
          <View className="bg-white dark:bg-slate-900 px-4 py-4 mb-2">
            <View className="flex-row items-center gap-2 mb-3">
              <Ionicons name="water" size={18} color="#2beead" />
              <Label className="text-base" weight="bold">Mức Đường</Label>
            </View>
            <View className="flex-row bg-gray-50 dark:bg-slate-800 rounded-xl p-1 h-11 w-full gap-1">
              {['0', '25', '50', '100'].map((level) => (
                <TouchableOpacity
                  key={level}
                  onPress={() => setSugarLevel(level)}
                  className={`flex-1 items-center justify-center rounded-lg ${sugarLevel === level ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                >
                  <Label color={sugarLevel === level ? "primary" : "muted"} weight={sugarLevel === level ? "bold" : "semibold"}>
                    {level}%
                  </Label>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Toppings Selection */}
          {product.availableToppings && product.availableToppings.length > 0 && (
            <View className="bg-white dark:bg-slate-900 px-4 py-4 mb-2">
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="add-circle" size={18} color="#2beead" />
                  <Label className="text-base" weight="bold">Toppings</Label>
                </View>
                <Caption>Tùy chọn</Caption>
              </View>
              
              <View className="gap-3">
                {product.availableToppings.map((topping, index) => {
                  const selected = selectedToppings.find((t) => t.id === topping.toppingId);
                  return (
                    <TouchableOpacity 
                      key={index} 
                      className="flex-row items-center justify-between p-3 rounded-xl border border-secondary-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50"
                      onPress={() => toggleTopping({ id: topping.toppingId, name: topping.toppingName, price: topping.price })}
                      activeOpacity={0.8}
                    >
                      <View className="flex-row items-center gap-3 flex-1">
                        <View className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 items-center justify-center overflow-hidden shadow-sm">
                          <Ionicons name="cube" size={20} color="#9ca3af" />
                        </View>
                        <View>
                          <Label weight="semibold">{topping.toppingName}</Label>
                          <Caption>+{formatCurrency(topping.price)}</Caption>
                        </View>
                      </View>
                      
                      {selected ? (
                        <View className="flex-row items-center gap-3">
                          <TouchableOpacity onPress={() => {}}>
                            <QuantityInput
                              value={selected.quantity}
                              onChange={(qty) => updateToppingQuantity(topping.toppingId, qty)}
                              min={1}
                              max={10}
                            />
                          </TouchableOpacity>
                          <Ionicons name="checkmark-circle" size={28} color="#2beead" />
                        </View>
                      ) : (
                        <Ionicons name="ellipse-outline" size={28} color="#d1d5db" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Notes Field */}
          <View className="bg-white dark:bg-slate-900 px-4 py-4 mb-2">
            <View className="flex-row items-center gap-2 mb-3">
              <Ionicons name="document-text" size={18} color="#2beead" />
              <Label className="text-base" weight="bold">Ghi chú thêm</Label>
            </View>
            <TextInput
              className="w-full rounded-xl border border-secondary-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 text-sm p-4 text-slate-900 dark:text-slate-100"
              placeholder="Vd: Ít đá, chia 2 cốc..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              value={note}
              onChangeText={setNote}
              style={{ textAlignVertical: 'top' }}
            />
          </View>
        </ScrollView>

        {/* Bottom Action Bar */}
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-slate-900/95 border-t border-secondary-200 dark:border-slate-800 z-20 shadow-lg">
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center bg-gray-50 dark:bg-slate-800 rounded-full p-1 h-12 shadow-sm border border-secondary-100 dark:border-slate-700">
               <TouchableOpacity 
                 onPress={() => setQuantity(Math.max(1, quantity - 1))}
                 className="w-10 h-10 rounded-full items-center justify-center"
               >
                 <Ionicons name="remove" size={20} className="text-slate-900 dark:text-slate-100" />
               </TouchableOpacity>
               <Label weight="bold" className="px-3 text-lg">{quantity}</Label>
               <TouchableOpacity 
                 onPress={() => setQuantity(quantity + 1)}
                 className="w-10 h-10 rounded-full items-center justify-center"
               >
                 <Ionicons name="add" size={20} className="text-slate-900 dark:text-slate-100" />
               </TouchableOpacity>
            </View>

            <View className="flex-1">
              <Button 
                variant="primary" 
                onPress={handleAddToCart}
                className="py-3 h-12 shadow-md shadow-primary-500/20"
                rightIcon={<Ionicons name="cart" size={20} color="#fff" />}
              >
                Thêm vào đơn • {formatCurrency(totalPrice)}
              </Button>
            </View>
          </View>
        </View>
      </View>
    </SafeArea>
  );
}
