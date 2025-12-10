import CustomDialog from '@/components/ui/dialog/CustomDialog';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import type { CreateRoleRequest } from '@/models/role/request/createRoleRequest';
import type { UpdateRoleRequest } from '@/models/role/request/updateRoleRequest';
import type { Role } from '@/models/role/entity/role';
import roleService from '@/services/roleService';
import { useEffect, useState } from 'react';
import {
  updateFormSchema,
  createFormSchema,
  type CreateRoleFormData,
  type UpdateRoleFormData,
} from '../schema/roleSchema';
import { ToastHelper } from '@/lib/toast';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  isEdit?: boolean;
  roleData?: Role | null;
};

function CreateRoleForm({
  roleData,
  callback,
  isEdit = false,
}: {
  roleData?: Role | null;
  callback: () => void;
  isEdit?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = isEdit ? updateFormSchema : createFormSchema;
  type FormData = CreateRoleFormData | UpdateRoleFormData;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: roleData?.name ?? '',
      description: roleData?.description ?? '',
      status: roleData?.status ?? 'Active',
    },
  });

  // Reset form when roleData changes
  useEffect(() => {
    if (roleData) {
      console.log(roleData);
      form.reset({
        name: roleData.name ?? '',
        description: roleData.description ?? '',
        status: roleData.status ?? 'Active',
      });
    }
  }, [roleData, form]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      if (isEdit && roleData?.id) {
        const updateRequest: UpdateRoleRequest = {
          id: roleData.id,
          name: data.name,
          description: data.description,
          status: data.status,
        };

        const response = await roleService.updateRole(
          roleData.id,
          updateRequest
        );
        if (response.isSuccess) {
          ToastHelper.success('Role updated successfully');
          form.reset();
          callback();
        } else {
          ToastHelper.error('Failed to update role');
        }
      } else {
        const createRequest: CreateRoleRequest = {
          name: data.name,
          description: data.description,
        };

        const response = await roleService.createRole(createRequest);
        if (response.isSuccess) {
          ToastHelper.success('Role created successfully');
          form.reset();
          callback();
        } else {
          ToastHelper.error('Failed to create role');
        }
      }
    } catch {
      ToastHelper.error(
        isEdit ? 'Failed to update role' : 'Failed to create role'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter role name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter role description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading
              ? isEdit
                ? 'Updating...'
                : 'Creating...'
              : isEdit
                ? 'Update Role'
                : 'Create Role'}
          </Button>
        </form>
      </Form>
    </>
  );
}

function CreateRoleDialog({
  open,
  onOpenChange,
  onSuccess,
  isEdit = false,
  roleData,
}: Props) {
  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit Role' : 'Create Role'}
      children={
        <CreateRoleForm
          roleData={roleData}
          callback={() => {
            onSuccess();
            onOpenChange(false);
          }}
          isEdit={isEdit}
        />
      }
      isClose={false}
    />
  );
}

export default CreateRoleDialog;
