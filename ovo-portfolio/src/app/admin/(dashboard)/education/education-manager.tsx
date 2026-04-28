'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { EditCard } from '@/components/admin/edit-card';
import { EducationCard } from './education-card';
import { EducationForm } from './education-form';
import type { AdminEducation } from '@/lib/admin-queries';

interface EducationManagerProps {
  items: AdminEducation[];
}

export function EducationManager({ items }: EducationManagerProps) {
  const [addingNew, setAddingNew] = useState(false);
  const t = useTranslations('admin');

  return (
    <div className="space-y-4">
      {items.length === 0 && !addingNew ? (
        <p className="rounded-sm border border-dashed border-border bg-background-subtle px-4 py-8 text-center text-caption text-foreground-subtle">
          {t('education.empty')}
        </p>
      ) : null}

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <EducationCard education={item} />
          </li>
        ))}
        {addingNew ? (
          <li>
            <EditCard>
              <header className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-h3 text-foreground">{t('education.newItem')}</h3>
              </header>
              <EducationForm
                onSuccess={() => setAddingNew(false)}
                onCancel={() => setAddingNew(false)}
              />
            </EditCard>
          </li>
        ) : null}
      </ul>

      {!addingNew ? (
        <button
          type="button"
          onClick={() => setAddingNew(true)}
          className="inline-flex h-10 items-center gap-1.5 rounded-sm border border-dashed border-border bg-transparent px-4 text-body text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:bg-background-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
        >
          <Plus className="h-4 w-4" aria-hidden />
          <span>{t('education.addNew')}</span>
        </button>
      ) : null}
    </div>
  );
}
