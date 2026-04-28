import { getLocale, getTranslations } from 'next-intl/server';
import { getAbout } from '@/lib/queries';
import { SectionHeading } from './section-heading';
import type { Locale } from '@/types';

export async function About() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('about');
  const about = await getAbout();

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="container-prose scroll-mt-24 py-16 md:py-24"
    >
      <SectionHeading id="about-title" eyebrow="01" title={t('title')} />
      <div className="max-w-[68ch] space-y-4 text-body text-foreground-muted">
        {about.paragraphs[locale].map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}
