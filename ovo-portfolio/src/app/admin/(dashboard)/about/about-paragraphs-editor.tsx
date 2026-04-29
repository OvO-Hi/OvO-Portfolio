'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, X } from 'lucide-react';
import { LangTabs } from '@/components/admin/lang-tabs';
import { TranslateButton } from '@/components/admin/translate-button';
import { cn } from '@/lib/utils';

interface AboutParagraphsEditorProps {
  initialKo: string[];
  initialEn: string[];
}

interface Pair {
  id: number;
  ko: string;
  en: string;
}

const textareaClass = cn(
  'block w-full resize-y rounded-sm border border-border bg-background-subtle px-3 py-2 text-body leading-[1.6] text-foreground placeholder:text-foreground-subtle',
  'transition-colors duration-150 hover:border-border-strong',
  'focus-visible:outline-none focus-visible:border-border-strong focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]'
);

export function AboutParagraphsEditor({ initialKo, initialEn }: AboutParagraphsEditorProps) {
  const idRef = useRef(0);
  const newId = () => ++idRef.current;
  const t = useTranslations('admin.about');

  const [pairs, setPairs] = useState<Pair[]>(() => {
    const max = Math.max(initialKo.length, initialEn.length);
    if (max === 0) return [];
    return Array.from({ length: max }, (_, i) => ({
      id: newId(),
      ko: initialKo[i] ?? '',
      en: initialEn[i] ?? '',
    }));
  });

  const updateKo = (id: number, value: string) => {
    setPairs((prev) => prev.map((p) => (p.id === id ? { ...p, ko: value } : p)));
  };
  const updateEn = (id: number, value: string) => {
    setPairs((prev) => prev.map((p) => (p.id === id ? { ...p, en: value } : p)));
  };
  const add = () => {
    setPairs((prev) => [...prev, { id: newId(), ko: '', en: '' }]);
  };
  const remove = (id: number) => {
    setPairs((prev) => prev.filter((p) => p.id !== id));
  };

  const renderHeader = (index: number, id: number, translateButton?: React.ReactNode) => (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="block font-mono text-caption text-foreground-subtle">
        {t('paragraphLabel', { n: index + 1 })}
      </span>
      <div className="flex items-center gap-2">
        {translateButton}
        <button
          type="button"
          onClick={() => remove(id)}
          aria-label={t('removeParagraph')}
          className="inline-flex h-7 items-center gap-1 rounded-sm px-2 text-caption text-foreground-subtle transition-colors duration-150 hover:bg-background-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
          <span>{t('removeParagraph')}</span>
        </button>
      </div>
    </div>
  );

  const empty = pairs.length === 0;

  return (
    <div className="space-y-3">
      <LangTabs
        koLabel={t('tabKo')}
        enLabel={t('tabEn')}
        koContent={
          <div className="space-y-3">
            {empty ? (
              <p className="rounded-sm border border-dashed border-border bg-background-subtle px-4 py-6 text-center text-caption text-foreground-subtle">
                {t('empty')}
              </p>
            ) : (
              <ul className="space-y-3">
                {pairs.map((p, i) => (
                  <li key={p.id} className="space-y-1.5">
                    {renderHeader(i, p.id)}
                    <textarea
                      name="paragraphsKo"
                      value={p.ko}
                      onChange={(e) => updateKo(p.id, e.target.value)}
                      placeholder={t('paragraphPlaceholder')}
                      rows={3}
                      className={textareaClass}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        }
        enContent={
          <div className="space-y-3">
            {empty ? (
              <p className="rounded-sm border border-dashed border-border bg-background-subtle px-4 py-6 text-center text-caption text-foreground-subtle">
                {t('empty')}
              </p>
            ) : (
              <ul className="space-y-3">
                {pairs.map((p, i) => (
                  <li key={p.id} className="space-y-1.5">
                    {renderHeader(
                      i,
                      p.id,
                      <TranslateButton
                        koValue={p.ko}
                        existingEnValue={p.en}
                        fieldLabel={t('paragraphLabel', { n: i + 1 })}
                        context="Self-introduction paragraph for the About section"
                        onTranslated={(en) => updateEn(p.id, en)}
                      />
                    )}
                    <textarea
                      name="paragraphsEn"
                      value={p.en}
                      onChange={(e) => updateEn(p.id, e.target.value)}
                      placeholder={t('paragraphPlaceholder')}
                      rows={3}
                      className={textareaClass}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        }
      />

      <button
        type="button"
        onClick={add}
        className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-dashed border-border bg-transparent px-3 text-caption text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:bg-background-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        <span>{t('addParagraph')}</span>
      </button>
    </div>
  );
}
