import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Settings,
  Menu,
  HelpCircle,
  LogOut,
  Coffee,
  ShoppingCart,
  Package,
  FolderTree,
  Cherry,
  Ticket,
  ShieldAlert,
  type LucideProps,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from './useSidebar';
import { Button } from '@/components/ui/button';
import { RoleKeys } from '@/constants/roles';
import { TokenService } from '@/utils/tokenService';
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/authProvider/useAuth';

export function Sidebar() {
  const { isOpen, toggle } = useSidebar();
  const location = useLocation();
  const pathname = location.pathname;
  const isSuperAdmin =
    new URLSearchParams(location.search).get('isSuperAdmin') === 'true';
  const navigate = useNavigate();
  const { logout } = useAuth();
  const currentRoles = new TokenService().getCurrentRoles();

  const [filteredNavItems, setFilteredNavItems] = useState<NavItem[]>([]);
  useEffect(() => {
    setFilteredNavItems(
      navItems.filter((item) => {
        const hasRole = item.roles?.some((role) => currentRoles.includes(role));
        const allowBySuperAdminFlag = !item.superAdminOnly || isSuperAdmin;
        return hasRole && allowBySuperAdminFlag;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoles, isSuperAdmin]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden',
          isOpen ? 'block' : 'hidden'
        )}
        onClick={toggle}
      />
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-background',
          'transition-transform duration-300 ease-in-out',
          'border-r',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <div className="flex items-center gap-2">
            <Coffee className="h-6 w-6 text-amber-600" />
            <span className="text-lg font-semibold">Coffee POS</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden"
            onClick={toggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex flex-col h-[calc(100vh-3.5rem)]">
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid gap-1 px-2">
              {filteredNavItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                    pathname === item.href
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t p-2">
            <nav className="grid gap-1">
              <Link
                to="/settings"
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  pathname === '/settings'
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <Settings className="h-5 w-5" />
                <span>Cài đặt</span>
              </Link>
              <Link
                to="/help"
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  pathname === '/help'
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <HelpCircle className="h-5 w-5" />
                <span>Trợ giúp</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground text-muted-foreground w-full text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Đăng xuất</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

type NavItem = {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  roles?: string[];
  superAdminOnly?: boolean;
};

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: [RoleKeys.Admin],
  },
  {
    name: 'Đơn hàng',
    href: '/orders',
    icon: ShoppingCart,
    roles: [RoleKeys.Admin],
  },
  {
    name: 'Sản phẩm',
    href: '/products',
    icon: Package,
    roles: [RoleKeys.Admin],
  },
  {
    name: 'Danh mục',
    href: '/categories',
    icon: FolderTree,
    roles: [RoleKeys.Admin],
  },
  {
    name: 'Topping',
    href: '/toppings',
    icon: Cherry,
    roles: [RoleKeys.Admin],
  },
  {
    name: 'Voucher',
    href: '/vouchers',
    icon: Ticket,
    roles: [RoleKeys.Admin],
  },
  {
    name: 'Error Logs',
    href: '/error-logs',
    icon: ShieldAlert,
    roles: [RoleKeys.Admin],
    superAdminOnly: true,
  },
];
