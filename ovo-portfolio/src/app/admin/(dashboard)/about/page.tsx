import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { getAbout } from '@/lib/queries';
import { AboutForm } from './about-form';

export const metadata = {
  title: 'Admin · About',
};

export default async function AdminAboutPage() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  const t = await getTranslations('admin.about');
  const about = await getAbout();

  return (
    <div className="mx-auto max-w-[820px] px-4 py-10 md:px-8 md:py-14">
      <header className="mb-8 space-y-1.5">
        <p className="font-mono text-caption text-foreground-subtle">
          {t('title')}
        </p>
        <h1 className="text-h2 text-foreground">{t('title')}</h1>
        <p className="text-body text-foreground-muted">{t('subtitle')}</p>
      </header>

      <AboutForm initial={about} />
    </div>
  );
}
