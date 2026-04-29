import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { SettingsForm } from './settings-form';
import { getMaskedSettings } from './actions';

export const metadata = {
  title: 'Admin · Settings',
};

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  const t = await getTranslations('admin.settings');
  const settings = await getMaskedSettings();

  return (
    <div className="mx-auto max-w-[820px] px-4 py-10 md:px-8 md:py-14">
      <header className="mb-8 space-y-1.5">
        <p className="font-mono text-caption text-foreground-subtle">{t('title')}</p>
        <h1 className="text-h2 text-foreground">{t('title')}</h1>
        <p className="text-body text-foreground-muted">{t('subtitle')}</p>
      </header>

      <SettingsForm initial={settings} />
    </div>
  );
}
