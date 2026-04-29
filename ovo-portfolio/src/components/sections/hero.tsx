import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { Mail, Phone } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';
import { getProfile } from '@/lib/queries';
import type { Locale } from '@/types';

export async function Hero() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('hero');
  const profile = await getProfile();

  return (
    <section className="container-prose pt-16 pb-0 md:pt-20 md:pb-0" aria-labelledby="hero-name">
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12">
        {profile.profileImage ? (
          <div className="relative h-[160px] w-[160px] shrink-0 overflow-hidden rounded-full border-2 border-border bg-background-muted md:h-[200px] md:w-[200px]">
            <Image
              src={profile.profileImage}
              alt={profile.name[locale]}
              fill
              sizes="(min-width: 768px) 200px, 160px"
              priority
              className="object-cover"
            />
          </div>
        ) : (
          <div
            aria-hidden
            className="relative h-[160px] w-[160px] shrink-0 overflow-hidden rounded-full border-2 border-border bg-background-muted md:h-[200px] md:w-[200px]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-[44px] font-medium tracking-tight text-foreground-subtle md:text-[56px]">
                OvO
              </span>
            </div>
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, var(--accent-subtle), transparent 60%)',
              }}
            />
          </div>
        )}

        <div className="flex flex-col gap-4">
          <h1
            id="hero-name"
            className="text-display text-balance text-foreground"
          >
            {profile.name[locale]}
          </h1>
          <p className="max-w-[40ch] text-h3 font-normal text-foreground-muted text-balance">
            {profile.tagline[locale]}
          </p>

          <ul className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-foreground-muted">
            <li>
              <a
                href={`mailto:${profile.email}`}
                aria-label={`${t('contactEmail')}: ${profile.email}`}
                className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:text-accent"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden />
                <span className="font-mono">{profile.email}</span>
              </a>
            </li>
            <li>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`${t('contactGithub')}: ${profile.github}`}
                className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:text-accent"
              >
                <GithubIcon className="h-3.5 w-3.5" aria-hidden />
                <span className="font-mono">GitHub</span>
              </a>
            </li>
            <li className="group inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" aria-hidden />
              <span className="font-mono opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100">
                {profile.phone}
              </span>
              <span className="font-mono group-hover:hidden focus-within:hidden">
                {t('contactPhone')}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
