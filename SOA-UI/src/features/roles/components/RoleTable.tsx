import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { Role } from '@/models/role/entity/role';
import type { RolesListResponse } from '@/models/role/response/rolesListResponse';
import Pagination from '@/components/ui/pagination/Pagination';
import type { PaginationParams } from '@/models/common/paginationParams';

const RoleTable = ({
  roles,
  handlePageChange,
  pagination,
  onEditRole,
  onDeleteRole,
}: {
  roles: RolesListResponse | null;
  handlePageChange: (page: number) => void;
  pagination: PaginationParams;
  onEditRole?: (roleId: string) => void;
  onDeleteRole?: (roleId: string) => void;
}) => {
  return (
    <div className="w-full min-w-[800px] flex flex-col gap-4 ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles &&
            roles?.items.map((role: Role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      role.status === 'Active'
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
                    }`}
                  >
                    {role.status}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditRole?.(role.id)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit role</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteRole?.(role.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete role</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Pagination
        totalPages={roles?.totalPages || 1}
        currentPage={pagination.page || 1}
        onPageChange={handlePageChange}
        pageSize={pagination.pageSize || 10}
        totalCount={roles?.totalCount || 0}
      />
    </div>
  );
};

export default RoleTable;
