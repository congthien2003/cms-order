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
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/models/pos';
import {
  createCategorySchema,
  type CreateCategoryFormData,
} from '../schema/categorySchema';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: CreateCategoryRequest | UpdateCategoryRequest
  ) => Promise<void>;
  isEdit?: boolean;
  categoryData?: Category | null;
};

function CategoryForm({
  categoryData,
  onSubmit,
  isEdit = false,
  onCancel,
}: {
  categoryData?: Category | null;
  onSubmit: (
    data: CreateCategoryRequest | UpdateCategoryRequest
  ) => Promise<void>;
  isEdit?: boolean;
  onCancel: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: categoryData?.name ?? '',
      description: categoryData?.description ?? '',
      sortOrder: categoryData?.sortOrder ?? 0,
    },
  });

  // Reset form when categoryData changes
  useEffect(() => {
    if (categoryData) {
      form.reset({
        name: categoryData.name ?? '',
        description: categoryData.description ?? '',
        sortOrder: categoryData.sortOrder ?? 0,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        sortOrder: 0,
      });
    }
  }, [categoryData, form]);

  const handleSubmit = async (data: CreateCategoryFormData) => {
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
              <FormLabel>Tên danh mục *</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên danh mục" {...field} />
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
                  placeholder="Nhập mô tả danh mục"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sortOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thứ tự hiển thị</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
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

export default function FormCategoryDialog({
  open,
  onOpenChange,
  onSubmit,
  isEdit = false,
  categoryData,
}: Props) {
  const handleSubmit = async (
    data: CreateCategoryRequest | UpdateCategoryRequest
  ) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
      description={
        isEdit
          ? 'Cập nhật thông tin danh mục'
          : 'Điền thông tin để tạo danh mục mới'
      }
    >
      <CategoryForm
        categoryData={categoryData}
        onSubmit={handleSubmit}
        isEdit={isEdit}
        onCancel={() => onOpenChange(false)}
      />
    </CustomDialog>
  );
}
