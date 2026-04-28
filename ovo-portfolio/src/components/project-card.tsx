import { useLocale, useTranslations } from 'next-intl';
import { ExternalLink, Pin } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';
import { Card, CardBody } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { skillById } from '@/data/skills-seed';
import { formatDateRange } from '@/lib/utils';
import type { Locale, Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

const MAX_SKILLS_PREVIEW = 5;

export function ProjectCard({ project }: ProjectCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('projects');

  const skills = project.skillIds
    .map((id) => skillById.get(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const visibleSkills = skills.slice(0, MAX_SKILLS_PREVIEW);
  const hiddenCount = skills.length - visibleSkills.length;

  return (
    <Card className="flex h-full flex-col">
      <CardBody className="flex flex-1 flex-col gap-4">
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
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-foreground-muted transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:text-accent"
              aria-label={`${t('viewDemo')} — ${project.title[locale]}`}
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              <span>{t('viewDemo')}</span>
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-foreground-muted transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:text-accent"
              aria-label={`${t('viewGithub')} — ${project.title[locale]}`}
            >
              <GithubIcon className="h-3.5 w-3.5" aria-hidden />
              <span>{t('viewGithub')}</span>
            </a>
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
}
