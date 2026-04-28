import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin',
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/admin/login');
  }

  const { name, email } = session.user;

  return (
    <main className="container-prose py-16 md:py-24">
      <div className="space-y-8">
        <header className="space-y-1.5">
          <p className="font-mono text-caption text-foreground-subtle">Admin</p>
          <h1 className="text-h2 text-foreground">Welcome, {name ?? email}</h1>
          {email ? (
            <p className="font-mono text-caption text-foreground-muted">{email}</p>
          ) : null}
        </header>

        <section
          aria-label="Admin placeholder"
          className="rounded-[8px] border border-border bg-background-subtle p-6"
        >
          <p className="text-body text-foreground-muted">
            Section CRUD lands in phase B.
          </p>
        </section>

        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/admin/login' });
          }}
        >
          <button
            type="submit"
            className="inline-flex h-10 items-center rounded-sm border border-border bg-transparent px-4 text-body text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
