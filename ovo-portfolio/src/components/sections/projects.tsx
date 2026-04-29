import { getTranslations } from 'next-intl/server';
import { getProjects } from '@/lib/queries';
import { SectionHeading } from './section-heading';
import { ProjectsClient } from '@/components/projects-client';

export async function Projects() {
  const t = await getTranslations('projects');
  const projects = await getProjects();

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="container-prose scroll-mt-24 py-12 md:py-16"
    >
      <SectionHeading id="projects-title" eyebrow="06" title={t('title')} />
      <ProjectsClient projects={projects} />
    </section>
  );
}
