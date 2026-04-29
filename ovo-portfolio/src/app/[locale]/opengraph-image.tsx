import { ImageResponse } from 'next/og';
import { getProfile } from '@/lib/queries';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/types';

export const runtime = 'nodejs';
export const alt = 'Portfolio cover';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const PRETENDARD_BASE =
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static';

interface OgImageProps {
  params: Promise<{ locale: string }>;
}

export default async function OpengraphImage({ params }: OgImageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = hasLocale(routing.locales, rawLocale) ? rawLocale : routing.defaultLocale;

  const profile = await getProfile();

  const [regular, bold] = await Promise.all([
    fetch(`${PRETENDARD_BASE}/Pretendard-Regular.otf`).then((r) => r.arrayBuffer()),
    fetch(`${PRETENDARD_BASE}/Pretendard-Bold.otf`).then((r) => r.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0a0a0a',
          color: '#fafafa',
          padding: 80,
          fontFamily: 'Pretendard',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            color: '#6b8cc4',
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: '#6b8cc4',
            }}
          />
          Portfolio
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            {profile.name[locale]}
          </div>
          <div
            style={{
              fontSize: 36,
              color: '#a3a3a3',
              lineHeight: 1.3,
              maxWidth: 880,
            }}
          >
            {profile.tagline[locale]}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#525252',
            fontSize: 22,
            fontFamily: 'Pretendard',
            borderTop: '1px solid #262626',
            paddingTop: 32,
          }}
        >
          <span>{profile.email}</span>
          <span style={{ color: '#6b8cc4' }}>
            {profile.github.replace(/^https?:\/\//, '')}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Pretendard', data: regular, weight: 400, style: 'normal' },
        { name: 'Pretendard', data: bold, weight: 700, style: 'normal' },
      ],
    }
  );
}
