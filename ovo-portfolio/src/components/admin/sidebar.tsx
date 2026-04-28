'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ADMIN_NAV_ITEMS } from './nav-items';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations('admin');

  return (
    <nav aria-label={t('siteTitle')} className="flex h-full flex-col gap-1 p-4">
      <p className="px-3 pb-2 font-mono text-caption text-foreground-subtle">
        {t('siteTitle')}
      </p>
      <ul className="space-y-0.5">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const label = t(`nav.${item.key}`);

          if (!item.enabled) {
            return (
              <li key={item.key}>
                <span
                  aria-disabled="true"
                  className="flex cursor-not-allowed items-center justify-between gap-2 rounded-sm px-3 py-2 text-body text-foreground-subtle"
                >
                  <span>{label}</span>
                  <span className="font-mono text-[11px] text-foreground-subtle">
                    {t('nav.comingSoon')}
                  </span>
                </span>
              </li>
            );
          }

          return (
            <li key={item.key}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-sm px-3 py-2 text-body transition-colors duration-150',
                  isActive
                    ? 'bg-accent-subtle text-accent'
                    : 'text-foreground-muted hover:bg-background-muted hover:text-foreground'
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
