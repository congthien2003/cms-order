import { useState, useCallback } from "react";
import { ProductDetailResponse } from "@/models/product";
import productService from "@/services/productService";

interface UseProductDetailReturn {
	product: ProductDetailResponse | null;
	isLoading: boolean;
	error: string | null;
	fetchProduct: (id: string) => Promise<void>;
	clearProduct: () => void;
}

export const useProductDetail = (): UseProductDetailReturn => {
	const [product, setProduct] = useState<ProductDetailResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchProduct = useCallback(async (id: string) => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await productService.getById(id);
			if (response.isSuccess && response.data) {
				setProduct(response.data);
			} else {
				setError(response.message || "Failed to fetch product");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	}, []);

	const clearProduct = useCallback(() => {
		setProduct(null);
		setError(null);
	}, []);

	return {
		product,
		isLoading,
		error,
		fetchProduct,
		clearProduct,
	};
};

export default useProductDetail;
