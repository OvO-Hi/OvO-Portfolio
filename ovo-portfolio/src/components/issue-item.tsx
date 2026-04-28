'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { Markdown } from '@/components/ui/markdown';
import { cn } from '@/lib/utils';
import type { Locale, ProjectIssue } from '@/types';

interface IssueItemProps {
  issue: ProjectIssue;
  defaultOpen?: boolean;
}

export function IssueItem({ issue, defaultOpen = false }: IssueItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const t = useTranslations('projects');
  const locale = useLocale() as Locale;

  return (
    <div className="overflow-hidden rounded-[8px] border border-border bg-background-subtle">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--border-strong)]"
      >
        <span className="text-body font-medium text-foreground">
          {issue.title[locale]}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-foreground-muted transition-transform duration-200',
            open && 'rotate-180'
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-4 border-t border-border px-4 py-4">
          <div className="space-y-1.5">
            <h4 className="text-caption font-medium text-foreground-subtle">
              {t('issueProblem')}
            </h4>
            <Markdown>{issue.problem[locale]}</Markdown>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-caption font-medium text-foreground-subtle">
              {t('issueSolution')}
            </h4>
            <Markdown>{issue.solution[locale]}</Markdown>
          </div>
          {issue.outcome ? (
            <div className="space-y-1.5">
              <h4 className="text-caption font-medium text-foreground-subtle">
                {t('issueOutcome')}
              </h4>
              <Markdown>{issue.outcome[locale]}</Markdown>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
