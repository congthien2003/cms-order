import { useState, useCallback, useEffect } from 'react';
import roleService from '@/services/roleService';
import type { RolesListResponse } from '@/models/role/response/rolesListResponse';
import type { Role } from '@/models/role/entity/role';
import type { CreateRoleRequest } from '@/models/role/request/createRoleRequest';
import type { UpdateRoleRequest } from '@/models/role/request/updateRoleRequest';
import type { PaginationParams } from '@/models/common/api';
import type { ApiResponse } from '@/models/common/api';

export const useRole = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<RolesListResponse | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });

  const fetchRoles = useCallback(async (params?: PaginationParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await roleService.getRoles(params);
      console.log(response.data);
      if (response?.isSuccess && response.data) {
        setRoles(response.data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch roles';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      setPagination({ ...pagination, page });
      fetchRoles({
        page,
        pageSize: pagination.pageSize,
      });
    },
    [pagination.pageSize]
  );

  const getRoleById = useCallback(
    async (id: string): Promise<ApiResponse<Role> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await roleService.getRoleById(id);
        console.log(response.data);
        if (response?.isSuccess && response.data) {
          setEditingRole(response.data);
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch role';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createRole = useCallback(
    async (roleData: CreateRoleRequest): Promise<ApiResponse<any> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await roleService.createRole(roleData);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create role';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateRole = useCallback(
    async (
      id: string,
      roleData: UpdateRoleRequest
    ): Promise<ApiResponse<any> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await roleService.updateRole(id, roleData);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update role';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteRole = useCallback(
    async (id: string): Promise<ApiResponse<void> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await roleService.deleteRole(id);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete role';
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

  const clearEditingRole = useCallback(() => {
    setEditingRole(null);
  }, []);

  return {
    loading,
    error,
    roles,
    editingRole,
    fetchRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    clearError,
    clearEditingRole,
    pagination,
    setPagination,
    handlePageChange,
  };
};
