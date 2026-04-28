import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  id: string;
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  className?: string;
}

export function SectionHeading({ id, eyebrow, title, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-8 flex items-baseline gap-3 md:mb-10', className)}>
      {eyebrow ? (
        <span className="font-mono text-caption text-foreground-subtle" aria-hidden>
          {eyebrow}
        </span>
      ) : null}
      <h2 id={id} className="text-h2 text-foreground">
        {title}
      </h2>
      <div className="ml-2 h-px flex-1 bg-border" aria-hidden />
    </div>
  );
}
