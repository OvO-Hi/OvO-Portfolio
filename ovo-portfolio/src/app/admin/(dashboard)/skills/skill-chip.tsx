'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Pencil, X } from 'lucide-react';
import { SkillForm } from './skill-form';
import { deleteSkill } from './actions';
import type { AdminSkill } from '@/lib/admin-queries';

interface SkillChipProps {
  skill: AdminSkill;
}

export function SkillChip({ skill }: SkillChipProps) {
  const [isEditing, setIsEditing] = useState(false);
  const t = useTranslations('admin');

  const handleDelete = () => {
    const confirmKey = skill.usageCount > 0 ? 'deleteUsedConfirm' : 'deleteConfirm';
    const message = t(`skills.${confirmKey}`, {
      name: skill.name,
      count: skill.usageCount,
    });
    if (!window.confirm(message)) return;
    void deleteSkill(skill.id);
  };

  if (isEditing) {
    return (
      <div className="rounded-sm border border-border-strong bg-background p-3 shadow-sm">
        <SkillForm
          mode="edit"
          initial={skill}
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
        {skill.usageCount > 0 ? (
          <p className="mt-2 font-mono text-[11px] text-foreground-subtle">
            {t('skills.usageCount', { count: skill.usageCount })}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="group relative inline-flex">
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        title={skill.usageCount > 0 ? t('skills.usageCount', { count: skill.usageCount }) : undefined}
        className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-background-subtle py-1 pl-2.5 pr-1.5 text-caption font-medium text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
      >
        <span>{skill.name}</span>
        <Pencil
          className="h-3 w-3 text-foreground-subtle opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          aria-hidden
        />
      </button>
      <button
        type="button"
        onClick={handleDelete}
        aria-label={t('common.delete')}
        className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-sm border border-transparent text-foreground-subtle opacity-0 transition-all duration-150 hover:border-border hover:text-accent group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  );
}
