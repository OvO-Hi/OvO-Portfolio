import { getLocale, getTranslations } from 'next-intl/server';
import { Download, Mail } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';
import { SecretTrigger } from '@/components/secret-trigger';
import { getProfile } from '@/lib/queries';
import type { Locale } from '@/types';

export async function Footer() {
  const t = await getTranslations('footer');
  const locale = (await getLocale()) as Locale;
  const profile = await getProfile();

  return (
    <footer className="border-t border-border mt-16 md:mt-24">
      <div className="container-prose flex flex-col items-start justify-between gap-4 py-10 md:flex-row md:items-center">
        <p className="font-mono text-caption text-foreground-subtle">
          <SecretTrigger>{t('copyright')}</SecretTrigger>
        </p>
        <ul className="flex flex-wrap items-center gap-4 text-caption text-foreground-muted">
          <li>
            <a
              href={`/api/resume?lang=${locale}`}
              download={`ori-portfolio-${locale}.pdf`}
              className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:text-accent"
            >
              <Download className="h-3.5 w-3.5" aria-hidden />
              <span className="font-mono">{t('downloadResume')}</span>
            </a>
          </li>
          {profile.email ? (
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:text-accent"
                aria-label={profile.email}
              >
                <Mail className="h-3.5 w-3.5" aria-hidden />
                <span className="font-mono">Email</span>
              </a>
            </li>
          ) : null}
          {profile.github ? (
            <li>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:text-accent"
                aria-label="GitHub"
              >
                <GithubIcon className="h-3.5 w-3.5" aria-hidden />
                <span className="font-mono">GitHub</span>
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </footer>
  );
}
