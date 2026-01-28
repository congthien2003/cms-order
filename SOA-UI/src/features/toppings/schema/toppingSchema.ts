import { z } from 'zod';

export const createToppingSchema = z.object({
  name: z.string().min(1, { message: 'Tên topping không được để trống' }),
  price: z.number().min(0, { message: 'Giá phải là số không âm' }),
  description: z.string().optional(),
});

export const updateToppingSchema = z.object({
  name: z.string().min(1, { message: 'Tên topping không được để trống' }),
  price: z.number().min(0, { message: 'Giá phải là số không âm' }),
  description: z.string().optional(),
});

export type CreateToppingFormData = z.infer<typeof createToppingSchema>;
export type UpdateToppingFormData = z.infer<typeof updateToppingSchema>;
