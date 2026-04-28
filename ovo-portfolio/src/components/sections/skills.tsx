import { useTranslations } from 'next-intl';
import { skillsSeed } from '@/data/skills-seed';
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

const PHASE_1_FEATURED: Set<string> = new Set([
  'java',
  'python',
  'javascript',
  'typescript',
  'react',
  'nextjs',
  'tailwind',
  'spring-boot',
  'flask',
  'jwt',
  'rest',
  'react-native',
  'postgresql',
  'mysql',
  'prisma',
  'claude',
  'gpt-4',
  'whisper',
  'dalle-3',
  'google-vision-ocr',
  'aws',
  'vercel',
  'docker',
  'git',
  'github',
  'figma',
  'notion',
  'cursor',
  'claude-code',
]);

export function Skills() {
  const t = useTranslations('skills');

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: skillsSeed.filter((s) => s.category === cat && PHASE_1_FEATURED.has(s.id)),
  })).filter((g) => g.items.length > 0);

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="container-prose scroll-mt-24 py-16 md:py-24"
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
