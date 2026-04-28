'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProjectCard } from '@/components/project-card';
import { ProjectModal } from '@/components/project-modal';
import type { Project } from '@/types';

interface ProjectsClientProps {
  projects: Project[];
}

const QUERY_KEY = 'project';

function readSlugFromLocation(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(QUERY_KEY);
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const projectBySlug = useMemo(() => {
    const map = new Map<string, Project>();
    for (const p of projects) map.set(p.slug, p);
    return map;
  }, [projects]);

  // Sync from URL on mount + back/forward
  useEffect(() => {
    setActiveSlug(readSlugFromLocation());
    const onPopState = () => setActiveSlug(readSlugFromLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const open = useCallback((slug: string) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set(QUERY_KEY, slug);
    window.history.pushState(null, '', url.toString());
    setActiveSlug(slug);
  }, []);

  const close = useCallback(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (url.searchParams.has(QUERY_KEY)) {
      url.searchParams.delete(QUERY_KEY);
      window.history.pushState(null, '', url.toString());
    }
    setActiveSlug(null);
  }, []);

  const activeProject = activeSlug ? projectBySlug.get(activeSlug) ?? null : null;

  return (
    <>
      <ul className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <li key={p.id}>
            <ProjectCard project={p} onOpen={() => open(p.slug)} />
          </li>
        ))}
      </ul>
      <ProjectModal project={activeProject} onClose={close} />
    </>
  );
}
