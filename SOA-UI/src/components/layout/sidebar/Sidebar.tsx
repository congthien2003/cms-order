import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Settings,
  Wallet,
  Menu,
  Users,
  HelpCircle,
  LogOut,
  BarChartIcon,
  type LucideProps,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from './useSidebar';
import { Button } from '@/components/ui/button';
import { RoleKeys } from '@/constants/roles';
import { TokenService } from '@/utils/tokenService';
import { useState, useEffect } from 'react';

export function Sidebar() {
  const { isOpen, toggle } = useSidebar();
  const pathname = useLocation();
  const currentRoles = new TokenService().getCurrentRoles();
  const [filteredNavItems, setFilteredNavItems] = useState<NavItem[]>([]);
  useEffect(() => {
    setFilteredNavItems(
      navItems.filter((item) =>
        item.roles?.some((role) => currentRoles.includes(role))
      )
    );
  }, [currentRoles]);

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
          <span className="text-lg font-semibold">Sambo Admin</span>
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
                    pathname.pathname === item.href
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
              {footerItems.map((item, index) => (
                <div key={index}>
                  {item.subItems ? (
                    <div className="space-y-1">
                      <Link
                        to={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                          pathname.pathname === item.href
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground'
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                      <div className="pl-4 space-y-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.href}
                            className={cn(
                              'flex items-center gap-3 rounded-md px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground',
                              pathname.pathname === subItem.href
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground'
                            )}
                          >
                            <span>{subItem.name}</span>
                            {subItem.description && (
                              <span className="ml-auto text-xs text-muted-foreground">
                                {subItem.description}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                        pathname.pathname === item.href
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                      {item.description && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              ))}
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
};

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: [RoleKeys.Admin],
  },
  { name: 'Users', href: '/users', icon: Users, roles: [RoleKeys.Admin] },
  { name: 'Roles', href: '/roles', icon: Wallet, roles: [RoleKeys.Admin] },
  { name: 'Demo', href: '/demo', icon: BarChartIcon, roles: [RoleKeys.Admin] },

  // { name: "Transactions", href: "/transactions", icon: Wallet },
  // { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

const footerItems = [
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    subItems: [
      {
        name: 'Profile',
        href: '/settings/profile',
        description: 'Update your details',
      },
      {
        name: 'Security',
        href: '/settings/security',
        description: 'Manage your password',
      },
      {
        name: 'Communication',
        href: '/settings/communication',
        description: 'Email and phone',
      },
      {
        name: 'Permissions',
        href: '/settings/permissions',
        description: 'Access control',
      },
    ],
  },
  {
    name: 'Help',
    href: '/help',
    icon: HelpCircle,
    description: 'Get support',
  },
  {
    name: 'Logout',
    href: '/logout',
    icon: LogOut,
    description: 'Exit the app',
  },
];
