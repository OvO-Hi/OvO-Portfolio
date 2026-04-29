'use client';

import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TranslateModalProps {
  open: boolean;
  fieldLabel: string;
  onSelect: (mode: 'reference' | 'overwrite') => void;
  onClose: () => void;
}

export function TranslateModal({ open, fieldLabel, onSelect, onClose }: TranslateModalProps) {
  const t = useTranslations('admin.translate.modal');
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = (document.activeElement as HTMLElement) ?? null;
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);

    requestAnimationFrame(() => {
      const first = dialogRef.current?.querySelector<HTMLElement>('button');
      first?.focus();
    });

    return () => {
      document.body.style.overflow = orig;
      window.removeEventListener('keydown', handler);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (typeof document === 'undefined' || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ animation: 'modal-overlay-in 180ms ease-out forwards' }}
    >
      <button
        type="button"
        aria-label={t('cancel')}
        onClick={onClose}
        tabIndex={-1}
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm focus:outline-none"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'modal-surface relative flex w-full max-w-[440px] flex-col overflow-hidden',
          'rounded-[12px] border border-border-strong'
        )}
        style={{ animation: 'modal-content-in 200ms ease-out forwards' }}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <h2 id={titleId} className="text-h3 text-foreground">
            {t('title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('cancel')}
            className="-m-2 inline-flex h-8 w-8 items-center justify-center rounded-sm text-foreground-muted transition-colors duration-150 hover:bg-background-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>

        <div className="space-y-4 px-5 py-5">
          <p className="text-body text-foreground-muted">
            {t('body', { field: fieldLabel })}
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onSelect('reference')}
              className="block w-full rounded-sm border border-border bg-background-subtle px-4 py-3 text-left transition-colors duration-150 hover:border-border-strong hover:bg-background-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
            >
              <p className="text-body font-medium text-foreground">{t('refOption')}</p>
              <p className="text-caption text-foreground-subtle">{t('refHint')}</p>
            </button>
            <button
              type="button"
              onClick={() => onSelect('overwrite')}
              className="block w-full rounded-sm border border-border bg-background-subtle px-4 py-3 text-left transition-colors duration-150 hover:border-border-strong hover:bg-background-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
            >
              <p className="text-body font-medium text-foreground">{t('overwriteOption')}</p>
              <p className="text-caption text-foreground-subtle">{t('overwriteHint')}</p>
            </button>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center rounded-sm border border-border bg-transparent px-4 text-caption text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
