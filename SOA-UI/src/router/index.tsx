import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '@/pages/error/ErrorPage';
import AdminLayout from '@/components/layout/AdminLayout';
import UserPage from '@/pages/users';
import DemoPage from '@/pages/demo';
import RolePage from '@/pages/roles';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    // errorElement: <ErrorPage />,
    children: [
      { path: 'dashboard', element: <div>Dashboard</div> },
      { path: 'users', element: <UserPage /> },
      { path: 'roles', element: <RolePage /> },
      { path: 'settings', element: <div>Settings</div> },
      { path: 'demo', element: <DemoPage /> },
    ],
  },
]);

export default router;
