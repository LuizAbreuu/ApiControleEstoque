'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setIsHydrated(true));
    if (useAuthStore.persist.hasHydrated()) {
      setTimeout(() => setIsHydrated(true), 0);
    }
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (isHydrated && !isAuthenticated && !pathname.startsWith('/login')) {
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, router, pathname]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, we don't render children to prevent flash of content
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
