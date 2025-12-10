import Button from '@/components/ui/button/button';
import EmptyData from '@/components/ui/empty-data/empty-data';
import Page from '@/components/ui/page';
import UserTable from '@/features/users/components/UserTable';
import CreateUserDialog from '@/features/users/components/formUserDialog';
import ConfirmDialog from '@/components/ui/dialog/ConfirmDialog';
import { useUser } from '@/features/users/hooks/useUser';
import { useCallback, useState } from 'react';
import { ToastHelper } from '@/lib/toast';

function UserPage() {
  const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'activate' | 'deactivate';
    userId: string;
    userName: string;
  } | null>(null);

  const {
    users,
    fetchUsers,
    pagination,
    handlePageChange,
    getUserById,
    editingUser,
    clearEditingUser,
    activateUser,
    deactivateUser,
  } = useUser();

  const handleCreateUser = useCallback(() => {
    setIsEditMode(false);
    clearEditingUser();
    setOpenCreateUserDialog(true);
  }, []);

  const handleEditUser = useCallback(async (userId: string) => {
    setIsEditMode(true);
    const response = await getUserById(userId);
    if (response?.isSuccess) {
      console.log(response.data);
      setOpenCreateUserDialog(true);
    }
  }, []);

  const handleActivateUser = useCallback((userId: string) => {
    const user = users?.items.find((u) => u.id === userId);
    if (user) {
      setConfirmAction({
        type: 'activate',
        userId,
        userName: user.fullName,
      });
      setOpenConfirmDialog(true);
    }
  }, []);

  const handleDeactivateUser = useCallback((userId: string) => {
    const user = users?.items.find((u) => u.id === userId);
    if (user) {
      setConfirmAction({
        type: 'deactivate',
        userId,
        userName: user.fullName,
      });
      setOpenConfirmDialog(true);
    }
  }, []);

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    try {
      let response;
      if (confirmAction.type === 'activate') {
        response = await activateUser(confirmAction.userId);
        if (response?.isSuccess) {
          ToastHelper.success(
            `User ${confirmAction.userName} activated successfully`
          );
        } else {
          ToastHelper.error('Failed to activate user');
        }
      } else {
        response = await deactivateUser(confirmAction.userId);
        if (response?.isSuccess) {
          ToastHelper.success(
            `User ${confirmAction.userName} deactivated successfully`
          );
        } else {
          ToastHelper.error('Failed to deactivate user');
        }
      }

      if (response?.isSuccess) {
        fetchUsers(pagination);
      }
    } catch {
      ToastHelper.error(`Failed to ${confirmAction.type} user`);
    }
  };

  const handleDialogClose = useCallback(() => {
    setOpenCreateUserDialog(false);
    setIsEditMode(false);
    clearEditingUser();
  }, []);

  const handleConfirmDialogClose = useCallback(() => {
    setOpenConfirmDialog(false);
    setConfirmAction(null);
  }, []);

  const handleSuccess = useCallback(() => {
    fetchUsers(pagination);
    handleDialogClose();
  }, []);

  const getConfirmDialogProps = useCallback(() => {
    if (!confirmAction) {
      return {
        title: '',
        message: '',
        confirmText: '',
        variant: 'default' as const,
      };
    }

    if (confirmAction.type === 'activate') {
      return {
        title: 'Activate User',
        message: `Are you sure you want to activate user "${confirmAction.userName}"?`,
        confirmText: 'Activate',
        variant: 'default' as const,
      };
    } else {
      return {
        title: 'Deactivate User',
        message: `Are you sure you want to deactivate user "${confirmAction.userName}"? This will prevent the user from accessing the system.`,
        confirmText: 'Deactivate',
        variant: 'destructive' as const,
      };
    }
  }, [confirmAction]);

  return (
    <Page title="Users Management">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-muted-foreground">
              Manage user accounts and wallets
            </p>
          </div>
          <Button
            label="Create User"
            onClick={handleCreateUser}
            variant="outline"
          />
          <CreateUserDialog
            open={openCreateUserDialog}
            onOpenChange={handleDialogClose}
            onSuccess={handleSuccess}
            isEdit={isEditMode}
            userData={editingUser}
          />
          {confirmAction && (
            <ConfirmDialog
              open={openConfirmDialog}
              onOpenChange={handleConfirmDialogClose}
              onConfirm={handleConfirmAction}
              {...getConfirmDialogProps()}
            />
          )}
        </div>
        {users ? (
          <UserTable
            users={users}
            handlePageChange={handlePageChange}
            pagination={pagination}
            onEditUser={handleEditUser}
            onActivateUser={handleActivateUser}
            onDeactivateUser={handleDeactivateUser}
          />
        ) : (
          <EmptyData />
        )}
      </div>
    </Page>
  );
}

export default UserPage;
