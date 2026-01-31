import { useState, useEffect, useCallback } from "react";
import { Order } from "@/models/order";
import orderService from "@/services/orderService";

interface UseOrdersOptions {
	status?: string;
	autoFetch?: boolean;
}

interface UseOrdersReturn {
	orders: Order[];
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
	fetchTodayOrders: () => Promise<void>;
	fetchPendingOrders: () => Promise<void>;
}

export const useOrders = (options: UseOrdersOptions = {}): UseOrdersReturn => {
	const { status, autoFetch = true } = options;
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(autoFetch);
	const [error, setError] = useState<string | null>(null);

	const fetchOrders = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await orderService.getList({ status });
			if (response.isSuccess && response.data) {
				setOrders(response.data.items);
			} else {
				setError(response.message || "Failed to fetch orders");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	}, [status]);

	const fetchTodayOrders = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await orderService.getTodayOrders();
			if (response.isSuccess && response.data) {
				setOrders(response.data.items);
			} else {
				setError(response.message || "Failed to fetch today orders");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	}, []);

	const fetchPendingOrders = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await orderService.getPendingOrders();
			if (response.isSuccess && response.data) {
				setOrders(response.data.items);
			} else {
				setError(response.message || "Failed to fetch pending orders");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (autoFetch) {
			fetchOrders();
		}
	}, [autoFetch, fetchOrders]);

	return {
		orders,
		isLoading,
		error,
		refetch: fetchOrders,
		fetchTodayOrders,
		fetchPendingOrders,
	};
};

export default useOrders;
