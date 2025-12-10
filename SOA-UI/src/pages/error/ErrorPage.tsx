import { useRouteError } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from 'lucide-react';

interface RouteError {
  status?: number;
  statusText?: string;
  message?: string;
  data?: string;
}

function ErrorPage() {
  const error = useRouteError() as RouteError;

  const getErrorInfo = () => {
    if (error?.status === 404) {
      return {
        title: 'Trang không tìm thấy',
        description:
          'Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.',
        icon: '🔍',
        statusCode: 404,
      };
    }

    if (error?.status === 403) {
      return {
        title: 'Không có quyền truy cập',
        description:
          'Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên.',
        icon: '🔒',
        statusCode: 403,
      };
    }

    if (error?.status === 500) {
      return {
        title: 'Lỗi máy chủ',
        description:
          'Đã xảy ra lỗi từ phía máy chủ. Vui lòng thử lại sau hoặc liên hệ hỗ trợ kỹ thuật.',
        icon: '⚙️',
        statusCode: 500,
      };
    }

    return {
      title: 'Đã xảy ra lỗi',
      description:
        'Có vẻ như đã xảy ra lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ hỗ trợ.',
      icon: '⚠️',
      statusCode: error?.status || 'Unknown',
    };
  };

  const errorInfo = getErrorInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
            <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-6xl mb-2">{errorInfo.icon}</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {errorInfo.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {errorInfo.description}
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Mã lỗi:
            </span>
            <span className="text-sm font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
              {errorInfo.statusCode}
            </span>
          </div>
          {error?.message && (
            <div className="mt-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Chi tiết:
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-mono bg-slate-50 dark:bg-slate-700 p-2 rounded">
                {error.message}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <Button
              className="flex-1 w-full"
              onClick={() => (window.location.href = '/dashboard')}
            >
              <Home className="w-4 h-4 mr-2" />
              Về trang chủ
            </Button>
            <Button
              variant="outline"
              className="flex-1 w-full"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tải lại
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại trang trước
          </Button>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Vẫn gặp vấn đề?
          </p>
          <div className="flex justify-center gap-4 text-xs">
            <a
              href="mailto:support@store.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Liên hệ hỗ trợ
            </a>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <a
              href="/help"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Trung tâm trợ giúp
            </a>
          </div>
        </div>

        {/* Store Branding */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium">Store Management System</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
