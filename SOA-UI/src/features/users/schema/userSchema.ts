import { z } from 'zod';

export const createFormSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  userName: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
  roleIds: z
    .array(z.string())
    .min(1, { message: 'At least one role is required' }),
});

export const updateFormSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  userName: z.string().min(1, { message: 'Username is required' }),
  password: z.string().optional(),
  roleIds: z
    .array(z.string())
    .min(1, { message: 'At least one role is required' }),
});

export type CreateUserFormData = z.infer<typeof createFormSchema>;
export type UpdateUserFormData = z.infer<typeof updateFormSchema>;
