'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ExternalLink, Pin } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';
import { Chip } from '@/components/ui/chip';
import { skillById } from '@/data/skills-seed';
import { formatDateRange, cn } from '@/lib/utils';
import type { Locale, Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onOpen: () => void;
}

const MAX_SKILLS_PREVIEW = 5;

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('projects');

  const skills = project.skillIds
    .map((id) => skillById.get(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const visibleSkills = skills.slice(0, MAX_SKILLS_PREVIEW);
  const hiddenCount = skills.length - visibleSkills.length;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${t('openDetails')} — ${project.title[locale]}`}
      aria-haspopup="dialog"
      className={cn(
        'group relative flex h-full w-full flex-col overflow-hidden rounded-[8px] border border-border bg-background-subtle text-left',
        'transition-colors duration-200 hover:border-border-strong hover:bg-background-muted',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]'
      )}
    >
      {project.thumbnailUrl ? (
        <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-background-muted">
          <Image
            src={project.thumbnailUrl}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-h3 text-foreground">{project.title[locale]}</h3>
              {project.pinned ? (
                <span
                  className="inline-flex items-center gap-1 text-caption text-accent"
                  aria-label={t('pinned')}
                >
                  <Pin className="h-3 w-3" aria-hidden />
                </span>
              ) : null}
            </div>
            <p className="font-mono text-caption text-foreground-subtle">
              {formatDateRange(project.startDate, project.endDate, project.dateGranularity, locale)}
            </p>
          </div>
        </div>

        <p className="text-body text-foreground-muted text-balance">
          {project.oneLiner[locale]}
        </p>

        <ul className="flex flex-wrap gap-1.5">
          {visibleSkills.map((s) => (
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

        <div className="mt-auto flex items-center gap-3 pt-2 text-caption">
          {project.demoUrl ? (
            <span
              className="inline-flex items-center gap-1 text-foreground-muted"
              aria-hidden
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>{t('viewDemo')}</span>
            </span>
          ) : null}
          {project.githubUrl ? (
            <span
              className="inline-flex items-center gap-1 text-foreground-muted"
              aria-hidden
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span>{t('viewGithub')}</span>
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
