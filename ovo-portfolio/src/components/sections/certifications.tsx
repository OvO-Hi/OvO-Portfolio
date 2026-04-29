import { getLocale, getTranslations } from 'next-intl/server';
import { getCertifications } from '@/lib/queries';
import { SectionHeading } from './section-heading';
import { Chip } from '@/components/ui/chip';
import type { Locale } from '@/types';

export async function Certifications() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('certifications');
  const certifications = await getCertifications();

  return (
    <section
      id="certifications"
      aria-labelledby="certifications-title"
      className="container-prose scroll-mt-24 py-12 md:py-16"
    >
      <SectionHeading id="certifications-title" eyebrow="04" title={t('title')} />
      <ul className="grid gap-3 md:grid-cols-2">
        {certifications.map((c, i) => (
          <li
            key={i}
            className="flex items-start justify-between gap-4 rounded-[8px] border border-border bg-background-subtle p-5"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-h3 text-foreground">{c.name[locale]}</h3>
                <Chip variant="subtle">{t(`type.${c.type}`)}</Chip>
              </div>
              <p className="text-caption text-foreground-muted">{c.issuer[locale]}</p>
              {c.score ? (
                <p className="text-caption text-foreground-subtle">
                  <span className="font-mono">
                    {t('scoreLabel')} · {c.score}
                  </span>
                </p>
              ) : null}
            </div>
            <p className="shrink-0 font-mono text-caption text-foreground-subtle">{c.date}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
