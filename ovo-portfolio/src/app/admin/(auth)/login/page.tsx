import { signIn, auth } from '@/auth';
import { redirect } from 'next/navigation';
import { GithubIcon } from '@/components/ui/icons';

export const metadata = {
  title: 'Admin · Sign in',
};

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect('/admin');
  }

  return (
    <main className="container-prose flex min-h-screen items-center justify-center py-16">
      <div className="w-full max-w-[380px] space-y-6 rounded-[8px] border border-border bg-background-subtle p-8">
        <div className="space-y-1.5">
          <h1 className="text-h2 text-foreground">Admin</h1>
          <p className="text-body text-foreground-muted">
            Sign in to manage portfolio content.
          </p>
        </div>
        <form
          action={async () => {
            'use server';
            await signIn('github', { redirectTo: '/admin' });
          }}
        >
          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-foreground px-4 text-body font-medium text-background transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            <GithubIcon className="h-4 w-4" aria-hidden />
            <span>Sign in with GitHub</span>
          </button>
        </form>
      </div>
    </main>
  );
}
