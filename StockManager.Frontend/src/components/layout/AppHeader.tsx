import { UserMenu } from './UserMenu';
import { Package } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
      <div className="flex flex-1 items-center gap-4 lg:hidden">
        <Package className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg tracking-tight">StockManager</span>
      </div>
      <div className="flex flex-1 items-center justify-end space-x-4 w-full">
        <UserMenu />
      </div>
    </header>
  );
}
