import { useState, useMemo, useCallback } from "react";
import { View, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { SafeArea } from "@/components/ui/safe-area";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading2, Body, Caption } from "@/components/ui/typography";
import { useCategories } from "@/features/categories";
import { useAuth } from "@/providers/authProvider";
import { Category } from "@/models/category";

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/200x200.png?text=No+Image";

function CategoryCard({
  category,
  onPress,
}: {
  category: Category;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-1 m-1.5 bg-white rounded-xl overflow-hidden border border-gray-100"
      style={{
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }}>
      <Image
        source={{ uri: category.imageUrl || PLACEHOLDER_IMAGE }}
        style={{ width: "100%", height: 120 }}
        contentFit="cover"
        transition={200}
      />
      <View className="p-3">
        <Body className="font-semibold" numberOfLines={1}>
          {category.name}
        </Body>
        {category.description && (
          <Caption className="text-gray-500 mt-0.5" numberOfLines={2}>
            {category.description}
          </Caption>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const { categories, isLoading, error, refetch } = useCategories();
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const filteredCategories = useMemo(() => {
    if (!searchText.trim()) return categories;
    const query = searchText.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query),
    );
  }, [categories, searchText]);

  const handleCategoryPress = useCallback(
    (category: Category) => {
      router.push({
        pathname: "/products",
        params: { categoryId: category.id, categoryName: category.name },
      });
    },
    [router],
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderCategory = useCallback(
    ({ item }: { item: Category }) => (
      <CategoryCard category={item} onPress={() => handleCategoryPress(item)} />
    ),
    [handleCategoryPress],
  );

  return (
    <SafeArea>
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-4 pt-2 pb-3 border-b border-gray-100">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Heading2>Menu</Heading2>
              {user && (
                <Caption className="text-gray-500">
                  Xin chào, {user.fullName}
                </Caption>
              )}
            </View>
            <TouchableOpacity
              onPress={logout}
              className="p-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="log-out-outline" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <Input
            placeholder="Tìm kiếm danh mục..."
            value={searchText}
            onChangeText={setSearchText}
            leftIcon={<Ionicons name="search" size={18} color="#9ca3af" />}
            rightIcon={
              searchText ? (
                <TouchableOpacity onPress={() => setSearchText("")}>
                  <Ionicons name="close-circle" size={18} color="#9ca3af" />
                </TouchableOpacity>
              ) : undefined
            }
          />
        </View>

        {/* Content */}
        {isLoading && !refreshing ? (
          <Loading />
        ) : error ? (
          <EmptyState
            title="Không thể tải danh mục"
            description={error}
            icon="alert-circle-outline"
            actionLabel="Thử lại"
            onAction={refetch}
          />
        ) : (
          <FlatList
            data={filteredCategories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={{ padding: 8, paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            ListEmptyComponent={
              <EmptyState
                title={searchText ? "Không tìm thấy" : "Chưa có danh mục"}
                description={
                  searchText
                    ? "Không có danh mục nào khớp với tìm kiếm"
                    : "Danh mục sản phẩm sẽ hiển thị ở đây"
                }
                icon="folder-open-outline"
              />
            }
          />
        )}
      </View>
    </SafeArea>
  );
}
