import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Server Action body 기본 제한은 1MB. 이미지 업로드(최대 5MB)가 서버에 도달하도록 상향.
    // multipart 오버헤드 여유를 두어 6MB.
    serverActions: { bodySizeLimit: '6mb' },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
