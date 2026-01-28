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
import { Loader2 } from 'lucide-react';
import type {
  Topping,
  CreateToppingRequest,
  UpdateToppingRequest,
} from '@/models/pos';
import {
  createToppingSchema,
  updateToppingSchema,
  type CreateToppingFormData,
  type UpdateToppingFormData,
} from '../schema/toppingSchema';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: CreateToppingRequest | UpdateToppingRequest
  ) => Promise<void>;
  isEdit?: boolean;
  toppingData?: Topping | null;
};

function ToppingForm({
  toppingData,
  onSubmit,
  isEdit = false,
  onCancel,
}: {
  toppingData?: Topping | null;
  onSubmit: (
    data: CreateToppingRequest | UpdateToppingRequest
  ) => Promise<void>;
  isEdit?: boolean;
  onCancel: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = isEdit ? updateToppingSchema : createToppingSchema;
  type FormData = CreateToppingFormData | UpdateToppingFormData;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: toppingData?.name ?? '',
      price: toppingData?.price ?? 0,
      description: toppingData?.description ?? '',
    },
  });

  // Reset form when toppingData changes
  useEffect(() => {
    if (toppingData) {
      form.reset({
        name: toppingData.name ?? '',
        price: toppingData.price ?? 0,
        description: toppingData.description ?? '',
      });
    } else {
      form.reset({
        name: '',
        price: 0,
        description: '',
      });
    }
  }, [toppingData, form]);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      form.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên topping *</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên topping" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập mô tả topping"
                  rows={3}
                  {...field}
                />
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

export default function FormToppingDialog({
  open,
  onOpenChange,
  onSubmit,
  isEdit = false,
  toppingData,
}: Props) {
  const handleSubmit = async (
    data: CreateToppingRequest | UpdateToppingRequest
  ) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Chỉnh sửa topping' : 'Thêm topping mới'}
      description={
        isEdit
          ? 'Cập nhật thông tin topping'
          : 'Điền thông tin để tạo topping mới'
      }
    >
      <ToppingForm
        toppingData={toppingData}
        onSubmit={handleSubmit}
        isEdit={isEdit}
        onCancel={() => onOpenChange(false)}
      />
    </CustomDialog>
  );
}
