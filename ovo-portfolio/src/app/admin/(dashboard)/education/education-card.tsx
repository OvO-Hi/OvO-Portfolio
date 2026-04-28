'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Pencil } from 'lucide-react';
import { EditCard, EditCardHeader } from '@/components/admin/edit-card';
import { DeleteButton } from '@/components/admin/delete-button';
import { Chip } from '@/components/ui/chip';
import { formatDateRange } from '@/lib/utils';
import { EducationForm } from './education-form';
import { deleteEducation } from './actions';
import type { Education } from '@/types';

interface EducationCardProps {
  education: Education & { id: string };
}

export function EducationCard({ education }: EducationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const t = useTranslations('admin');
  const tStatus = useTranslations('education.status');

  if (isEditing) {
    return (
      <EditCard>
        <EducationForm
          initial={education}
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
              action={deleteEducation.bind(null, education.id)}
              confirmMessage={t('education.deleteConfirm')}
            />
          </>
        }
      >
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-h3 text-foreground">{education.school.ko}</h3>
            <Chip variant="accent">{tStatus(education.status)}</Chip>
          </div>
          <p className="text-body text-foreground-muted">
            {education.major.ko}
            <span className="ml-2 text-foreground-subtle">· {education.major.en}</span>
          </p>
          <p className="font-mono text-caption text-foreground-subtle">
            {formatDateRange(education.startDate, education.endDate, 'month', 'ko')}
          </p>
          {education.gpa ? (
            <p className="font-mono text-caption text-foreground-subtle">
              GPA {education.gpa.value} / {education.gpa.max}
              {education.gpa.hidden ? (
                <span className="ml-2 text-foreground-subtle">
                  ({t('education.fields.gpaHidden')})
                </span>
              ) : null}
            </p>
          ) : null}
        </div>
      </EditCardHeader>
    </EditCard>
  );
}
