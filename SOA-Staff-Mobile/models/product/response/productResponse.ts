import { Product } from "../entity/product";

/**
 * Product list response
 */
export interface ProductListResponse {
	items: Product[];
	totalCount: number;
}

/**
 * Product detail response (with toppings)
 */
export interface ProductDetailResponse extends Product {
	availableToppings: {
		toppingId: string;
		toppingName: string;
		price: number;
		imageUrl: string;
		isDefault: boolean;
	}[];
}
