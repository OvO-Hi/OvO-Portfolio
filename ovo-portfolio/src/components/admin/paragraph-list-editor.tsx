'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParagraphListEditorProps {
  name: string;
  initial: string[];
}

interface Item {
  id: number;
  value: string;
}

export function ParagraphListEditor({ name, initial }: ParagraphListEditorProps) {
  const idRef = useRef(0);
  const newId = () => ++idRef.current;
  const [items, setItems] = useState<Item[]>(() =>
    initial.length > 0 ? initial.map((value) => ({ id: newId(), value })) : []
  );
  const t = useTranslations('admin.about');

  const updateValue = (id: number, value: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, value } : item)));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { id: newId(), value: '' }]);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="rounded-sm border border-dashed border-border bg-background-subtle px-4 py-6 text-center text-caption text-foreground-subtle">
          {t('empty')}
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={item.id} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor={`paragraph-${name}-${item.id}`}
                  className="font-mono text-caption text-foreground-subtle"
                >
                  {t('paragraphLabel', { n: index + 1 })}
                </label>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={t('removeParagraph')}
                  className="inline-flex h-7 items-center gap-1 rounded-sm px-2 text-caption text-foreground-subtle transition-colors duration-150 hover:bg-background-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                  <span>{t('removeParagraph')}</span>
                </button>
              </div>
              <textarea
                id={`paragraph-${name}-${item.id}`}
                name={name}
                value={item.value}
                onChange={(e) => updateValue(item.id, e.target.value)}
                placeholder={t('paragraphPlaceholder')}
                rows={3}
                className={cn(
                  'block w-full resize-y rounded-sm border border-border bg-background-subtle px-3 py-2 text-body leading-[1.6] text-foreground placeholder:text-foreground-subtle',
                  'transition-colors duration-150 hover:border-border-strong',
                  'focus-visible:outline-none focus-visible:border-border-strong focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]'
                )}
              />
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={addItem}
        className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-dashed border-border bg-transparent px-3 text-caption text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:bg-background-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        <span>{t('addParagraph')}</span>
      </button>
    </div>
  );
}
