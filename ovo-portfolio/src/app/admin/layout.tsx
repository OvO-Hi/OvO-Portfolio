import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import koMessages from '@/messages/ko.json';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="ko" messages={koMessages}>
      {children}
    </NextIntlClientProvider>
  );
}
