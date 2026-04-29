'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Plus, Search } from 'lucide-react';
import { SkillChip } from './skill-chip';
import { SkillForm } from './skill-form';
import { createSkillQuick } from './actions';
import type { AdminSkill } from '@/lib/admin-queries';
import type { SkillCategory } from '@/types';

const CATEGORY_ORDER: SkillCategory[] = [
  'language',
  'frontend',
  'backend',
  'mobile',
  'database',
  'ai',
  'devops',
  'tool',
];

interface SkillManagerProps {
  items: AdminSkill[];
}

export function SkillManager({ items }: SkillManagerProps) {
  const t = useTranslations('admin');
  const tCategory = useTranslations('skills.category');
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [addingTo, setAddingTo] = useState<SkillCategory | null>(null);
  const [pending, startTransition] = useTransition();

  const trimmedQuery = query.trim();

  const filtered = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    if (!q) return items;
    return items.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }, [items, trimmedQuery]);

  const exactMatch = trimmedQuery
    ? items.some((s) => s.name.toLowerCase() === trimmedQuery.toLowerCase())
    : true;
  const showQuickAdd = trimmedQuery.length > 0 && !exactMatch;

  const grouped = useMemo(
    () =>
      CATEGORY_ORDER.map((cat) => ({
        category: cat,
        items: filtered.filter((s) => s.category === cat),
      })),
    [filtered]
  );

  const handleQuickAdd = () => {
    if (!trimmedQuery || pending) return;
    startTransition(async () => {
      const created = await createSkillQuick(trimmedQuery);
      if (created) {
        setQuery('');
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('skills.searchPlaceholder')}
            className="block w-full rounded-sm border border-border bg-background-subtle py-2 pl-9 pr-3 text-body text-foreground placeholder:text-foreground-subtle transition-colors duration-150 hover:border-border-strong focus-visible:outline-none focus-visible:border-border-strong focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          />
        </div>
        {showQuickAdd ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={pending}
              className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-accent-subtle bg-accent-subtle px-2.5 text-caption font-medium text-accent transition-colors duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-60"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              <span>{t('skills.quickAdd', { name: trimmedQuery })}</span>
            </button>
            <span className="text-caption text-foreground-subtle">
              {t('skills.quickAddHint')}
            </span>
          </div>
        ) : null}
      </div>

      {grouped.map((g) => {
        const isAdding = addingTo === g.category;
        return (
          <section
            key={g.category}
            aria-labelledby={`group-${g.category}`}
            className="space-y-3"
          >
            <header className="flex items-center justify-between gap-2">
              <h3
                id={`group-${g.category}`}
                className="text-h3 text-foreground-muted"
              >
                {tCategory(g.category)}
              </h3>
              <button
                type="button"
                onClick={() => setAddingTo(isAdding ? null : g.category)}
                className="inline-flex h-8 items-center gap-1 rounded-sm border border-border bg-transparent px-2.5 text-caption text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden />
                <span>{t('skills.addNew')}</span>
              </button>
            </header>

            {g.items.length === 0 && !isAdding ? (
              <p className="text-caption text-foreground-subtle">
                {query ? t('skills.emptyCategory') : t('skills.emptyCategory')}
              </p>
            ) : (
              <div className="flex flex-wrap items-center gap-1.5">
                {g.items.map((s) => (
                  <SkillChip key={s.id} skill={s} />
                ))}
              </div>
            )}

            {isAdding ? (
              <div className="rounded-sm border border-dashed border-border bg-background-subtle p-3">
                <SkillForm
                  mode="create"
                  defaultCategory={g.category}
                  onSuccess={() => setAddingTo(null)}
                  onCancel={() => setAddingTo(null)}
                />
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
