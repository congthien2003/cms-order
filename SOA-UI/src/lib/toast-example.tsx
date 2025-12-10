import React from 'react';
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showLoading,
  dismissToast,
  dismissAllToasts,
} from './toast';

/**
 * Component ví dụ cách sử dụng Toast Helper
 * Bạn có thể xóa file này sau khi đã hiểu cách sử dụng
 */
export const ToastExample: React.FC = () => {
  const handleShowToasts = () => {
    showSuccess('Thao tác thành công!');
    showError('Có lỗi xảy ra!');
    showWarning('Cảnh báo!');
    showInfo('Thông tin mới!');
  };

  const handleShowLoading = () => {
    // Hiển thị loading toast
    const loadingId = showLoading('Đang xử lý...');

    // Giả lập async operation
    setTimeout(() => {
      // Dismiss loading toast
      dismissToast(loadingId);
      // Hiển thị success toast
      showSuccess('Hoàn thành!');
    }, 2000);
  };

  const handleCustomOptions = () => {
    showSuccess('Toast với tùy chọn tùy chỉnh', {
      duration: 6000,
      position: 'bottom-center',
      style: {
        background: '#059669',
        color: '#ffffff',
        fontSize: '16px',
      },
    });
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Toast Helper Examples</h2>

      <div className="space-y-2">
        <button
          onClick={handleShowToasts}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Hiển thị tất cả loại toast
        </button>

        <button
          onClick={handleShowLoading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-2"
        >
          Test Loading Toast
        </button>

        <button
          onClick={handleCustomOptions}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 ml-2"
        >
          Toast với tùy chọn tùy chỉnh
        </button>

        <button
          onClick={dismissAllToasts}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
        >
          Dismiss tất cả toast
        </button>
      </div>
    </div>
  );
};

export default ToastExample;
