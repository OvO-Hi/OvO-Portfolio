import { cn } from '@/lib/utils';

interface StatusMessageProps {
  variant: 'success' | 'error';
  children: React.ReactNode;
}

export function StatusMessage({ variant, children }: StatusMessageProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-sm border px-4 py-3 text-caption',
        variant === 'success'
          ? 'border-accent-subtle bg-accent-subtle text-accent'
          : 'border-accent bg-background-subtle text-accent'
      )}
    >
      {children}
    </div>
  );
}
