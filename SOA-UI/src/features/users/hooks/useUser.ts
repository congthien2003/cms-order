import { useState, useCallback, useEffect } from 'react';
import userService from '@/services/userService';
import type { UserListResponse } from '@/models/user/response/userListResponse';
import type { UserDetailResponse } from '@/models/user/response/userDetailResponse';
import type { CreateUserRequest } from '@/models/user/request/createUserRequest';
import type { UpdateUserRequest } from '@/models/user/request/updateUserRequest';
import type { PaginationParams } from '@/models/common/api';
import type { ApiResponse } from '@/models/common/api';

export const useUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserListResponse | null>(null);
  const [editingUser, setEditingUser] = useState<UserDetailResponse | null>(
    null
  );
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });

  const fetchUsers = useCallback(async (params?: PaginationParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers(params);
      console.log(response.data);
      if (response?.isSuccess && response.data) {
        setUsers(response.data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      setPagination({ ...pagination, page });
      fetchUsers({
        page,
        pageSize: pagination.pageSize,
      });
    },
    [pagination.pageSize]
  );

  const getUserById = useCallback(
    async (id: string): Promise<ApiResponse<UserDetailResponse> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await userService.getUserById(id);
        console.log(response.data);
        if (response?.isSuccess && response.data) {
          setEditingUser(response.data);
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch user';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createUser = useCallback(
    async (
      userData: CreateUserRequest
    ): Promise<ApiResponse<UserDetailResponse> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await userService.createUser(userData);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create user';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateUser = useCallback(
    async (
      id: string,
      userData: UpdateUserRequest
    ): Promise<ApiResponse<UserDetailResponse> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await userService.updateUser(id, userData);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update user';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteUser = useCallback(
    async (id: string): Promise<ApiResponse<void> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await userService.deleteUser(id);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete user';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const activateUser = useCallback(
    async (id: string): Promise<ApiResponse<boolean> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await userService.activateUser(id);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to activate user';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deactivateUser = useCallback(
    async (id: string): Promise<ApiResponse<boolean> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await userService.deactivateUser(id);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to deactivate user';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearEditingUser = useCallback(() => {
    setEditingUser(null);
  }, []);

  return {
    loading,
    error,
    users,
    editingUser,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
    clearError,
    clearEditingUser,
    pagination,
    setPagination,
    handlePageChange,
  };
};
