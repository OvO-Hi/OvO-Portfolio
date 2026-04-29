'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface SecretTriggerProps {
  children: ReactNode;
}

export function SecretTrigger({ children }: SecretTriggerProps) {
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        router.push('/admin/login');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router]);

  return (
    <span onDoubleClick={() => router.push('/admin/login')}>{children}</span>
  );
}
