import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar/Sidebar';
import { SidebarProvider } from './sidebar/SidebarProvider';

function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="lg:pl-72">
          <main className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default AdminLayout;
