'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocale, useTranslations } from 'next-intl';
import { ExternalLink, Pin, X } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';
import { Chip } from '@/components/ui/chip';
import { Markdown } from '@/components/ui/markdown';
import { IssueItem } from '@/components/issue-item';
import { skillById } from '@/data/skills-seed';
import { formatDateRange, cn } from '@/lib/utils';
import { isYoutubeShorts, toYoutubeEmbedUrl } from '@/lib/youtube';
import type { Locale, Project } from '@/types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function toEmbedUrl(url: string): string | null {
  const youtubeEmbed = toYoutubeEmbedUrl(url);
  if (youtubeEmbed) return youtubeEmbed;

  try {
    const u = new URL(url);
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  } catch {
    return null;
  }
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const t = useTranslations('projects');
  const locale = useLocale() as Locale;
  const titleId = useId();

  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<Project | null>(null);
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync with incoming project: open / project-switch / close
  useEffect(() => {
    if (project) {
      setActive(project);
      setClosing(false);
      previouslyFocused.current = (document.activeElement as HTMLElement) ?? null;
    } else if (active) {
      setClosing(true);
      const id = window.setTimeout(() => {
        setActive(null);
        setClosing(false);
        previouslyFocused.current?.focus?.();
      }, 180);
      return () => window.clearTimeout(id);
    }
  }, [project]); // eslint-disable-line react-hooks/exhaustive-deps

  // Body scroll lock
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);

  // Initial focus when opened
  useEffect(() => {
    if (!active || closing) return;
    const node = dialogRef.current;
    if (!node) return;
    const focusables = node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    const first = focusables[0];
    if (first) {
      // Defer to allow paint
      requestAnimationFrame(() => first.focus());
    }
  }, [active, closing]);

  // Keyboard handlers (ESC + Tab focus trap)
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const node = dialogRef.current;
        if (!node) return;
        const focusables = Array.from(
          node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => !el.hasAttribute('disabled'));
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const current = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (current === first || !node.contains(current)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (current === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, onClose]);

  if (!mounted || !active) return null;

  const skills = active.skillIds
    .map((id) => skillById.get(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const embedUrl = active.demoUrl ? toEmbedUrl(active.demoUrl) : null;
  const isShorts = active.demoUrl ? isYoutubeShorts(active.demoUrl) : false;

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6',
        closing ? 'modal-overlay-exit' : 'modal-overlay-enter'
      )}
      style={{
        animation: closing
          ? 'modal-overlay-out 180ms ease-in forwards'
          : 'modal-overlay-in 180ms ease-out forwards',
      }}
    >
      <button
        type="button"
        aria-label={t('close')}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm focus:outline-none"
        tabIndex={-1}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'modal-surface relative flex max-h-[92vh] w-full flex-col overflow-hidden',
          'border border-border-strong',
          'rounded-t-[16px] sm:max-w-[720px] sm:rounded-[12px]'
        )}
        style={{
          animation: closing
            ? 'modal-sheet-out 180ms ease-in forwards'
            : 'modal-sheet-in 200ms ease-out forwards',
        }}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 md:px-7 md:py-5">
          <div className="min-w-0 space-y-1.5">
            <div className="flex items-center gap-2">
              <h2 id={titleId} className="truncate text-h3 text-foreground md:text-[22px] break-keep">
                {active.title[locale]}
              </h2>
              {active.pinned ? (
                <span
                  className="inline-flex items-center gap-1 text-caption text-accent"
                  aria-label={t('pinned')}
                >
                  <Pin className="h-3.5 w-3.5" aria-hidden />
                </span>
              ) : null}
            </div>
            <p className="font-mono text-caption text-foreground-subtle">
              {formatDateRange(active.startDate, active.endDate, active.dateGranularity, locale)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-m-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-foreground-muted transition-colors duration-150 hover:bg-background-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
            aria-label={t('close')}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 md:px-7 md:py-6">
          <div className="space-y-6">
            <p className="text-body text-foreground text-balance break-keep">
              {active.oneLiner[locale]}
            </p>

            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-caption sm:grid-cols-3">
              {active.role ? (
                <div className="space-y-1">
                  <dt className="text-foreground-subtle">{t('role')}</dt>
                  <dd className="text-foreground">{active.role[locale]}</dd>
                </div>
              ) : null}
              {typeof active.teamSize === 'number' ? (
                <div className="space-y-1">
                  <dt className="text-foreground-subtle">{t('team')}</dt>
                  <dd className="text-foreground">{t('people', { count: active.teamSize })}</dd>
                </div>
              ) : null}
              {typeof active.contribution === 'number' ? (
                <div className="space-y-1">
                  <dt className="text-foreground-subtle">{t('contribution')}</dt>
                  <dd className="font-mono text-foreground">{active.contribution}%</dd>
                </div>
              ) : null}
            </dl>

            {skills.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-caption text-foreground-subtle">{t('skills')}</h3>
                <ul className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <li key={s.id}>
                      <Chip>{s.name}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="space-y-2">
              <h3 className="text-caption text-foreground-subtle">{t('overview')}</h3>
              <Markdown>{active.description[locale]}</Markdown>
            </div>

            {embedUrl ? (
              <div className="space-y-2">
                <h3 className="text-caption text-foreground-subtle">{t('demoEmbed')}</h3>
                <div
                  className={cn(
                    'overflow-hidden rounded-[8px] border border-border bg-background-muted',
                    isShorts && 'mx-auto max-w-[360px]'
                  )}
                >
                  <div className={cn('relative w-full', isShorts ? 'aspect-[9/16]' : 'aspect-video')}>
                    <iframe
                      src={embedUrl}
                      title={`${active.title[locale]} — ${t('demoEmbed')}`}
                      className="absolute inset-0 h-full w-full"
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
                {active.demoUrl ? (
                  <div className="flex justify-end">
                    <a
                      href={active.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-caption text-foreground-subtle transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:text-accent"
                    >
                      <ExternalLink className="h-3 w-3" aria-hidden />
                      <span>{t('demoOpenExternal')}</span>
                    </a>
                  </div>
                ) : null}
              </div>
            ) : null}

            {(active.demoUrl || active.githubUrl) ? (
              <div className="flex flex-wrap items-center gap-3 text-caption">
                {active.demoUrl ? (
                  <a
                    href={active.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    <span>{t('viewDemo')}</span>
                  </a>
                ) : null}
                {active.githubUrl ? (
                  <a
                    href={active.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
                  >
                    <GithubIcon className="h-3.5 w-3.5" aria-hidden />
                    <span>{t('viewGithub')}</span>
                  </a>
                ) : null}
              </div>
            ) : null}

            {active.issues.length > 0 ? (
              <div className="space-y-3 border-t border-border pt-6">
                <h3 className="text-h3 text-foreground">{t('issues')}</h3>
                <ul className="space-y-2">
                  {active.issues.map((issue, idx) => (
                    <li key={issue.id}>
                      <IssueItem issue={issue} defaultOpen={idx === 0} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
