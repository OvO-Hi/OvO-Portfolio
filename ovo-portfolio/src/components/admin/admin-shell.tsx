'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';

interface AdminShellProps {
  userName: string;
  children: ReactNode;
}

export function AdminShell({ userName, children }: AdminShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <Header
        userName={userName}
        isMenuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((v) => !v)}
      />

      <div className="md:grid md:grid-cols-[240px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden border-r border-border md:block">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
            <Sidebar />
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        <div
          aria-hidden={!menuOpen}
          className={cn(
            'fixed inset-0 z-20 md:hidden',
            menuOpen ? 'pointer-events-auto' : 'pointer-events-none'
          )}
        >
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={() => setMenuOpen(false)}
            className={cn(
              'absolute inset-0 cursor-default bg-black/40 transition-opacity duration-200',
              menuOpen ? 'opacity-100' : 'opacity-0'
            )}
          />
          <aside
            className={cn(
              'absolute left-0 top-14 h-[calc(100vh-3.5rem)] w-[280px] overflow-y-auto border-r border-border bg-background-subtle transition-transform duration-200',
              menuOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <Sidebar onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
