import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BarChart3, Coffee, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/providers/authProvider/useAuth';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from =
    (location.state as { from?: Location })?.from?.pathname || '/dashboard';

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      showSuccessToast('Đăng nhập thành công!');
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Đăng nhập thất bại. Vui lòng thử lại.';
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white p-4 md:p-8">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-2">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1 text-sm font-medium text-amber-700">
            <Coffee className="h-4 w-4" />
            CMS Order SaaS
          </div>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            Nền tảng quản lý bán hàng hiện đại cho chuỗi cà phê
          </h1>
          <p className="max-w-xl text-base text-slate-600 md:text-lg">
            Tối ưu vận hành với quản lý đơn hàng, sản phẩm, voucher và báo cáo thời gian thực trên một giao diện trực quan.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <BarChart3 className="mb-2 h-5 w-5 text-amber-600" />
              <p className="font-semibold text-slate-800">Dashboard trực quan</p>
              <p className="text-sm text-slate-500">Theo dõi hiệu suất kinh doanh theo thời gian thực.</p>
            </div>
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <ShieldCheck className="mb-2 h-5 w-5 text-amber-600" />
              <p className="font-semibold text-slate-800">Bảo mật theo vai trò</p>
              <p className="text-sm text-slate-500">Phân quyền rõ ràng cho từng nhân sự và cửa hàng.</p>
            </div>
          </div>
        </section>
        <Card className="w-full max-w-md justify-self-center">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <Coffee className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                Coffee Shop POS
              </CardTitle>
              <CardDescription>Đăng nhập để quản lý cửa hàng</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="admin@coffeeshop.com"
                          autoComplete="email"
                          disabled={isLoading}
                          {...field}
                        />
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
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            disabled={isLoading}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    'Đăng nhập'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
