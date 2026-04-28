'use client';

import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SaveButtonProps {
  saved?: boolean;
}

export function SaveButton({ saved = false }: SaveButtonProps) {
  const { pending } = useFormStatus();
  const t = useTranslations('admin.common');

  const showSaved = saved && !pending;

  return (
    <button
      type="submit"
      disabled={pending}
      aria-live="polite"
      className={cn(
        'inline-flex h-10 items-center justify-center gap-1.5 rounded-sm px-5 text-body font-medium transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] focus-visible:ring-[var(--accent)]',
        'disabled:cursor-wait disabled:opacity-70',
        showSaved
          ? 'bg-accent-subtle text-accent'
          : 'bg-foreground text-background hover:opacity-90'
      )}
    >
      {pending ? (
        <span>{t('saving')}</span>
      ) : showSaved ? (
        <>
          <Check className="h-4 w-4" aria-hidden />
          <span>{t('saved')}</span>
        </>
      ) : (
        <span>{t('save')}</span>
      )}
    </button>
  );
}
