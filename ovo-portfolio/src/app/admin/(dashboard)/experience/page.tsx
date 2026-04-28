import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { getExperiencesForAdmin } from '@/lib/admin-queries';
import { ExperienceManager } from './experience-manager';

export const metadata = {
  title: 'Admin · Experience',
};

export default async function AdminExperiencePage() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  const t = await getTranslations('admin.experience');
  const items = await getExperiencesForAdmin();

  return (
    <div className="mx-auto max-w-[920px] px-4 py-10 md:px-8 md:py-14">
      <header className="mb-8 space-y-1.5">
        <p className="font-mono text-caption text-foreground-subtle">{t('title')}</p>
        <h1 className="text-h2 text-foreground">{t('title')}</h1>
        <p className="text-body text-foreground-muted">{t('subtitle')}</p>
      </header>

      <ExperienceManager items={items} />
    </div>
  );
}
