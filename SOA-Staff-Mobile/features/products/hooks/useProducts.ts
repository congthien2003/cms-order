import { useState, useEffect, useCallback } from "react";
import { Product } from "@/models/product";
import productService from "@/services/productService";

interface UseProductsOptions {
	categoryId?: string;
	autoFetch?: boolean;
}

interface UseProductsReturn {
	products: Product[];
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
	fetchByCategory: (categoryId: string) => Promise<void>;
}

export const useProducts = (
	options: UseProductsOptions = {},
): UseProductsReturn => {
	const { categoryId, autoFetch = true } = options;
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(autoFetch);
	const [error, setError] = useState<string | null>(null);

	const fetchProducts = useCallback(async (catId?: string) => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await productService.getActiveProducts(catId);
			if (response.isSuccess && response.data) {
				setProducts(response.data.items);
			} else {
				setError(response.message || "Failed to fetch products");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	}, []);

	const fetchByCategory = useCallback(
		async (catId: string) => {
			await fetchProducts(catId);
		},
		[fetchProducts],
	);

	useEffect(() => {
		if (autoFetch) {
			fetchProducts(categoryId);
		}
	}, [autoFetch, categoryId, fetchProducts]);

	return {
		products,
		isLoading,
		error,
		refetch: () => fetchProducts(categoryId),
		fetchByCategory,
	};
};

export default useProducts;
