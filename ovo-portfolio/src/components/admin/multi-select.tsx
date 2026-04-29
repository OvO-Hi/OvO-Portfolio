'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MultiSelectOption {
  value: string;
  label: string;
  group?: string;
}

interface MultiSelectProps {
  name: string;
  options: MultiSelectOption[];
  defaultValue?: string[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  onCreate?: (name: string) => Promise<MultiSelectOption | null>;
  createHint?: string;
}

export function MultiSelect({
  name,
  options,
  defaultValue = [],
  searchPlaceholder,
  emptyMessage,
  onCreate,
  createHint,
}: MultiSelectProps) {
  const t = useTranslations('admin.multiSelect');
  const [selected, setSelected] = useState<string[]>(defaultValue);
  const [extra, setExtra] = useState<MultiSelectOption[]>([]);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allOptions = useMemo(() => [...options, ...extra], [options, extra]);

  const optionMap = useMemo(
    () => new Map(allOptions.map((o) => [o.value, o])),
    [allOptions]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allOptions.filter((o) => {
      if (selected.includes(o.value)) return false;
      if (!q) return true;
      return (
        o.label.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q) ||
        (o.group ?? '').toLowerCase().includes(q)
      );
    });
  }, [allOptions, selected, query]);

  const trimmedQuery = query.trim();
  const exactMatch = trimmedQuery
    ? allOptions.some((o) => o.label.toLowerCase() === trimmedQuery.toLowerCase())
    : true;
  const showCreate = Boolean(onCreate) && trimmedQuery.length > 0 && !exactMatch;

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!onCreate || creating) return;
    const name = trimmedQuery;
    if (!name) return;
    setCreating(true);
    try {
      const created = await onCreate(name);
      if (!created) return;
      if (!optionMap.has(created.value)) {
        setExtra((prev) => [...prev, created]);
      }
      setSelected((prev) =>
        prev.includes(created.value) ? prev : [...prev, created.value]
      );
      setQuery('');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div ref={containerRef} className="space-y-2">
      {selected.map((id) => (
        <input key={id} type="hidden" name={name} value={id} />
      ))}

      {selected.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {selected.map((id) => {
            const opt = optionMap.get(id);
            const label = opt?.label ?? id;
            return (
              <li key={id}>
                <span className="inline-flex items-center gap-1 rounded-sm bg-accent-subtle px-2 py-1 text-caption font-medium text-accent">
                  {label}
                  <button
                    type="button"
                    onClick={() => toggle(id)}
                    aria-label={`remove ${label}`}
                    className="ml-0.5 rounded-sm text-accent transition-opacity duration-150 hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
                  >
                    <X className="h-3 w-3" aria-hidden />
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      ) : emptyMessage ? (
        <p className="text-caption text-foreground-subtle">{emptyMessage}</p>
      ) : null}

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={searchPlaceholder}
          className={cn(
            'block w-full rounded-sm border border-border bg-background-subtle px-3 py-2 text-body text-foreground placeholder:text-foreground-subtle',
            'transition-colors duration-150 hover:border-border-strong',
            'focus-visible:outline-none focus-visible:border-border-strong focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]'
          )}
        />
        {open && (filtered.length > 0 || showCreate) ? (
          <ul
            role="listbox"
            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-sm border border-border bg-background-subtle shadow-lg"
          >
            {filtered.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => {
                    toggle(opt.value);
                  }}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-body text-foreground transition-colors duration-150 hover:bg-background-muted focus-visible:outline-none focus-visible:bg-background-muted"
                >
                  <span>{opt.label}</span>
                  {opt.group ? (
                    <span className="font-mono text-caption text-foreground-subtle">
                      {opt.group}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
            {showCreate ? (
              <li className="border-t border-border">
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={creating}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-body text-accent transition-colors duration-150 hover:bg-background-muted focus-visible:outline-none focus-visible:bg-background-muted disabled:opacity-60"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden />
                  <span>{t('createOption', { name: trimmedQuery })}</span>
                </button>
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>

      {onCreate && createHint ? (
        <p className="text-caption text-foreground-subtle">{createHint}</p>
      ) : null}
    </div>
  );
}
