import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { LoginPage } from '@/pages/auth';
import { ProtectedRoute } from '@/components/auth';
import {
  DashboardPage,
  CategoriesPage,
  ProductsPage,
  ProductDetailPage,
  ToppingsPage,
  VouchersPage,
  OrdersPage,
  OrderDetailPage,
  SettingsPage,
  ErrorLogsPage,
} from '@/pages/pos';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'toppings', element: <ToppingsPage /> },
      { path: 'vouchers', element: <VouchersPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'error-logs', element: <ErrorLogsPage /> },
    ],
  },
]);

export default router;
