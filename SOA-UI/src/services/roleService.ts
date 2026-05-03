import { api } from '@/lib/api';
import type { ApiResponse } from '@/models/common/api';
import type { PaginationParams } from '@/models/common/paginationParams';
import type { Role } from '@/models/role/entity/role';
import type { CreateRoleRequest } from '@/models/role/request/createRoleRequest';
import type { UpdateRoleRequest } from '@/models/role/request/updateRoleRequest';
import type { RoleResponse } from '@/models/role/response/roleResponse';
import type { RolesListResponse } from '@/models/role/response/rolesListResponse';

const BASE_URL = '/api/v1/roles';

const routes = {
  list: `${BASE_URL}/list`,
  byId: (id: string) => `${BASE_URL}/${id}`,
  create: BASE_URL,
  update: (id: string) => `${BASE_URL}/${id}`,
  delete: (id: string) => `${BASE_URL}/${id}`,
  permissions: `${BASE_URL}/permissions`,
  assign: (roleId: string) => `${BASE_URL}/${roleId}/assign`,
  remove: (roleId: string, userId: string) => `${BASE_URL}/${roleId}/remove/${userId}`,
};

class RoleService {
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

    const url = `${routes.list}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
    const response = await api.get<ApiResponse<Role>>(routes.byId(id));
    return response.data;
  }

  async createRole(
    roleData: CreateRoleRequest
  ): Promise<ApiResponse<RoleResponse>> {
    const response = await api.post<ApiResponse<RoleResponse>>(
      routes.create,
      roleData
    );
    return response.data;
  }

  async updateRole(
    id: string,
    roleData: UpdateRoleRequest
  ): Promise<ApiResponse<RoleResponse>> {
    const response = await api.put<ApiResponse<RoleResponse>>(routes.update(id), roleData);
    return response.data;
  }

  async deleteRole(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(routes.delete(id));
    return response.data;
  }

  async getPermissions(): Promise<ApiResponse<{ permissions: string[] }>> {
    const response = await api.get<ApiResponse<{ permissions: string[] }>>(routes.permissions);
    return response.data;
  }

  async assignRole(
    userId: string,
    roleId: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post<ApiResponse<{ message: string }>>(routes.assign(roleId), {
      userId,
    });
    return response.data;
  }

  async removeRole(
    userId: string,
    roleId: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete<ApiResponse<{ message: string }>>(routes.remove(roleId, userId));
    return response.data;
  }
}

export default new RoleService();
