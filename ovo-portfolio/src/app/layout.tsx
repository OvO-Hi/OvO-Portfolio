import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { inter, geistMono } from '@/lib/fonts';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ori — Portfolio',
    template: '%s — Ori Portfolio',
  },
  description: 'Backend developer & team lead. Senior at Ewha Computer Engineering.',
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning className={`${inter.variable} ${geistMono.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
