import { useState, useMemo, useCallback, useEffect } from "react";
import { View, TouchableOpacity, RefreshControl, ScrollView } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import { SafeArea } from "@/components/ui/safe-area";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading2, Body, Caption, Label, Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { PressableCard } from "@/components/ui/card";
import { useCategories } from "@/features/categories";
import { useProducts } from "@/features/products";
import { useAuth } from "@/providers/authProvider";
import { useCart } from "@/features/cart";
import { Product } from "@/models/product";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/200x200.png?text=No+Image";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export default function HomeScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const cart = useCart();
  
  const { categories, isLoading: isCategoriesLoading, error: categoriesError, refetch: refetchCategories } = useCategories();
  
  const [searchText, setSearchText] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  // AutoFetch might need categoryId to be exactly valid, falling back to undefined
  const { products, isLoading: isProductsLoading, error: productsError, refetch: refetchProducts } = useProducts({
    categoryId: selectedCategoryId || undefined,
    autoFetch: true,
  });

  const filteredProducts = useMemo(() => {
    if (!searchText.trim()) return products;
    const query = searchText.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(query));
  }, [products, searchText]);

  const handleProductPress = useCallback((product: Product) => {
    router.push({
      pathname: "/product-detail",
      params: { productId: product.id },
    });
  }, [router]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchCategories(), refetchProducts()]);
    setRefreshing(false);
  }, [refetchCategories, refetchProducts]);

  const renderProduct = useCallback(({ item }: { item: Product }) => {
    const defaultSize = item.sizes?.find((s) => s.isDefault) || item.sizes?.[0];
    const displayPrice = defaultSize?.price ?? item.basePrice;

    return (
      <View className="flex-1 max-w-[50%] p-2">
        <PressableCard
          onPress={() => handleProductPress(item)}
          padding="none"
          variant="elevated"
          className="overflow-hidden flex flex-col h-full border border-slate-100 dark:border-slate-800"
        >
          <View className="relative h-32 w-full bg-slate-200 dark:bg-slate-700">
            <Image
              source={{ uri: item.imageUrl || PLACEHOLDER_IMAGE }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={200}
            />
            {item.isPopular && (
              <View className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 rounded-full p-1.5 shadow-sm">
                <Ionicons name="star" size={14} color="#2beead" />
              </View>
            )}
          </View>
          <View className="p-3 flex flex-col flex-1 justify-between">
            <View>
              <Body className="font-bold leading-tight" numberOfLines={1}>
                {item.name}
              </Body>
              <Caption className="mt-1">{formatCurrency(displayPrice)}</Caption>
            </View>
            <View className="mt-3">
              <Button 
                variant="primary" 
                size="sm" 
                leftIcon={<Ionicons name="add" size={16} color="#fff" />}
                onPress={() => handleProductPress(item)}
              >
                Thêm
              </Button>
            </View>
          </View>
        </PressableCard>
      </View>
    );
  }, [handleProductPress]);

  const ListHeaderComponent = useCallback(() => (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mx-4 mb-2 mt-4">
        <Heading2 className="tracking-tight text-lg">Tất cả sản phẩm</Heading2>
      </View>
    </View>
  ), []);

  return (
    <SafeArea>
      <View className="flex-1 bg-gray-50 dark:bg-background-dark">
        {/* Top Header */}
        <View className="flex-row items-center bg-white dark:bg-slate-900 px-4 pt-2 pb-3 border-b border-gray-100 dark:border-slate-800 justify-between z-20">
          <TouchableOpacity className="w-10 items-center justify-center">
            <Ionicons name="menu" size={24} className="text-slate-900 dark:text-slate-100" />
          </TouchableOpacity>
          <Heading2 className="flex-1 text-center tracking-tight text-lg">New Order</Heading2>
          <TouchableOpacity onPress={logout} className="w-10 items-center justify-end">
            <Ionicons name="person-circle-outline" size={28} className="text-slate-900 dark:text-slate-100" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-white dark:bg-slate-900 px-4 py-3 z-10">
          <Input
            placeholder="Tìm món, topping..."
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

        {/* Categories Selector */}
        <View className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 z-10 pb-3">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            <TouchableOpacity
              onPress={() => setSelectedCategoryId("")}
              className={`flex h-9 shrink-0 items-center justify-center rounded-full px-4 ${
                selectedCategoryId === "" ? "bg-primary-600" : "bg-slate-100 dark:bg-slate-800"
              }`}
            >
              <Label className={selectedCategoryId === "" ? "text-white font-bold" : "text-slate-600 dark:text-slate-300 font-medium"}>
                All Items
              </Label>
            </TouchableOpacity>
            
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategoryId(category.id)}
                className={`flex h-9 shrink-0 items-center justify-center rounded-full px-4 ${
                  selectedCategoryId === category.id ? "bg-primary-600" : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                <Label className={selectedCategoryId === category.id ? "text-white font-bold" : "text-slate-600 dark:text-slate-300 font-medium"}>
                  {category.name}
                </Label>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Grid */}
        <View className="flex-1 w-full bg-gray-50 dark:bg-background-dark">
          {(isProductsLoading || isCategoriesLoading) && !refreshing ? (
            <Loading />
          ) : (productsError || categoriesError) ? (
            <EmptyState
              title="Không thể tải dữ liệu"
              description={productsError || categoriesError}
              icon="alert-circle-outline"
              actionLabel="Thử lại"
              onAction={handleRefresh}
            />
          ) : (
            <FlashList
              data={filteredProducts}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              numColumns={2}
              estimatedItemSize={250}
              contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: cart.itemCount > 0 ? 100 : 20 }}
              ListHeaderComponent={ListHeaderComponent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
              }
              ListEmptyComponent={
                <EmptyState
                  title={searchText ? "Không tìm thấy" : "Chưa có sản phẩm"}
                  description={
                    searchText
                      ? "Không có sản phẩm nào khớp với tìm kiếm"
                      : "Danh mục này hiện chưa có sản phẩm nào"
                  }
                  icon="cafe-outline"
                />
              }
            />
          )}
        </View>

        {/* Floating Cart Summary */}
        {cart.itemCount > 0 && (
          <View className="absolute bottom-4 left-0 right-0 px-4 items-center z-30">
            <View className="w-full max-w-[400px] bg-slate-900 border border-slate-700 rounded-2xl p-4 flex-row items-center justify-between shadow-xl" style={{ elevation: 5 }}>
              <View className="flex-row items-center gap-3">
                <View className="relative">
                  <Ionicons name="cart" size={28} color="#2beead" />
                  <View className="absolute -top-1 -right-2 bg-primary-600 rounded-full h-4 w-4 items-center justify-center">
                    <Typography variant="caption" className="text-[10px] font-bold text-white">{cart.itemCount}</Typography>
                  </View>
                </View>
                <View>
                  <Caption className="text-slate-400">Đơn hàng hiện tại</Caption>
                  <Label className="text-white font-bold">{formatCurrency(cart.totalAmount)}</Label>
                </View>
              </View>
              <Button 
                variant="primary"
                onPress={() => router.push("/checkout")}
                className="rounded-xl px-5 py-2 h-auto"
              >
                Thanh toán
              </Button>
            </View>
          </View>
        )}
      </View>
    </SafeArea>
  );
}
