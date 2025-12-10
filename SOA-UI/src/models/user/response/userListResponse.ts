import type { PaginatedResponse } from '@/models/common/api';
import type { User } from '../entity/user';

export interface UserListResponse extends PaginatedResponse<User> {
  items: User[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
