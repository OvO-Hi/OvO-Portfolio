import { useTranslations } from 'next-intl';
import { projects } from '@/data/dummy';
import { SectionHeading } from './section-heading';
import { ProjectsClient } from '@/components/projects-client';

export function Projects() {
  const t = useTranslations('projects');

  const visible = projects
    .filter((p) => p.visible)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return a.order - b.order;
    });

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="container-prose scroll-mt-24 py-16 md:py-24"
    >
      <SectionHeading id="projects-title" eyebrow="06" title={t('title')} />
      <ProjectsClient projects={visible} />
    </section>
  );
}
