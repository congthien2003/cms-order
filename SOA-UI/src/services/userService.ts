import type { ApiResponse } from '@/models/common/api';
import type { PaginationParams } from '@/models/common/api';
import type { UserListResponse } from '@/models/user/response/userListResponse';
import type { UserDetailResponse } from '@/models/user/response/userDetailResponse';
import type { CreateUserRequest } from '@/models/user/request/createUserRequest';
import type { UpdateUserRequest } from '@/models/user/request/updateUserRequest';
import { api } from '@/lib/api';

class UserService {
  apiRoute = {
    GET_USERS: '/api/v1/users/list',
    GET_USER_BY_ID: '/api/v1/users/:id',
    CREATE_USER: '/api/v1/users',
    UPDATE_USER: '/api/v1/users/:id',
    DELETE_USER: '/api/v1/users/:id',
    ACTIVATE_USER: '/api/v1/users/:id/activate',
    DEACTIVATE_USER: '/api/v1/users/:id/deactivate',
  };

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

    const url = `${this.apiRoute.GET_USERS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
    const response = await api.get<ApiResponse<UserDetailResponse>>(
      this.apiRoute.GET_USER_BY_ID.replace(':id', id)
    );
    return response.data;
  }

  async createUser(
    userData: CreateUserRequest
  ): Promise<ApiResponse<UserDetailResponse>> {
    const response = await api.post<ApiResponse<UserDetailResponse>>(
      this.apiRoute.CREATE_USER,
      userData
    );
    return response.data;
  }

  async updateUser(
    id: string,
    userData: UpdateUserRequest
  ): Promise<ApiResponse<UserDetailResponse>> {
    const response = await api.put<ApiResponse<UserDetailResponse>>(
      this.apiRoute.UPDATE_USER.replace(':id', id),
      userData
    );
    return response.data;
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(
      this.apiRoute.DELETE_USER.replace(':id', id)
    );
    return response.data;
  }

  async activateUser(id: string): Promise<ApiResponse<boolean>> {
    const response = await api.post<ApiResponse<boolean>>(
      this.apiRoute.ACTIVATE_USER.replace(':id', id)
    );
    return response.data;
  }

  async deactivateUser(id: string): Promise<ApiResponse<boolean>> {
    const response = await api.post<ApiResponse<boolean>>(
      this.apiRoute.DEACTIVATE_USER.replace(':id', id)
    );
    return response.data;
  }
}

export default new UserService();
