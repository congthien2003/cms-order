import { Clock, CheckCircle, XCircle, ChefHat, Package } from 'lucide-react';
import type { OrderStatus, PaymentStatus } from '@/models/pos';

export const ORDER_STATUSES: {
  value: OrderStatus;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    value: 'Pending',
    label: 'Chờ xử lý',
    icon: Clock,
    color: 'text-orange-500',
  },
  {
    value: 'Preparing',
    label: 'Đang pha chế',
    icon: ChefHat,
    color: 'text-blue-500',
  },
  { value: 'Ready', label: 'Sẵn sàng', icon: Package, color: 'text-green-500' },
  {
    value: 'Completed',
    label: 'Hoàn thành',
    icon: CheckCircle,
    color: 'text-green-600',
  },
  { value: 'Cancelled', label: 'Đã hủy', icon: XCircle, color: 'text-red-500' },
];

export const PAYMENT_STATUSES: {
  value: PaymentStatus;
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
}[] = [
  { value: 'Unpaid', label: 'Chưa thanh toán', variant: 'destructive' },
  { value: 'Paid', label: 'Đã thanh toán', variant: 'default' },
  { value: 'Refunded', label: 'Đã hoàn tiền', variant: 'secondary' },
];

export const getStatusConfig = (status: OrderStatus) => {
  return ORDER_STATUSES.find((s) => s.value === status) || ORDER_STATUSES[0];
};

export const getPaymentConfig = (status: PaymentStatus) => {
  return (
    PAYMENT_STATUSES.find((s) => s.value === status) || PAYMENT_STATUSES[0]
  );
};
