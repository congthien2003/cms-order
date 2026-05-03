import { api } from '@/lib/api';
import type { ApiResponse } from '@/models/common/api';
import type { PaginationParams } from '@/models/common/api';
import type { UserListResponse } from '@/models/user/response/userListResponse';
import type { UserDetailResponse } from '@/models/user/response/userDetailResponse';
import type { CreateUserRequest } from '@/models/user/request/createUserRequest';
import type { UpdateUserRequest } from '@/models/user/request/updateUserRequest';

const BASE_URL = '/api/v1/users';

const routes = {
  list: `${BASE_URL}/list`,
  byId: (id: string) => `${BASE_URL}/${id}`,
  create: BASE_URL,
  update: (id: string) => `${BASE_URL}/${id}`,
  delete: (id: string) => `${BASE_URL}/${id}`,
  activate: (id: string) => `${BASE_URL}/${id}/activate`,
  deactivate: (id: string) => `${BASE_URL}/${id}/deactivate`,
};

class UserService {
  async getUsers(
    params?: PaginationParams
  ): Promise<ApiResponse<UserListResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize)
      queryParams.append('pageSize', params.pageSize.toString());
    if (params?.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDescending !== undefined && params.sortDescending !== null)
      queryParams.append('sortDescending', params.sortDescending.toString());

    const url = `${routes.list}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.post<ApiResponse<UserListResponse>>(url, {
      page: params?.page,
      pageSize: params?.pageSize,
      searchTerm: params?.searchTerm,
      sortBy: params?.sortBy,
      sortDescending: params?.sortDescending,
    });
    return response.data;
  }

  async getUserById(id: string): Promise<ApiResponse<UserDetailResponse>> {
    const response = await api.get<ApiResponse<UserDetailResponse>>(routes.byId(id));
    return response.data;
  }

  async createUser(
    userData: CreateUserRequest
  ): Promise<ApiResponse<UserDetailResponse>> {
    const response = await api.post<ApiResponse<UserDetailResponse>>(
      routes.create,
      userData
    );
    return response.data;
  }

  async updateUser(
    id: string,
    userData: UpdateUserRequest
  ): Promise<ApiResponse<UserDetailResponse>> {
    const response = await api.put<ApiResponse<UserDetailResponse>>(
      routes.update(id),
      userData
    );
    return response.data;
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(routes.delete(id));
    return response.data;
  }

  async activateUser(id: string): Promise<ApiResponse<boolean>> {
    const response = await api.post<ApiResponse<boolean>>(routes.activate(id));
    return response.data;
  }

  async deactivateUser(id: string): Promise<ApiResponse<boolean>> {
    const response = await api.post<ApiResponse<boolean>>(routes.deactivate(id));
    return response.data;
  }
}

export default new UserService();
