import toast, { type ToastOptions } from 'react-hot-toast';

/**
 * Toast helper class với các static methods để hiển thị toast notifications
 * Sử dụng react-hot-toast với cấu hình mặc định
 */
export class ToastHelper {
  /**
   * Hiển thị toast thành công
   * @param message - Nội dung thông báo
   * @param options - Tùy chọn cấu hình toast (optional)
   */
  static success(message: string, options?: ToastOptions): string {
    return toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#ffffff',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#ffffff',
        secondary: '#10b981',
      },
      ...options,
    });
  }

  /**
   * Hiển thị toast lỗi
   * @param message - Nội dung thông báo lỗi
   * @param options - Tùy chọn cấu hình toast (optional)
   */
  static error(message: string, options?: ToastOptions): string {
    return toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#ffffff',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#ffffff',
        secondary: '#ef4444',
      },
      ...options,
    });
  }

  /**
   * Hiển thị toast cảnh báo
   * @param message - Nội dung thông báo cảnh báo
   * @param options - Tùy chọn cấu hình toast (optional)
   */
  static warning(message: string, options?: ToastOptions): string {
    return toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: '#ffffff',
        fontWeight: '500',
      },
      ...options,
    });
  }

  /**
   * Hiển thị toast thông tin
   * @param message - Nội dung thông báo thông tin
   * @param options - Tùy chọn cấu hình toast (optional)
   */
  static info(message: string, options?: ToastOptions): string {
    return toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#ffffff',
        fontWeight: '500',
      },
      ...options,
    });
  }

  /**
   * Hiển thị toast loading
   * @param message - Nội dung thông báo loading
   * @param options - Tùy chọn cấu hình toast (optional)
   */
  static loading(message: string, options?: ToastOptions): string {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#6b7280',
        color: '#ffffff',
        fontWeight: '500',
      },
      ...options,
    });
  }

  /**
   * Dismiss toast theo ID
   * @param toastId - ID của toast cần dismiss
   */
  static dismiss(toastId: string): void {
    toast.dismiss(toastId);
  }

  /**
   * Dismiss tất cả toast
   */
  static dismissAll(): void {
    toast.dismiss();
  }
}

// Export các function riêng lẻ để dễ sử dụng
export const showSuccess = (message: string, options?: ToastOptions) =>
  ToastHelper.success(message, options);

export const showError = (message: string, options?: ToastOptions) =>
  ToastHelper.error(message, options);

export const showWarning = (message: string, options?: ToastOptions) =>
  ToastHelper.warning(message, options);

export const showInfo = (message: string, options?: ToastOptions) =>
  ToastHelper.info(message, options);

export const showLoading = (message: string, options?: ToastOptions) =>
  ToastHelper.loading(message, options);

export const dismissToast = (toastId: string) => ToastHelper.dismiss(toastId);

export const dismissAllToasts = () => ToastHelper.dismissAll();

// Alias for backward compatibility
export const showSuccessToast = showSuccess;
export const showErrorToast = showError;
