import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { getCertificationsForAdmin } from '@/lib/admin-queries';
import { CertificationManager } from './certification-manager';

export const metadata = {
  title: 'Admin · Awards',
};

export default async function AdminCertificationsPage() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  const t = await getTranslations('admin.certifications');
  const items = await getCertificationsForAdmin();

  return (
    <div className="mx-auto max-w-[920px] px-4 py-10 md:px-8 md:py-14">
      <header className="mb-8 space-y-1.5">
        <p className="font-mono text-caption text-foreground-subtle">{t('title')}</p>
        <h1 className="text-h2 text-foreground">{t('title')}</h1>
        <p className="text-body text-foreground-muted">{t('subtitle')}</p>
      </header>

      <CertificationManager items={items} />
    </div>
  );
}
