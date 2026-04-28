import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ChipVariant = 'default' | 'accent' | 'subtle';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
}

const variantStyles: Record<ChipVariant, string> = {
  default:
    'bg-background-subtle text-foreground-muted border border-border',
  accent:
    'bg-accent-subtle text-accent border border-transparent',
  subtle:
    'bg-transparent text-foreground-subtle border border-border',
};

export function Chip({ className, variant = 'default', children, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-medium',
        'transition-colors duration-150',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
