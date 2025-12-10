// Base API Response structure
export interface ApiResponse<T> {
	isSuccess: boolean;
	data: T;
	message?: string;
	errors?: string[];
}

// Pagination
export interface PaginationParams {
	page?: number;
	pageSize?: number;
	searchTerm?: string | null;
	sortBy?: string | null;
	sortDescending?: boolean | null;
}

export interface PaginatedResponse<T> {
	items: T[];
		pageNumber: number;
		pageSize: number;
		totalCount: number;
		totalPages: number;
}

// Common error response
export interface ApiError {
	message: string;
	code?: string;
	details?: unknown;
}
