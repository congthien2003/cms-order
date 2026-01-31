import { useState, useEffect, useCallback } from "react";
import { Category } from "@/models/category";
import categoryService from "@/services/categoryService";

interface UseCategoriesReturn {
	categories: Category[];
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

export const useCategories = (): UseCategoriesReturn => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchCategories = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await categoryService.getActiveCategories();
			if (response.isSuccess && response.data) {
				setCategories(response.data.items);
			} else {
				setError(response.message || "Failed to fetch categories");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	return {
		categories,
		isLoading,
		error,
		refetch: fetchCategories,
	};
};

export default useCategories;
