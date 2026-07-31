'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Experience, Locale } from '@/types';

interface ExperienceImageProps {
  experience: Experience;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ExperienceImage({ experience }: ExperienceImageProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('experience');
  const tCommon = useTranslations('common');
  const titleId = useId();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    previouslyFocused.current?.focus?.();
  }, []);

  const openModal = useCallback(() => {
    previouslyFocused.current = (document.activeElement as HTMLElement) ?? null;
    setOpen(true);
  }, []);

  const openProject = useCallback(
    (slug: string) => {
      const url = new URL(window.location.href);
      url.searchParams.set('project', slug);
      window.history.pushState(null, '', url.toString());
      window.dispatchEvent(new PopStateEvent('popstate'));
      setOpen(false);
    },
    []
  );

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Initial focus
  useEffect(() => {
    if (!open) return;
    const node = dialogRef.current;
    if (!node) return;
    const first = node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)[0];
    if (first) requestAnimationFrame(() => first.focus());
  }, [open]);

  // ESC + Tab focus trap
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
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
        } else if (current === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, close]);

  if (!experience.imageUrl) return null;

  const imageAlt = t('imageAlt', { organization: experience.organization[locale] });

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        aria-label={tCommon('enlargeImage')}
        className={cn(
          'group relative aspect-video w-full shrink-0 cursor-pointer overflow-hidden rounded-sm border border-border bg-background-muted',
          'transition-all duration-200 hover:border-border-strong hover:shadow-lg',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
          'sm:aspect-[4/3] sm:w-40'
        )}
      >
        <Image
          src={experience.imageUrl}
          alt=""
          fill
          sizes="(min-width: 640px) 160px, 100vw"
          className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
        />
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/35 group-hover:opacity-100 group-focus-visible:bg-black/35 group-focus-visible:opacity-100"
        >
          <ZoomIn className="h-5 w-5 text-white" />
        </span>
      </button>

      {mounted && open
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
              style={{ animation: 'modal-overlay-in 180ms ease-out forwards' }}
            >
              <button
                type="button"
                aria-label={tCommon('close')}
                onClick={close}
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
                  'rounded-t-[16px] sm:max-w-[860px] sm:rounded-[12px]'
                )}
                style={{ animation: 'modal-sheet-in 200ms ease-out forwards' }}
              >
                <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 md:px-7 md:py-5">
                  <h2
                    id={titleId}
                    className="min-w-0 truncate text-h3 text-foreground md:text-[22px] break-keep"
                  >
                    {experience.organization[locale]}
                    {experience.role[locale] ? (
                      <span className="font-normal text-foreground-muted">
                        {' '}
                        · {experience.role[locale]}
                      </span>
                    ) : null}
                  </h2>
                  <button
                    type="button"
                    onClick={close}
                    className="-m-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-foreground-muted transition-colors duration-150 hover:bg-background-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
                    aria-label={tCommon('close')}
                  >
                    <X className="h-5 w-5" aria-hidden />
                  </button>
                </header>

                <div className="flex-1 overflow-y-auto p-5 md:p-6">
                  <div className="relative h-[60vh] w-full md:h-[70vh]">
                    <Image
                      src={experience.imageUrl}
                      alt={imageAlt}
                      fill
                      sizes="(min-width: 640px) 860px, 100vw"
                      className="object-contain"
                    />
                  </div>
                </div>

                {experience.project ? (
                  <footer className="border-t border-border px-5 py-4 md:px-7">
                    <button
                      type="button"
                      onClick={() => openProject(experience.project!.slug)}
                      className="inline-flex items-center gap-1.5 rounded-sm border border-accent bg-accent-subtle px-3 py-1.5 text-caption text-accent transition-colors duration-150 hover:bg-accent hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                    >
                      <span>{t('viewProject')}</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </footer>
                ) : null}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
