import { useLocale, useTranslations } from 'next-intl';
import { aboutContent } from '@/data/dummy';
import { SectionHeading } from './section-heading';
import type { Locale } from '@/types';

export function About() {
  const locale = useLocale() as Locale;
  const t = useTranslations('about');

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="container-prose scroll-mt-24 py-16 md:py-24"
    >
      <SectionHeading id="about-title" eyebrow="01" title={t('title')} />
      <div className="max-w-[68ch] space-y-4 text-body text-foreground-muted">
        {aboutContent.paragraphs[locale].map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}
