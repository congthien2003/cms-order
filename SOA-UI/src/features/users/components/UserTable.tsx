import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { LockOpen, UserPen } from 'lucide-react';
import type { User } from '@/models/user/entity/user';
import type { UserListResponse } from '@/models/user/response/userListResponse';
import type { PaginationParams } from '@/models/common/paginationParams';
import Pagination from '@/components/ui/pagination/Pagination';
import Icon from '@/components/icons';

const UserTable = ({
  users,
  handlePageChange,
  pagination,
  onEditUser,
  onActivateUser,
  onDeactivateUser,
}: {
  users: UserListResponse | null;
  handlePageChange: (page: number) => void;
  pagination: PaginationParams;
  onEditUser?: (userId: string) => void;
  onActivateUser?: (userId: string) => void;
  onDeactivateUser?: (userId: string) => void;
}) => {
  return (
    <div className="w-full min-w-[800px] flex flex-col gap-4 ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users &&
            users?.items.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell className="capitalize">
                  {user.roles.join(', ')}
                </TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      user.isActive
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditUser?.(user.id)}
                    >
                      <UserPen className="h-4 w-4" />
                      <span className="sr-only">Edit user</span>
                    </Button>
                    {user.isActive ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeactivateUser?.(user.id)}
                        className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                      >
                        <Icon.EditIcon
                          width="16px"
                          height="16px"
                          classStyle="h-4 w-4"
                        />
                        <span className="sr-only">Deactivate user</span>
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onActivateUser?.(user.id)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <LockOpen className="h-4 w-4" />
                        <span className="sr-only">Activate user</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Pagination
        totalPages={users?.totalPages || 1}
        currentPage={pagination.page || 1}
        onPageChange={handlePageChange}
        pageSize={pagination.pageSize || 10}
        totalCount={users?.totalCount || 0}
      />
    </div>
  );
};

export default UserTable;
