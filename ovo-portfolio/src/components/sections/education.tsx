import { getLocale, getTranslations } from 'next-intl/server';
import { getEducations } from '@/lib/queries';
import { SectionHeading } from './section-heading';
import { Chip } from '@/components/ui/chip';
import { formatDateRange } from '@/lib/utils';
import type { Locale } from '@/types';

export async function Education() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('education');
  const educations = await getEducations();

  return (
    <section
      id="education"
      aria-labelledby="education-title"
      className="container-prose scroll-mt-24 py-16 md:py-24"
    >
      <SectionHeading id="education-title" eyebrow="02" title={t('title')} />
      <ul className="space-y-4">
        {educations.map((edu, i) => (
          <li
            key={i}
            className="flex flex-col gap-3 rounded-[8px] border border-border bg-background-subtle p-5 md:flex-row md:items-baseline md:justify-between md:p-6"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-h3 text-foreground">{edu.school[locale]}</h3>
                <Chip variant="accent">{t(`status.${edu.status}`)}</Chip>
              </div>
              <p className="text-body text-foreground-muted">{edu.major[locale]}</p>
              {edu.gpa && !edu.gpa.hidden ? (
                <p className="text-caption text-foreground-subtle">
                  <span className="font-mono">
                    {t('gpaLabel')} {edu.gpa.value} / {edu.gpa.max}
                  </span>
                </p>
              ) : null}
            </div>
            <p className="font-mono text-caption text-foreground-subtle md:text-right">
              {formatDateRange(edu.startDate, edu.endDate, 'month', locale)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
