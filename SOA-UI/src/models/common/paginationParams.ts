export interface PaginationParams {
	page?: number;
	pageSize?: number;
	search?: string | null;
	sortBy?: string | null;
	sortOrder?: "asc" | "desc" | null;
}
