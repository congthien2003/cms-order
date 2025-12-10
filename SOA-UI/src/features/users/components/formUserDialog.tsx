import CustomDialog from '@/components/ui/dialog/CustomDialog';
import { useForm } from 'react-hook-form';
import { Form, FormDescription } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, InputPassword } from '@/components/ui/input';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import type { CreateUserRequest } from '@/models/user/request/createUserRequest';
import type { UpdateUserRequest } from '@/models/user/request/updateUserRequest';
import type { UserDetailResponse } from '@/models/user/response/userDetailResponse';
import userService from '@/services/userService';
import { toast } from 'react-hot-toast';
import { useCallback, useEffect, useState } from 'react';
import roleService from '@/services/roleService';
import type { Role } from '@/models/role/entity/role';
import { Checkbox } from '@/components/ui/checkbox';
import {
  updateFormSchema,
  createFormSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from '../schema/userSchema';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  isEdit?: boolean;
  userData?: UserDetailResponse | null;
};

function CreateUserForm({
  userData,
  callback,
  isEdit = false,
}: {
  userData?: UserDetailResponse | null;
  callback: () => void;
  isEdit?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const fetchRoles = useCallback(async () => {
    const response = await roleService.getRoles({
      page: 1,
      pageSize: 1000,
    });
    if (response.isSuccess) {
      setRoles(response.data?.items ?? []);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, []);

  const formSchema = isEdit ? updateFormSchema : createFormSchema;
  type FormData = CreateUserFormData | UpdateUserFormData;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: userData?.fullName ?? '',
      email: userData?.email ?? '',
      userName: userData?.userName ?? '',
      password: '',
      roleIds: userData?.roles.map((role) => role.id) ?? [],
    },
  });

  // Reset form when userData changes
  useEffect(() => {
    if (userData) {
      console.log(userData);
      console.log(roles);
      form.reset({
        fullName: userData.fullName ?? '',
        email: userData.email ?? '',
        userName: userData.userName ?? '',
        password: '',
        roleIds: userData.roles.map((role) => role.id),
      });
    }
  }, [userData, form]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      if (isEdit && userData?.id) {
        const updateRequest: UpdateUserRequest = {
          fullName: data.fullName,
          email: data.email,
          userName: data.userName,
          roleIds: data.roleIds,
        };

        // Only include password if it's provided
        if (data.password && data.password.trim()) {
          updateRequest.password = data.password;
        }

        const response = await userService.updateUser(
          userData.id,
          updateRequest
        );
        if (response.isSuccess) {
          toast.success('User updated successfully');
          form.reset();
          callback();
        } else {
          toast.error('Failed to update user');
        }
      } else {
        const createRequest: CreateUserRequest = {
          fullName: data.fullName,
          email: data.email,
          userName: data.userName,
          password: data.password!,
          roleIds: data.roleIds,
        };

        const response = await userService.createUser(createRequest);
        if (response.isSuccess) {
          toast.success('User created successfully');
          form.reset();
          callback();
        } else {
          toast.error('Failed to create user');
        }
      }
    } catch {
      toast.error(isEdit ? 'Failed to update user' : 'Failed to create user');
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
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter user name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password {isEdit && '(Leave blank to keep current)'}
                </FormLabel>
                <FormControl>
                  <InputPassword
                    placeholder={
                      isEdit
                        ? 'Enter new password (optional)'
                        : 'Enter password'
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roleIds"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Roles</FormLabel>
                  <FormDescription>
                    Select the roles you want to assign to the user.
                  </FormDescription>
                </div>
                {roles.map((item: Role) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="roleIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-center gap-2"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {item.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
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
                ? 'Update User'
                : 'Create User'}
          </Button>
        </form>
      </Form>
    </>
  );
}

function CreateUserDialog({
  open,
  onOpenChange,
  onSuccess,
  isEdit = false,
  userData,
}: Props) {
  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit User' : 'Create User'}
      children={
        <CreateUserForm
          userData={userData}
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

export default CreateUserDialog;
