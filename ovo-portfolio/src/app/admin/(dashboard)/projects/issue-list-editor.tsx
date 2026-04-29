'use client';

import { useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IssueDraft } from './types';

interface IssueListEditorProps {
  name: string;
  initial: IssueDraft[];
}

interface Item {
  id: number;
  data: IssueDraft;
}

const EMPTY: IssueDraft = {
  titleKo: '',
  titleEn: '',
  problemKo: '',
  problemEn: '',
  solutionKo: '',
  solutionEn: '',
  outcomeKo: '',
  outcomeEn: '',
};

const inputClass = cn(
  'block w-full rounded-sm border border-border bg-background-subtle px-3 py-2 text-body text-foreground placeholder:text-foreground-subtle',
  'transition-colors duration-150 hover:border-border-strong',
  'focus-visible:outline-none focus-visible:border-border-strong focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]'
);

const textareaClass = cn(inputClass, 'resize-y leading-[1.6]');

export function IssueListEditor({ name, initial }: IssueListEditorProps) {
  const idRef = useRef(0);
  const newId = () => ++idRef.current;
  const [items, setItems] = useState<Item[]>(() =>
    initial.map((data) => ({ id: newId(), data }))
  );
  const t = useTranslations('admin.projects.issues');

  const json = useMemo(
    () => JSON.stringify(items.map((i) => i.data)),
    [items]
  );

  const update = <K extends keyof IssueDraft>(id: number, field: K, value: IssueDraft[K]) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, data: { ...item.data, [field]: value } } : item
      )
    );
  };

  const add = () => {
    setItems((prev) => [...prev, { id: newId(), data: { ...EMPTY } }]);
  };

  const remove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={json} />

      {items.length === 0 ? (
        <p className="rounded-sm border border-dashed border-border bg-background-subtle px-4 py-6 text-center text-caption text-foreground-subtle">
          {t('empty')}
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="rounded-sm border border-border bg-background p-4"
            >
              <header className="mb-3 flex items-center justify-between gap-3">
                <h4 className="font-mono text-caption font-medium text-foreground-subtle">
                  {t('labelN', { n: index + 1 })}
                </h4>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={t('remove')}
                  className="inline-flex h-7 items-center gap-1 rounded-sm px-2 text-caption text-foreground-subtle transition-colors duration-150 hover:bg-background-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                  <span>{t('remove')}</span>
                </button>
              </header>

              <div className="grid gap-3 md:grid-cols-2">
                <Field label={t('titleKo')}>
                  <input
                    type="text"
                    value={item.data.titleKo}
                    onChange={(e) => update(item.id, 'titleKo', e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label={t('titleEn')}>
                  <input
                    type="text"
                    value={item.data.titleEn}
                    onChange={(e) => update(item.id, 'titleEn', e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label={t('problemKo')}>
                  <textarea
                    rows={3}
                    value={item.data.problemKo}
                    onChange={(e) => update(item.id, 'problemKo', e.target.value)}
                    className={textareaClass}
                  />
                </Field>
                <Field label={t('problemEn')}>
                  <textarea
                    rows={3}
                    value={item.data.problemEn}
                    onChange={(e) => update(item.id, 'problemEn', e.target.value)}
                    className={textareaClass}
                  />
                </Field>
                <Field label={t('solutionKo')}>
                  <textarea
                    rows={3}
                    value={item.data.solutionKo}
                    onChange={(e) => update(item.id, 'solutionKo', e.target.value)}
                    className={textareaClass}
                  />
                </Field>
                <Field label={t('solutionEn')}>
                  <textarea
                    rows={3}
                    value={item.data.solutionEn}
                    onChange={(e) => update(item.id, 'solutionEn', e.target.value)}
                    className={textareaClass}
                  />
                </Field>
                <Field label={t('outcomeKo')}>
                  <textarea
                    rows={2}
                    value={item.data.outcomeKo}
                    onChange={(e) => update(item.id, 'outcomeKo', e.target.value)}
                    className={textareaClass}
                  />
                </Field>
                <Field label={t('outcomeEn')}>
                  <textarea
                    rows={2}
                    value={item.data.outcomeEn}
                    onChange={(e) => update(item.id, 'outcomeEn', e.target.value)}
                    className={textareaClass}
                  />
                </Field>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={add}
        className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-dashed border-border bg-transparent px-3 text-caption text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:bg-background-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        <span>{t('addNew')}</span>
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1">
      <span className="block text-caption font-medium text-foreground-subtle">
        {label}
      </span>
      {children}
    </label>
  );
}
