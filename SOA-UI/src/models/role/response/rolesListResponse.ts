import type { Role } from '../entity/role';

export interface RolesListResponse {
  items: Role[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
