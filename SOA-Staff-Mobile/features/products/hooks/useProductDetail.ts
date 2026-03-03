import { useState, useCallback } from "react";
import { ProductDetailResponse } from "@/models/product";
import productService from "@/services/productService";

type ApiProductSizeResponse = {
	id: string;
	sizeName: string;
	priceAdjustment: number;
	isDefault: boolean;
	isActive: boolean;
};

type ApiProductToppingResponse = {
	toppingId: string;
	toppingName: string;
	price: number;
	imageUrl?: string | null;
	isDefault: boolean;
};

type ApiProductDetailResponse = {
	id: string;
	name: string;
	description?: string;
	imageUrl?: string;
	categoryId: string;
	categoryName?: string;
	basePrice: number;
	isActive: boolean;
	createdDate?: string;
	modifiedDate?: string;
	sizes?: ApiProductSizeResponse[];
	availableToppings?: ApiProductToppingResponse[];
};

function mapApiProductDetailToMobile(
	api: ApiProductDetailResponse
): ProductDetailResponse {
	return {
		id: api.id,
		name: api.name,
		description: api.description,
		imageUrl: api.imageUrl,
		categoryId: api.categoryId,
		categoryName: api.categoryName,
		basePrice: api.basePrice,
		isActive: api.isActive,
		createdAt: api.createdDate || new Date().toISOString(),
		updatedAt: api.modifiedDate,
		sizes: (api.sizes || [])
			.filter((s) => s.isActive)
			.map((s) => ({
				id: s.id,
				name: s.sizeName,
				price: api.basePrice + (s.priceAdjustment || 0),
				isDefault: s.isDefault,
			})),
		availableToppings: (api.availableToppings || []).map((t) => ({
			toppingId: t.toppingId,
			toppingName: t.toppingName,
			price: t.price,
			imageUrl: t.imageUrl || "",
			isDefault: t.isDefault,
		})),
	};
}

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
				const mappedProduct = mapApiProductDetailToMobile(response.data as any);
				setProduct(mappedProduct);
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
