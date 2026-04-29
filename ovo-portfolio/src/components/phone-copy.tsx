'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhoneCopyProps {
  phone: string;
}

export function PhoneCopy({ phone }: PhoneCopyProps) {
  const t = useTranslations('hero');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  const label = copied ? t('phoneCopied') : t('copyPhone');

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-6 w-6 items-center justify-center rounded-sm transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--border-strong)]',
        copied ? 'text-accent' : 'text-foreground-subtle hover:text-accent'
      )}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <Copy className="h-3 w-3" aria-hidden />
      )}
    </button>
  );
}
