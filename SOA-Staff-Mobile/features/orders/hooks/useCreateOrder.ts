import { useState, useCallback } from "react";
import { Order, CreateOrderRequest } from "@/models/order";
import orderService from "@/services/orderService";
import { useCartStore } from "@/stores";

interface UseCreateOrderReturn {
	isLoading: boolean;
	error: string | null;
	createdOrder: Order | null;
	createOrder: () => Promise<Order | null>;
	reset: () => void;
}

export const useCreateOrder = (): UseCreateOrderReturn => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

	const cartStore = useCartStore();

	const createOrder = useCallback(async (): Promise<Order | null> => {
		if (cartStore.items.length === 0) {
			setError("Cart is empty");
			return null;
		}

		try {
			setIsLoading(true);
			setError(null);

			// Transform cart items to order request
			const orderRequest: CreateOrderRequest = {
				items: cartStore.items.map((item) => ({
					productId: item.productId,
					sizeId: item.selectedSize.id,
					quantity: item.quantity,
					toppings: item.selectedToppings.map((t) => ({
						toppingId: t.id,
						quantity: t.quantity,
					})),
					note: item.note,
				})),
				includeVat: cartStore.includeVat,
				voucherCode: cartStore.voucherCode || undefined,
				note: cartStore.note || undefined,
			};

			const response = await orderService.create(orderRequest);

			if (response.isSuccess && response.data) {
				setCreatedOrder(response.data);
				cartStore.clearCart(); // Clear cart after successful order
				return response.data;
			} else {
				setError(response.message || "Failed to create order");
				return null;
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			return null;
		} finally {
			setIsLoading(false);
		}
	}, [cartStore]);

	const reset = useCallback(() => {
		setError(null);
		setCreatedOrder(null);
	}, []);

	return {
		isLoading,
		error,
		createdOrder,
		createOrder,
		reset,
	};
};

export default useCreateOrder;
