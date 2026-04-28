'use client';

import { useTransition, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
  action: () => Promise<void> | void;
  confirmMessage: string;
  label?: string;
}

export function DeleteButton({ action, confirmMessage, label }: DeleteButtonProps) {
  const t = useTranslations('admin.common');
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!window.confirm(confirmMessage)) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    startTransition(async () => {
      await action();
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        disabled={pending}
        aria-label={label ?? t('delete')}
        className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-border bg-transparent px-2.5 text-caption text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] disabled:opacity-60"
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
        <span>{label ?? t('delete')}</span>
      </button>
    </form>
  );
}
