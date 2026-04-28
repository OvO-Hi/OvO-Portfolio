import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EditCardProps {
  className?: string;
  children: ReactNode;
}

export function EditCard({ className, children }: EditCardProps) {
  return (
    <article
      className={cn(
        'rounded-[8px] border border-border bg-background-subtle p-5 md:p-6',
        'transition-colors duration-150 hover:border-border-strong',
        className
      )}
    >
      {children}
    </article>
  );
}

interface EditCardHeaderProps {
  children: ReactNode;
  actions?: ReactNode;
}

export function EditCardHeader({ children, actions }: EditCardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">{children}</div>
      {actions ? <div className="flex shrink-0 items-center gap-1.5">{actions}</div> : null}
    </div>
  );
}
