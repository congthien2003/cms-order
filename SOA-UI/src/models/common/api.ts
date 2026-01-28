// Base API Response structure
export interface ApiResponse<T> {
  success: boolean;
  isSuccess?: boolean; // Backend uses isSuccess
  data: T;
  message?: string;
  errors?: string[];
}

// Helper to check success from either field
export const isApiSuccess = <T>(response: ApiResponse<T>): boolean => {
  return response.success === true || response.isSuccess === true;
};

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

// Alias for consistency with backend
export type PagedList<T> = PaginatedResponse<T>;

// Common error response
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}
