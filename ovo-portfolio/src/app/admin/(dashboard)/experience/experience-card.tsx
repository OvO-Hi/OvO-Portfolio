'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Pencil } from 'lucide-react';
import { EditCard, EditCardHeader } from '@/components/admin/edit-card';
import { DeleteButton } from '@/components/admin/delete-button';
import { formatDateRange } from '@/lib/utils';
import { ExperienceForm } from './experience-form';
import { deleteExperience } from './actions';
import type { Experience } from '@/types';

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const t = useTranslations('admin');

  if (isEditing) {
    return (
      <EditCard>
        <ExperienceForm
          initial={experience}
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      </EditCard>
    );
  }

  return (
    <EditCard>
      <EditCardHeader
        actions={
          <>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-border bg-transparent px-2.5 text-caption text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden />
              <span>{t('common.edit')}</span>
            </button>
            <DeleteButton
              action={deleteExperience.bind(null, experience.id)}
              confirmMessage={t('experience.deleteConfirm')}
            />
          </>
        }
      >
        <div className="space-y-1.5">
          <h3 className="text-h3 text-foreground">
            {experience.organization.ko}
            {experience.role.ko ? (
              <span className="font-normal text-foreground-muted"> · {experience.role.ko}</span>
            ) : null}
          </h3>
          <p className="font-mono text-caption text-foreground-subtle">
            {formatDateRange(experience.startDate, experience.endDate, 'month', 'ko')}
          </p>
          {experience.description.ko ? (
            <p className="text-body text-foreground-muted">{experience.description.ko}</p>
          ) : null}
        </div>
      </EditCardHeader>
    </EditCard>
  );
}
