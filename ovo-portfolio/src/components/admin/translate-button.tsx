'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Languages, Loader2 } from 'lucide-react';
import { translateKoToEn } from '@/app/admin/(dashboard)/translate/actions';
import { TranslateModal } from './translate-modal';
import { cn } from '@/lib/utils';

interface TranslateButtonProps {
  koValue: string;
  existingEnValue?: string;
  fieldLabel: string;
  context?: string;
  onTranslated: (en: string) => void;
}

export function TranslateButton({
  koValue,
  existingEnValue,
  fieldLabel,
  context,
  onTranslated,
}: TranslateButtonProps) {
  const t = useTranslations('admin.translate');
  const tErr = useTranslations('admin.translate.errors');
  const [pending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = (mode: 'fresh' | 'reference' | 'overwrite') => {
    setError(null);
    startTransition(async () => {
      const result = await translateKoToEn({
        ko: koValue,
        existingEn: existingEnValue,
        mode,
        context,
      });
      if (!result) {
        console.error('[TranslateButton] translateKoToEn 결과가 비어 있습니다.', result);
        setError(tErr('translateFailed'));
        return;
      }
      if (result.ok) {
        onTranslated(result.en);
      } else if (result.error === 'unauthorized') {
        setError(tErr('translateFailed'));
      } else {
        setError(tErr(result.error));
      }
    });
  };

  const handleClick = () => {
    if (!koValue.trim()) {
      setError(tErr('koEmpty'));
      return;
    }
    if (existingEnValue?.trim()) {
      setModalOpen(true);
    } else {
      run('fresh');
    }
  };

  const handleModalSelect = (mode: 'reference' | 'overwrite') => {
    setModalOpen(false);
    run(mode);
  };

  return (
    <>
      <div className="inline-flex items-center gap-2">
        <button
          type="button"
          onClick={handleClick}
          disabled={pending}
          className={cn(
            'inline-flex h-7 items-center gap-1 rounded-sm border border-border bg-transparent px-2 text-[11px] text-foreground-muted transition-colors duration-150',
            'hover:border-border-strong hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]',
            'disabled:cursor-wait disabled:opacity-60'
          )}
        >
          {pending ? (
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
          ) : (
            <Languages className="h-3 w-3" aria-hidden />
          )}
          <span>{pending ? t('translating') : t('button')}</span>
        </button>
        {error ? (
          <span role="alert" className="text-[11px] text-accent">
            {error}
          </span>
        ) : null}
      </div>

      <TranslateModal
        open={modalOpen}
        fieldLabel={fieldLabel}
        onSelect={handleModalSelect}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
