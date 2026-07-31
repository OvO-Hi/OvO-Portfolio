import { getLocale, getTranslations } from 'next-intl/server';
import { Download } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LocaleToggle } from '@/components/ui/locale-toggle';
import type { Locale } from '@/types';

export async function SiteHeader() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('footer');

  return (
    <div className="container-prose flex h-14 items-center justify-end gap-2 pt-4">
      <a
        href={`/api/resume?lang=${locale}`}
        download={`ori-portfolio-${locale}.pdf`}
        aria-label={t('downloadResume')}
        className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-accent bg-accent-subtle px-2.5 text-caption text-accent transition-colors duration-150 hover:bg-accent hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <Download className="h-4 w-4" aria-hidden />
        <span className="hidden font-mono sm:inline">PDF</span>
      </a>
      <LocaleToggle />
      <ThemeToggle />
    </div>
  );
}
