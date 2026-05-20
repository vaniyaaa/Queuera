'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getStoredUser } from '@/lib/auth';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/compose': 'Compose',
  '/scheduled': 'Scheduled Posts',
  '/accounts': 'Connected Accounts',
};

export default function TopBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const title = pageTitles[pathname] ?? 'Queuera';

  return (
    <header className="fixed top-0 left-60 right-0 h-[60px] bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-xs font-semibold text-indigo-600">
            {user?.email?.[0]?.toUpperCase() ?? 'U'}
          </span>
        </div>
        <span className="text-sm text-slate-600 hidden sm:block">{user?.email ?? ''}</span>
      </div>
    </header>
  );
}
