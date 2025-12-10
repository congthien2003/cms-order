import Button from '@/components/ui/button/button';
import EmptyData from '@/components/ui/empty-data/empty-data';
import Page from '@/components/ui/page';
import RoleTable from '@/features/roles/components/RoleTable';
import CreateRoleDialog from '@/features/roles/components/formRoleDialog';
import ConfirmDialog from '@/components/ui/dialog/ConfirmDialog';
import { useRole } from '@/features/roles/hooks/useRole';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

function RolePage() {
  const [openCreateRoleDialog, setOpenCreateRoleDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete';
    roleId: string;
    roleName: string;
  } | null>(null);

  const {
    roles,
    fetchRoles,
    pagination,
    handlePageChange,
    getRoleById,
    editingRole,
    clearEditingRole,
    deleteRole,
  } = useRole();

  const handleCreateRole = () => {
    setIsEditMode(false);
    clearEditingRole();
    setOpenCreateRoleDialog(true);
  };

  const handleEditRole = async (roleId: string) => {
    setIsEditMode(true);
    const response = await getRoleById(roleId);
    if (response?.isSuccess) {
      console.log(response.data);
      setOpenCreateRoleDialog(true);
    }
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles?.items.find((r) => r.id === roleId);
    if (role) {
      setConfirmAction({
        type: 'delete',
        roleId,
        roleName: role.name,
      });
      setOpenConfirmDialog(true);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    try {
      const response = await deleteRole(confirmAction.roleId);
      if (response?.isSuccess) {
        toast.success(`Role "${confirmAction.roleName}" deleted successfully`);
        fetchRoles(pagination);
      } else {
        toast.error('Failed to delete role');
      }
    } catch {
      toast.error('Failed to delete role');
    }
  };

  const handleDialogClose = () => {
    setOpenCreateRoleDialog(false);
    setIsEditMode(false);
    clearEditingRole();
  };

  const handleConfirmDialogClose = () => {
    setOpenConfirmDialog(false);
    setConfirmAction(null);
  };

  const handleSuccess = () => {
    fetchRoles(pagination);
    handleDialogClose();
  };

  const getConfirmDialogProps = () => {
    if (!confirmAction) {
      return {
        title: '',
        message: '',
        confirmText: '',
        variant: 'default' as const,
      };
    }

    return {
      title: 'Delete Role',
      message: `Are you sure you want to delete role "${confirmAction.roleName}"? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'destructive' as const,
    };
  };

  return (
    <Page title="Roles Management">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-muted-foreground">
              Manage roles and permissions
            </p>
          </div>
          <Button
            label="Create Role"
            onClick={handleCreateRole}
            variant="outline"
          />
          <CreateRoleDialog
            open={openCreateRoleDialog}
            onOpenChange={handleDialogClose}
            onSuccess={handleSuccess}
            isEdit={isEditMode}
            roleData={editingRole}
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
        {roles ? (
          <RoleTable
            roles={roles}
            handlePageChange={handlePageChange}
            pagination={pagination}
            onEditRole={handleEditRole}
            onDeleteRole={handleDeleteRole}
          />
        ) : (
          <EmptyData />
        )}
      </div>
    </Page>
  );
}

export default RolePage;
