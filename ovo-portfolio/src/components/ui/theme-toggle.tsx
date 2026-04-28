'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('theme');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const current = mounted ? (theme === 'system' ? resolvedTheme : theme) : undefined;
  const isDark = current === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={t('toggle')}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-sm border border-border',
        'text-foreground-muted hover:text-foreground hover:border-border-strong',
        'bg-background-subtle transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]'
      )}
    >
      <Sun
        className={cn(
          'h-4 w-4 transition-all duration-200',
          isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
        )}
      />
      <Moon
        className={cn(
          'absolute h-4 w-4 transition-all duration-200',
          isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
        )}
      />
    </button>
  );
}
