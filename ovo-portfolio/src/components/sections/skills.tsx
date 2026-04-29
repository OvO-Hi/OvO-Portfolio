import { getTranslations } from 'next-intl/server';
import { getSkills } from '@/lib/queries';
import { SectionHeading } from './section-heading';
import { Chip } from '@/components/ui/chip';
import type { SkillCategory } from '@/types';

const CATEGORY_ORDER: SkillCategory[] = [
  'language',
  'frontend',
  'backend',
  'mobile',
  'database',
  'ai',
  'devops',
  'tool',
];

export async function Skills() {
  const t = await getTranslations('skills');
  // getSkills already filters by visibility (ALWAYS_SHOW or AUTO+used)
  const skills = await getSkills();

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: skills.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0);

  if (grouped.length === 0) return null;

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="container-prose scroll-mt-24 py-12 md:py-16"
    >
      <SectionHeading id="skills-title" eyebrow="03" title={t('title')} />
      <div className="space-y-6">
        {grouped.map((g) => (
          <div key={g.category} className="grid gap-3 md:grid-cols-[180px_1fr] md:gap-6">
            <h3 className="text-h3 text-foreground-muted">{t(`category.${g.category}`)}</h3>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((s) => (
                <li key={s.id}>
                  <Chip>{s.name}</Chip>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
