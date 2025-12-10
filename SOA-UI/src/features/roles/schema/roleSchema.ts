import { z } from 'zod';

export const createFormSchema = z.object({
  name: z.string().min(1, { message: 'Role name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
});

export const updateFormSchema = z.object({
  name: z.string().min(1, { message: 'Role name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
});

export type CreateRoleFormData = z.infer<typeof createFormSchema>;
export type UpdateRoleFormData = z.infer<typeof updateFormSchema>;
