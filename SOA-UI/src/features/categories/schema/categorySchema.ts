import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, { message: 'Tên danh mục không được để trống' }),
  description: z.string().optional(),
  sortOrder: z.number().min(0, { message: 'Thứ tự phải là số không âm' }),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, { message: 'Tên danh mục không được để trống' }),
  description: z.string().optional(),
  sortOrder: z.number().min(0, { message: 'Thứ tự phải là số không âm' }),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
