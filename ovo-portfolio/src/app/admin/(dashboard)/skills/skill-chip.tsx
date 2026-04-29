'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { EyeOff, Lock, Pencil, Pin, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SkillForm } from './skill-form';
import { deleteSkill, updateSkillVisibility } from './actions';
import type { AdminSkill } from '@/lib/admin-queries';
import type { SkillVisibility } from '@/types';

interface SkillChipProps {
  skill: AdminSkill;
}

const VISIBILITY_CYCLE: Record<SkillVisibility, SkillVisibility> = {
  AUTO: 'ALWAYS_SHOW',
  ALWAYS_SHOW: 'HIDDEN',
  HIDDEN: 'AUTO',
};

export function SkillChip({ skill }: SkillChipProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const t = useTranslations('admin');
  const isLocked = Boolean(skill.isSystem);
  const visibility: SkillVisibility = skill.visibility ?? 'AUTO';
  const used = skill.usageCount > 0;

  // Effective public visibility — match the public-site rule.
  const isVisibleOnSite =
    visibility === 'ALWAYS_SHOW' || (visibility === 'AUTO' && used);

  const handleDelete = () => {
    const confirmKey = used ? 'deleteUsedConfirm' : 'deleteConfirm';
    const message = t(`skills.${confirmKey}`, {
      name: skill.name,
      count: skill.usageCount,
    });
    if (!window.confirm(message)) return;
    void deleteSkill(skill.id);
  };

  const cycleVisibility = () => {
    const next = VISIBILITY_CYCLE[visibility];
    startTransition(() => {
      void updateSkillVisibility(skill.id, next);
    });
  };

  // Tooltip text for current visibility state
  let tooltip: string;
  if (visibility === 'ALWAYS_SHOW') {
    tooltip = t('skills.visibility.tooltipAlways');
  } else if (visibility === 'HIDDEN') {
    tooltip = t('skills.visibility.tooltipHidden');
  } else if (used) {
    tooltip = t('skills.visibility.tooltipUsed', {
      projects: skill.projectTitles.join(', '),
    });
  } else {
    tooltip = t('skills.visibility.tooltipNotUsed');
  }

  // Visibility toggle icon + aria
  const VisIcon =
    visibility === 'ALWAYS_SHOW' ? Pin : visibility === 'HIDDEN' ? EyeOff : Zap;
  const visToggleLabel = t(
    `skills.visibility.${
      visibility === 'ALWAYS_SHOW'
        ? 'alwaysShow'
        : visibility === 'HIDDEN'
        ? 'hidden'
        : 'auto'
    }`
  );

  // Chip body styles depending on effective visibility
  const chipBaseClass =
    'inline-flex items-center gap-1.5 rounded-sm border py-1 pl-2.5 pr-1.5 text-caption font-medium transition-colors duration-150';
  let chipStyle: string;
  let chipExtra = '';
  if (visibility === 'HIDDEN') {
    chipStyle =
      'border-border bg-background-subtle text-foreground-subtle line-through';
    chipExtra = 'opacity-50';
  } else if (visibility === 'ALWAYS_SHOW') {
    chipStyle = 'border-accent bg-accent-subtle text-accent';
  } else if (used) {
    chipStyle = 'border-border bg-background-subtle text-foreground';
  } else {
    chipStyle = 'border-border bg-background-subtle text-foreground-subtle';
    chipExtra = 'opacity-60';
  }

  // Edit mode (inline form, only for non-locked)
  if (isEditing && !isLocked) {
    return (
      <div className="rounded-sm border border-border-strong bg-background p-3 shadow-sm">
        <SkillForm
          mode="edit"
          initial={skill}
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
        {used ? (
          <p className="mt-2 font-mono text-[11px] text-foreground-subtle">
            {t('skills.usageCount', { count: skill.usageCount })}
          </p>
        ) : null}
      </div>
    );
  }

  // Visibility toggle button (always visible, even on system skills)
  const visibilityButton = (
    <button
      type="button"
      onClick={cycleVisibility}
      disabled={pending}
      title={`${visToggleLabel} — ${tooltip}`}
      aria-label={`${skill.name}: ${visToggleLabel}`}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-sm border transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]',
        'disabled:cursor-wait disabled:opacity-60',
        visibility === 'ALWAYS_SHOW'
          ? 'border-accent bg-accent-subtle text-accent hover:opacity-90'
          : visibility === 'HIDDEN'
          ? 'border-border bg-transparent text-foreground-subtle hover:border-border-strong hover:text-foreground'
          : isVisibleOnSite
          ? 'border-border bg-transparent text-foreground-muted hover:border-border-strong hover:text-foreground'
          : 'border-border bg-transparent text-foreground-subtle hover:border-border-strong hover:text-foreground'
      )}
    >
      <VisIcon className="h-3 w-3" aria-hidden />
    </button>
  );

  if (isLocked) {
    return (
      <div className={cn('group inline-flex items-center gap-1', chipExtra)}>
        <span
          title={tooltip}
          aria-label={`${skill.name} — ${t('skills.systemBadge')}`}
          className={cn(chipBaseClass, chipStyle, 'cursor-default')}
        >
          <Lock className="h-3 w-3" aria-hidden />
          <span>{skill.name}</span>
        </span>
        {visibilityButton}
      </div>
    );
  }

  return (
    <div className={cn('group relative inline-flex items-center gap-1', chipExtra)}>
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        title={tooltip}
        className={cn(
          chipBaseClass,
          chipStyle,
          'hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]'
        )}
      >
        <span>{skill.name}</span>
        <Pencil
          className="h-3 w-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          aria-hidden
        />
      </button>
      {visibilityButton}
      <button
        type="button"
        onClick={handleDelete}
        aria-label={t('common.delete')}
        className="inline-flex h-7 w-7 items-center justify-center rounded-sm border border-transparent text-foreground-subtle opacity-0 transition-all duration-150 hover:border-border hover:text-accent group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  );
}
