'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ArrowRightLeft,
  FileText,
  Users,
  Settings,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    roles: ['Admin', 'Employee'],
  },
  {
    label: 'Produtos',
    icon: Package,
    href: '/products',
    roles: ['Admin', 'Employee'],
  },
  {
    label: 'Lotes',
    icon: Boxes,
    href: '/batches',
    roles: ['Admin', 'Employee'],
  },
  {
    label: 'Movimentações',
    icon: ArrowRightLeft,
    href: '/stock',
    roles: ['Admin', 'Employee'],
  },
  {
    label: 'Relatórios',
    icon: FileText,
    href: '/reports',
    roles: ['Admin', 'Employee'],
  },
  {
    label: 'Usuários',
    icon: Users,
    href: '/users',
    roles: ['Admin'],
  },
  {
    label: 'Configurações',
    icon: Settings,
    href: '/settings',
    roles: ['Admin'],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/20 lg:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Package className="mr-2 h-6 w-6 text-primary" />
        <span className="font-bold text-xl tracking-tight">StockManager</span>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium">
          {routes
            .filter((route) => !user || route.roles.includes(user.role))
            .map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all mb-1',
                  pathname.startsWith(route.href)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
        </nav>
      </div>
    </aside>
  );
}
