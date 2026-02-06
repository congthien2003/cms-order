import { useCallback, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";

import { SafeArea } from "@/components/ui/safe-area";
import { Loading } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Body, Caption, Label } from "@/components/ui/typography";
import { useProducts } from "@/features/products";
import { Product } from "@/models/product";
import HeaderScreen from "@/components/ui/header-screen";

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/200x200.png?text=No+Image";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

function ProductCard({
  product,
  onPress,
}: {
  product: Product;
  onPress: () => void;
}) {
  const defaultSize =
    product.sizes?.find((s) => s.isDefault) || product.sizes?.[0];
  const displayPrice = defaultSize?.price ?? product.basePrice;
  const hasMultipleSizes = product.sizes && product.sizes.length > 1;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row bg-white rounded-xl overflow-hidden border border-gray-100 mb-3 mx-4"
      style={{
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }}>
      <Image
        source={{ uri: product.imageUrl || PLACEHOLDER_IMAGE }}
        style={{ width: 100, height: 100 }}
        contentFit="cover"
        transition={200}
      />
      <View className="flex-1 p-3 justify-between">
        <View>
          <Body className="font-semibold" numberOfLines={1} color="primary">
            {product.name}
          </Body>
          {product.description && (
            <Caption className="text-gray-500 mt-0.5" numberOfLines={2}>
              {product.description}
            </Caption>
          )}
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <Label className="text-primary-600 font-bold">
            {formatCurrency(displayPrice)}
          </Label>
          {hasMultipleSizes && (
            <Badge variant="default">{product.sizes.length} size</Badge>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ProductsScreen() {
  const router = useRouter();
  const { categoryId, categoryName } = useLocalSearchParams<{
    categoryId: string;
    categoryName: string;
  }>();

  const { products, isLoading, error, refetch } = useProducts({
    categoryId,
    autoFetch: true,
  });
  const [refreshing, setRefreshing] = useState(false);

  const handleProductPress = useCallback(
    (product: Product) => {
      router.push({
        pathname: "/product-detail",
        params: { productId: product.id },
      });
    },
    [router],
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onPress={() => handleProductPress(item)} />
    ),
    [handleProductPress],
  );

  return (
    <SafeArea>
      <View className="flex-1 bg-gray-50">
        <HeaderScreen title="Sản phẩm" />
        {isLoading && !refreshing ? (
          <Loading />
        ) : error ? (
          <EmptyState
            title="Không thể tải sản phẩm"
            description={error}
            icon="alert-circle-outline"
            actionLabel="Thử lại"
            onAction={refetch}
          />
        ) : (
          <FlatList
            data={products}
            renderItem={renderProduct}
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
                title="Chưa có sản phẩm"
                description={`Danh mục "${categoryName}" hiện chưa có sản phẩm nào`}
                icon="cube-outline"
              />
            }
          />
        )}
      </View>
    </SafeArea>
  );
}
