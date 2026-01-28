import { z } from 'zod';

export const createVoucherSchema = z.object({
  code: z.string().min(1, { message: 'Mã voucher không được để trống' }),
  description: z.string().optional(),
  discountType: z.enum(['Percentage', 'FixedAmount'], {
    message: 'Vui lòng chọn loại giảm giá',
  }),
  discountValue: z.number().min(1, { message: 'Giá trị giảm phải lớn hơn 0' }),
  minimumOrderAmount: z.number().min(0).optional(),
  maximumDiscount: z.number().min(0).optional(),
  usageLimit: z.number().min(1).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const updateVoucherSchema = z.object({
  code: z.string().min(1, { message: 'Mã voucher không được để trống' }),
  description: z.string().optional(),
  discountType: z.enum(['Percentage', 'FixedAmount'], {
    message: 'Vui lòng chọn loại giảm giá',
  }),
  discountValue: z.number().min(1, { message: 'Giá trị giảm phải lớn hơn 0' }),
  minimumOrderAmount: z.number().min(0).optional(),
  maximumDiscount: z.number().min(0).optional(),
  usageLimit: z.number().min(1).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type CreateVoucherFormData = z.infer<typeof createVoucherSchema>;
export type UpdateVoucherFormData = z.infer<typeof updateVoucherSchema>;
