import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AdminShell } from '@/components/admin/admin-shell';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/admin/login');
  }

  const displayName = session.user.name ?? session.user.email ?? 'Admin';

  return <AdminShell userName={displayName}>{children}</AdminShell>;
}
