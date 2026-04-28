'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Pencil } from 'lucide-react';
import { EditCard, EditCardHeader } from '@/components/admin/edit-card';
import { DeleteButton } from '@/components/admin/delete-button';
import { Chip } from '@/components/ui/chip';
import { CertificationForm } from './certification-form';
import { deleteCertification } from './actions';
import type { Certification } from '@/types';

interface CertificationCardProps {
  certification: Certification & { id: string };
}

export function CertificationCard({ certification }: CertificationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const t = useTranslations('admin');
  const tType = useTranslations('certifications.type');

  if (isEditing) {
    return (
      <EditCard>
        <CertificationForm
          initial={certification}
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
              action={deleteCertification.bind(null, certification.id)}
              confirmMessage={t('certifications.deleteConfirm')}
            />
          </>
        }
      >
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-h3 text-foreground">{certification.name.ko}</h3>
            <Chip variant="subtle">{tType(certification.type)}</Chip>
          </div>
          <p className="text-caption text-foreground-muted">
            {certification.issuer.ko}
            <span className="ml-2 text-foreground-subtle">· {certification.issuer.en}</span>
          </p>
          <p className="font-mono text-caption text-foreground-subtle">
            {certification.date}
            {certification.score ? <span className="ml-3">· {certification.score}</span> : null}
          </p>
        </div>
      </EditCardHeader>
    </EditCard>
  );
}
