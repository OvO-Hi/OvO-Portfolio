import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin',
};

export default async function AdminHomePage() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  const t = await getTranslations('admin');
  const displayName = session.user.name ?? session.user.email ?? 'Admin';

  return (
    <div className="mx-auto max-w-[820px] px-4 py-10 md:px-8 md:py-14">
      <div className="space-y-3">
        <p className="font-mono text-caption text-foreground-subtle">{t('home.title')}</p>
        <h1 className="text-h2 text-foreground">
          {t('home.welcome', { name: displayName })}
        </h1>
        <p className="text-body text-foreground-muted">{t('home.hint')}</p>
      </div>
    </div>
  );
}
