import { getLocale, getTranslations } from 'next-intl/server';
import { getExperiences } from '@/lib/queries';
import { SectionHeading } from './section-heading';
import { formatDateRange } from '@/lib/utils';
import type { Locale } from '@/types';

export async function Experience() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('experience');
  const experiences = await getExperiences();

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="container-prose scroll-mt-24 py-16 md:py-24"
    >
      <SectionHeading id="experience-title" eyebrow="05" title={t('title')} />
      <ol className="relative space-y-6 border-l border-border pl-6">
        {experiences.map((exp) => (
          <li key={exp.id} className="relative">
            <span
              className="absolute -left-[27px] top-2 h-2 w-2 rounded-full bg-accent"
              aria-hidden
            />
            <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
              <h3 className="text-h3 text-foreground">
                {exp.organization[locale]}{' '}
                <span className="font-normal text-foreground-muted">· {exp.role[locale]}</span>
              </h3>
              <p className="font-mono text-caption text-foreground-subtle">
                {formatDateRange(exp.startDate, exp.endDate, 'month', locale)}
              </p>
            </div>
            <p className="mt-1 max-w-[68ch] text-body text-foreground-muted">
              {exp.description[locale]}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
