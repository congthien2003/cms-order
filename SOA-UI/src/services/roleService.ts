import { api } from '@/lib/api';
import type { ApiResponse } from '@/models/common/api';
import type { PaginationParams } from '@/models/common/paginationParams';
import type { Role } from '@/models/role/entity/role';
import type { CreateRoleRequest } from '@/models/role/request/createRoleRequest';
import type { UpdateRoleRequest } from '@/models/role/request/updateRoleRequest';
import type { RoleResponse } from '@/models/role/response/roleResponse';
import type { RolesListResponse } from '@/models/role/response/rolesListResponse';

class RoleService {
  apiRoute = {
    GET_ROLES: '/api/v1/roles/list',
    GET_ROLE_BY_ID: '/api/v1/roles/:id',
    CREATE_ROLE: '/api/v1/roles',
    UPDATE_ROLE: '/api/v1/roles/:id',
    DELETE_ROLE: '/api/v1/roles/:id',
    GET_PERMISSIONS: '/api/v1/roles/permissions',
    ASSIGN_ROLE: '/api/v1/roles/:roleId/assign',
    REMOVE_ROLE: '/api/v1/roles/:roleId/remove/:userId',
  };

  async getRoles(
    params?: PaginationParams
  ): Promise<ApiResponse<RolesListResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize)
      queryParams.append('pageSize', params.pageSize.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `${this.apiRoute.GET_ROLES}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.post<ApiResponse<RolesListResponse>>(url, {
      page: params?.page,
      pageSize: params?.pageSize,
      search: params?.search,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
    });
    return response.data;
  }

  async getRoleById(id: string): Promise<ApiResponse<Role>> {
    const response = await api.get<ApiResponse<Role>>(
      this.apiRoute.GET_ROLE_BY_ID.replace(':id', id)
    );
    return response.data;
  }

  async createRole(
    roleData: CreateRoleRequest
  ): Promise<ApiResponse<RoleResponse>> {
    const response = await api.post<ApiResponse<RoleResponse>>(
      this.apiRoute.CREATE_ROLE,
      roleData
    );
    return response.data;
  }

  async updateRole(
    id: string,
    roleData: UpdateRoleRequest
  ): Promise<ApiResponse<RoleResponse>> {
    const response = await api.put<ApiResponse<RoleResponse>>(
      this.apiRoute.UPDATE_ROLE.replace(':id', id),
      roleData
    );
    return response.data;
  }

  async deleteRole(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(
      this.apiRoute.DELETE_ROLE.replace(':id', id)
    );
    return response.data;
  }

  async getPermissions(): Promise<ApiResponse<{ permissions: string[] }>> {
    const response = await api.get<ApiResponse<{ permissions: string[] }>>(
      this.apiRoute.GET_PERMISSIONS
    );
    return response.data;
  }

  async assignRole(
    userId: string,
    roleId: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      this.apiRoute.ASSIGN_ROLE.replace(':roleId', roleId),
      { userId }
    );
    return response.data;
  }

  async removeRole(
    userId: string,
    roleId: string
  ): Promise<ApiResponse<{ message: string }>> {
    const url = this.apiRoute.REMOVE_ROLE.replace(':roleId', roleId).replace(
      ':userId',
      userId
    );
    const response = await api.delete<ApiResponse<{ message: string }>>(url);
    return response.data;
  }
}

export default new RoleService();
