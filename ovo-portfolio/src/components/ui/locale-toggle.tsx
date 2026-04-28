'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types';

const LOCALES: Locale[] = ['ko', 'en'];

function swapLocaleInPath(pathname: string, target: Locale): string {
  const segments = pathname.split('/');
  if (segments.length > 1 && (segments[1] === 'ko' || segments[1] === 'en')) {
    segments[1] = target;
    return segments.join('/') || '/';
  }
  return `/${target}`;
}

export function LocaleToggle() {
  const pathname = usePathname() || '/';
  const current = useLocale() as Locale;
  const t = useTranslations('locale');

  return (
    <div
      role="group"
      aria-label={t('toggle')}
      className="inline-flex h-9 items-center rounded-sm border border-border bg-background-subtle p-0.5 font-mono text-caption"
    >
      {LOCALES.map((loc) => {
        const isActive = loc === current;
        return (
          <Link
            key={loc}
            href={swapLocaleInPath(pathname, loc)}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'inline-flex h-full items-center rounded-[4px] px-2.5 transition-colors duration-150',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-foreground-subtle hover:text-foreground'
            )}
          >
            {loc.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
