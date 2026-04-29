'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Eye, EyeOff, GripVertical, Pencil, Pin } from 'lucide-react';
import { EditCard, EditCardHeader } from '@/components/admin/edit-card';
import { DeleteButton } from '@/components/admin/delete-button';
import { Chip } from '@/components/ui/chip';
import { cn, formatDateRange } from '@/lib/utils';
import { ProjectForm } from './project-form';
import { deleteProject } from './actions';
import type { AdminSkill } from '@/lib/admin-queries';
import type { Project } from '@/types';

const PREVIEW_SKILL_LIMIT = 5;

interface AdminProjectCardProps {
  project: Project;
  skills: AdminSkill[];
}

export function AdminProjectCard({ project, skills }: AdminProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const t = useTranslations('admin');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id, disabled: isEditing });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isEditing) {
    return (
      <li ref={setNodeRef} style={style}>
        <EditCard>
          <ProjectForm
            initial={project}
            skills={skills}
            onSuccess={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        </EditCard>
      </li>
    );
  }

  const skillMap = new Map(skills.map((s) => [s.id, s]));
  const previewSkills = project.skillIds
    .slice(0, PREVIEW_SKILL_LIMIT)
    .map((id) => skillMap.get(id))
    .filter((s): s is AdminSkill => Boolean(s));
  const hiddenCount = project.skillIds.length - previewSkills.length;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        'transition-shadow',
        isDragging ? 'z-10 opacity-80 shadow-lg' : ''
      )}
    >
      <EditCard>
        <EditCardHeader
          actions={
            <>
              <button
                type="button"
                aria-label={t('projects.dragHandle')}
                title={t('projects.dragHandle')}
                {...attributes}
                {...listeners}
                className="inline-flex h-8 w-8 cursor-grab items-center justify-center rounded-sm border border-border bg-transparent text-foreground-subtle transition-colors duration-150 hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] active:cursor-grabbing"
              >
                <GripVertical className="h-3.5 w-3.5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-border bg-transparent px-2.5 text-caption text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden />
                <span>{t('common.edit')}</span>
              </button>
              <DeleteButton
                action={deleteProject.bind(null, project.id)}
                confirmMessage={t('projects.deleteConfirm', { title: project.title.ko })}
              />
            </>
          }
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-h3 text-foreground">{project.title.ko}</h3>
              {project.pinned ? (
                <span
                  className="inline-flex items-center gap-1 rounded-sm bg-accent-subtle px-1.5 py-0.5 text-[11px] font-medium text-accent"
                  aria-label="Pinned"
                >
                  <Pin className="h-3 w-3" aria-hidden />
                  Pin
                </span>
              ) : null}
              <span
                className="inline-flex items-center gap-1 text-caption text-foreground-subtle"
                title={project.visible ? 'Visible on public site' : 'Hidden from public site'}
              >
                {project.visible ? (
                  <Eye className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" aria-hidden />
                )}
              </span>
            </div>
            <p className="font-mono text-caption text-foreground-subtle">
              {formatDateRange(
                project.startDate,
                project.endDate,
                project.dateGranularity,
                'ko'
              )}
              <span className="ml-3">order: {project.order}</span>
            </p>
            <p className="text-body text-foreground-muted">{project.oneLiner.ko}</p>
            {previewSkills.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5 pt-1">
                {previewSkills.map((s) => (
                  <li key={s.id}>
                    <Chip>{s.name}</Chip>
                  </li>
                ))}
                {hiddenCount > 0 ? (
                  <li>
                    <Chip variant="subtle">+{hiddenCount}</Chip>
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>
        </EditCardHeader>
      </EditCard>
    </li>
  );
}
