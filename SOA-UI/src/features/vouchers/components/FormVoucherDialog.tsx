import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomDialog from '@/components/ui/dialog/CustomDialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type {
  Voucher,
  CreateVoucherRequest,
  UpdateVoucherRequest,
} from '@/models/pos';
import {
  createVoucherSchema,
  updateVoucherSchema,
  type CreateVoucherFormData,
  type UpdateVoucherFormData,
} from '../schema/voucherSchema';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: CreateVoucherRequest | UpdateVoucherRequest
  ) => Promise<void>;
  isEdit?: boolean;
  voucherData?: Voucher | null;
  generateCode: () => string;
};

function VoucherForm({
  voucherData,
  onSubmit,
  isEdit = false,
  onCancel,
  generateCode,
}: {
  voucherData?: Voucher | null;
  onSubmit: (
    data: CreateVoucherRequest | UpdateVoucherRequest
  ) => Promise<void>;
  isEdit?: boolean;
  onCancel: () => void;
  generateCode: () => string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = isEdit ? updateVoucherSchema : createVoucherSchema;
  type FormData = CreateVoucherFormData | UpdateVoucherFormData;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: voucherData?.code ?? '',
      description: voucherData?.description ?? '',
      discountType: voucherData?.discountType ?? 'Percentage',
      discountValue: voucherData?.discountValue ?? 0,
      minimumOrderAmount:
        voucherData?.minimumOrderAmount ?? voucherData?.minOrderAmount ?? 0,
      maximumDiscount:
        voucherData?.maximumDiscount ??
        voucherData?.maxDiscountAmount ??
        undefined,
      usageLimit: voucherData?.usageLimit ?? undefined,
      startDate: voucherData?.startDate
        ? new Date(voucherData.startDate).toISOString().slice(0, 16)
        : '',
      endDate: voucherData?.endDate
        ? new Date(voucherData.endDate).toISOString().slice(0, 16)
        : '',
    },
  });

  // Reset form when voucherData changes
  useEffect(() => {
    if (voucherData) {
      form.reset({
        code: voucherData.code ?? '',
        description: voucherData.description ?? '',
        discountType: voucherData.discountType ?? 'Percentage',
        discountValue: voucherData.discountValue ?? 0,
        minimumOrderAmount:
          voucherData.minimumOrderAmount ?? voucherData.minOrderAmount ?? 0,
        maximumDiscount:
          voucherData.maximumDiscount ??
          voucherData.maxDiscountAmount ??
          undefined,
        usageLimit: voucherData.usageLimit ?? undefined,
        startDate: voucherData.startDate
          ? new Date(voucherData.startDate).toISOString().slice(0, 16)
          : '',
        endDate: voucherData.endDate
          ? new Date(voucherData.endDate).toISOString().slice(0, 16)
          : '',
      });
    } else {
      form.reset({
        code: '',
        description: '',
        discountType: 'Percentage',
        discountValue: 0,
        minimumOrderAmount: 0,
        maximumDiscount: undefined,
        usageLimit: undefined,
        startDate: '',
        endDate: '',
      });
    }
  }, [voucherData, form]);

  const handleGenerateCode = () => {
    const code = generateCode();
    form.setValue('code', code);
  };

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await onSubmit({
        ...data,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
      });
      form.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 max-h-96 overflow-y-auto pr-2"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã voucher *</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="VD: SALE2024"
                    className="uppercase"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateCode}
                >
                  Tạo mã
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="discountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại giảm giá</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Percentage">Phần trăm (%)</SelectItem>
                    <SelectItem value="FixedAmount">Số tiền cố định</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá trị giảm *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="minimumOrderAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đơn tối thiểu</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maximumDiscount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giảm tối đa</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Không giới hạn"
                    value={field.value || ''}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="usageLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới hạn sử dụng</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Không giới hạn"
                  value={field.value || ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày bắt đầu</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày kết thúc</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="Mô tả voucher" rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function FormVoucherDialog({
  open,
  onOpenChange,
  onSubmit,
  isEdit = false,
  voucherData,
  generateCode,
}: Props) {
  const handleSubmit = async (
    data: CreateVoucherRequest | UpdateVoucherRequest
  ) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Chỉnh sửa voucher' : 'Thêm voucher mới'}
      description={
        isEdit
          ? 'Cập nhật thông tin voucher'
          : 'Điền thông tin để tạo voucher mới'
      }
    >
      <VoucherForm
        voucherData={voucherData}
        onSubmit={handleSubmit}
        isEdit={isEdit}
        onCancel={() => onOpenChange(false)}
        generateCode={generateCode}
      />
    </CustomDialog>
  );
}
