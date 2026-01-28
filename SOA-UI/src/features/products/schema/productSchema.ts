import { z } from 'zod';

export const createProductSchema = z.object({
  categoryId: z.string().min(1, { message: 'Vui lòng chọn danh mục' }),
  name: z.string().min(1, { message: 'Tên sản phẩm không được để trống' }),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  basePrice: z.number().min(0, { message: 'Giá phải là số không âm' }),
  sortOrder: z.number().min(0).default(0),
});

export const updateProductSchema = z.object({
  categoryId: z.string().min(1, { message: 'Vui lòng chọn danh mục' }),
  name: z.string().min(1, { message: 'Tên sản phẩm không được để trống' }),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  basePrice: z.number().min(0, { message: 'Giá phải là số không âm' }),
  sortOrder: z.number().min(0).default(0),
  isActive: z.boolean().optional(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
