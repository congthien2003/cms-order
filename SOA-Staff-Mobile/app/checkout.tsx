import { useState, useMemo } from "react";
import {
	View,
	ScrollView,
	TouchableOpacity,
	Switch,
	Alert,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { SafeArea } from "@/components/ui/safe-area";
import {
	Heading2,
	Heading3,
	Body,
	Caption,
	Label,
	Typography,
} from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart";
import { useVoucher } from "@/features/vouchers";
import { useCreateOrder } from "@/features/orders";

const PLACEHOLDER_IMAGE =
	"https://via.placeholder.com/200x200.png?text=No+Image";

const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(amount);
};

export default function CheckoutScreen() {
	const router = useRouter();
	const {
		items,
		itemCount,
		totalAmount,
		updateItemQuantity,
		removeItem,
		clearCart,
	} = useCart();
	const { applyVoucher, currentVoucher, removeVoucher, isApplying } =
		useVoucher();
	const { createOrder, isCreating } = useCreateOrder();

	const [orderType, setOrderType] = useState<"dine-in" | "takeaway">(
		"dine-in",
	);
	const [voucherCode, setVoucherCode] = useState("");
	const [note, setNote] = useState("");
	const [applyVat, setApplyVat] = useState(true);

	const taxAmount = applyVat ? totalAmount * 0.08 : 0;

	const discountAmount = useMemo(() => {
		if (!currentVoucher) return 0;
		if (currentVoucher.type === "percentage") {
			return (totalAmount * currentVoucher.value) / 100;
		}
		return currentVoucher.value;
	}, [currentVoucher, totalAmount]);

	const finalTotal = useMemo(() => {
		return Math.max(0, totalAmount + taxAmount - discountAmount);
	}, [totalAmount, taxAmount, discountAmount]);

	const handleCreateOrder = async () => {
		if (items.length === 0) return;

		try {
			await createOrder();
			clearCart();
			router.push("/(tabs)");
			Alert.alert("Thành công", "Đơn hàng đã được tạo");
		} catch (error) {
			Alert.alert("Lỗi", "Không thể tạo đơn hàng. Vui lòng thử lại.");
		}
	};

	if (items.length === 0) {
		return (
			<SafeArea>
				<View className="flex-1 bg-white dark:bg-[#10221c]">
					<View className="flex-row items-center px-4 py-3 border-b border-secondary-100 dark:border-slate-800">
						<TouchableOpacity
							onPress={() => router.back()}
							className="w-10 h-10 items-center justify-center">
							<Ionicons
								name="chevron-back"
								size={24}
								className="text-slate-900 dark:text-slate-100"
							/>
						</TouchableOpacity>
						<Heading3 className="flex-1 text-center">
							Review Order
						</Heading3>
						<View className="w-10 h-10 items-center justify-center" />
					</View>
					<View className="flex-1 items-center justify-center p-6">
						<Ionicons
							name="cart-outline"
							size={64}
							color="#9ca3af"
						/>
						<Heading3 className="mt-4">Giỏ hàng trống</Heading3>
						<Caption className="text-center mt-2 mb-6 text-base">
							Bạn chưa có sản phẩm nào trong giỏ hàng
						</Caption>
						<Button
							variant="primary"
							onPress={() => router.push("/(tabs)")}
							className="px-6 py-3">
							Tiếp tục chọn món
						</Button>
					</View>
				</View>
			</SafeArea>
		);
	}

	return (
		<SafeArea>
			<View className="flex-1 bg-gray-50 dark:bg-[#10221c] w-full relative">
				{/* Header */}
				<View className="flex-row items-center px-4 py-2 bg-white dark:bg-slate-900 border-b border-secondary-100 dark:border-slate-800 sticky top-0 z-10">
					<TouchableOpacity
						onPress={() => router.back()}
						className="w-10 h-10 items-center justify-center z-10">
						<Ionicons
							name="chevron-back"
							size={24}
							className="text-slate-900 dark:text-slate-100"
						/>
					</TouchableOpacity>
					<View className="absolute left-0 right-0 flex-row justify-center pointer-events-none">
						<Typography
							variant="h4"
							className="text-slate-900 dark:text-slate-100">
							Review Order
						</Typography>
					</View>
					<View className="flex-1" />
					<TouchableOpacity className="w-10 h-10 items-center justify-center">
						<Ionicons
							name="ellipsis-horizontal"
							size={24}
							color="#9ca3af"
						/>
					</TouchableOpacity>
				</View>

				{/* Order Type Segmented Control */}
				<View className="bg-white dark:bg-slate-900 flex-row border-b border-secondary-100 dark:border-slate-800 px-4 pt-1 justify-between shadow-sm">
					<TouchableOpacity
						className={`flex-1 flex-col items-center justify-center pt-3 pb-3 border-b-4 ${orderType === "dine-in" ? "border-[#2beead]" : "border-transparent"}`}
						onPress={() => setOrderType("dine-in")}
						activeOpacity={0.7}>
						<View className="flex-row items-center gap-2">
							<Ionicons
								name="restaurant"
								size={16}
								className={
									orderType === "dine-in"
										? "text-slate-900 dark:text-slate-100"
										: "text-slate-400"
								}
							/>
							<Label
								color={
									orderType === "dine-in"
										? "default"
										: "muted"
								}
								weight="bold"
								className="tracking-wide">
								Dine-in
							</Label>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						className={`flex-1 flex-col items-center justify-center pt-3 pb-3 border-b-4 ${orderType === "takeaway" ? "border-[#2beead]" : "border-transparent"}`}
						onPress={() => setOrderType("takeaway")}
						activeOpacity={0.7}>
						<View className="flex-row items-center gap-2">
							<Ionicons
								name="bag"
								size={16}
								className={
									orderType === "takeaway"
										? "text-slate-900 dark:text-slate-100"
										: "text-slate-400"
								}
							/>
							<Label
								color={
									orderType === "takeaway"
										? "default"
										: "muted"
								}
								weight="bold"
								className="tracking-wide">
								Takeaway
							</Label>
						</View>
					</TouchableOpacity>
				</View>

				<ScrollView
					className="flex-1"
					contentContainerStyle={{ paddingBottom: 260 }}>
					{/* Order Items Count */}
					<View className="p-4 bg-gray-50 dark:bg-[#10221c]">
						<View className="flex-row items-center justify-between">
							<Heading3 className="tracking-tight">
								Order Items
							</Heading3>
							<Label color="primary" weight="semibold">
								{itemCount} Items
							</Label>
						</View>
					</View>

					{/* Cart Items */}
					<View className="flex-col bg-white dark:bg-slate-900 border-y border-secondary-50 dark:border-slate-800">
						{items.map((item, index) => (
							<View
								key={item.id}
								className={`flex-row gap-4 px-4 py-4 justify-between bg-white dark:bg-slate-900 ${index !== items.length - 1 ? "border-b border-secondary-50 dark:border-slate-800" : ""}`}>
								<View className="flex-row items-start gap-4 flex-1">
									<View className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-slate-800 shadow-sm overflow-hidden p-1 border border-secondary-100 dark:border-slate-700">
										<Image
											source={{
												uri:
													item.productImageUrl ||
													PLACEHOLDER_IMAGE,
											}}
											style={{
												width: "100%",
												height: "100%",
											}}
											contentFit="cover"
											className="rounded-lg"
										/>
									</View>
									<View className="flex-1 justify-center">
										<Body
											weight="bold"
											className="leading-normal">
											{item.productName}
										</Body>
										{item.selectedToppings?.length > 0 && (
											<Caption
												weight="medium"
												className="leading-normal mt-0.5">
												+
												{item.selectedToppings
													.map(
														(t) =>
															`${t.quantity}x ${t.name}`,
													)
													.join(", ")}
											</Caption>
										)}
										{item.note ? (
											<Caption
												className="leading-normal italic mt-0.5"
												numberOfLines={2}>
												{item.note}
											</Caption>
										) : (
											<Caption className="leading-normal italic mt-0.5">
												Size: {item.selectedSize.name}
											</Caption>
										)}
										<Label
											color="primary"
											weight="bold"
											className="mt-1">
											{formatCurrency(item.unitPrice)}
										</Label>
									</View>
								</View>

								<View className="items-end justify-between py-1">
									<View className="flex-row items-center gap-2 bg-gray-50 dark:bg-slate-800 p-1 rounded-full border border-secondary-100 dark:border-slate-700">
										<TouchableOpacity
											onPress={() =>
												updateItemQuantity(
													item.id,
													item.quantity - 1,
												)
											}
											className="flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-sm">
											<Label weight="bold">-</Label>
										</TouchableOpacity>
										<Label
											weight="bold"
											className="w-4 text-center">
											{item.quantity}
										</Label>
										<TouchableOpacity
											onPress={() =>
												updateItemQuantity(
													item.id,
													item.quantity + 1,
												)
											}
											className="flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-sm">
											<Label weight="bold">+</Label>
										</TouchableOpacity>
									</View>
									<TouchableOpacity
										onPress={() => removeItem(item.id)}
										className="mt-4 p-2 -mr-2 -mb-2">
										<Ionicons
											name="trash-outline"
											size={20}
											color="#9ca3af"
										/>
									</TouchableOpacity>
								</View>
							</View>
						))}
					</View>

					{/* Table/Staff Info */}
					<View className="mt-4 px-4 bg-gray-50 dark:bg-[#10221c]">
						<View className="bg-white dark:bg-slate-900/50 rounded-xl p-4 flex-col gap-3 border border-secondary-100 dark:border-slate-800">
							<View className="flex-row justify-between items-center">
								<Caption className="text-sm">
									Table Number
								</Caption>
								<Label weight="bold">B-04</Label>
							</View>
							<View className="flex-row justify-between items-center">
								<Caption className="text-sm">Staff ID</Caption>
								<Label weight="medium">#8821</Label>
							</View>
						</View>
					</View>
				</ScrollView>

				{/* Footer actions */}
				<View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#10221c] border-t border-secondary-100 dark:border-slate-800 p-4 pb-12 w-full z-20">
					<View className="space-y-2 mb-4">
						<View className="flex-row justify-between text-sm">
							<Caption className="text-sm">Subtotal</Caption>
							<Label weight="medium">
								{formatCurrency(totalAmount)}
							</Label>
						</View>

						{applyVat && (
							<View className="flex-row justify-between text-sm mt-1.5">
								<Caption className="text-sm">Tax (8%)</Caption>
								<Label weight="medium">
									{formatCurrency(taxAmount)}
								</Label>
							</View>
						)}

						{currentVoucher && (
							<View className="flex-row justify-between text-sm mt-1.5">
								<Label color="success">Giảm giá</Label>
								<Label color="success" weight="medium">
									-{formatCurrency(discountAmount)}
								</Label>
							</View>
						)}

						<View className="flex-row justify-between items-center pt-3 mt-1.5 border-t border-secondary-50 dark:border-slate-800">
							<Heading3>Total</Heading3>
							<Typography
								variant="h2"
								color="primary"
								className="tracking-tight">
								{formatCurrency(finalTotal)}
							</Typography>
						</View>
					</View>

					<View className="flex-col gap-3">
						<Button
							variant="primary"
							size="lg"
							loading={isCreating}
							onPress={handleCreateOrder}
							fullWidth
							leftIcon={
								<Ionicons name="cart" size={20} color="#fff" />
							}>
							Submit to POS
						</Button>

						<Button
							variant="secondary"
							size="lg"
							onPress={() => router.back()}
							fullWidth>
							Add More Items
						</Button>
					</View>
				</View>
			</View>
		</SafeArea>
	);
}
