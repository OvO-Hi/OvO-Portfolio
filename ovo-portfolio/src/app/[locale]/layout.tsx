import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getProfile } from '@/lib/queries';
import type { Locale } from '@/types';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!hasLocale(routing.locales, rawLocale)) return {};
  const locale = rawLocale as Locale;

  const profile = await getProfile();
  const title = `${profile.name[locale]} — Portfolio`;
  const description = profile.tagline[locale];
  const ogLocale = locale === 'ko' ? 'ko_KR' : 'en_US';

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ko: '/ko',
        en: '/en',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/${locale}`,
      locale: ogLocale,
      siteName: 'Ori Portfolio',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
}
