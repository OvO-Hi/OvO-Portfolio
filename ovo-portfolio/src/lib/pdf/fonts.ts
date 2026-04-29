import { Font } from '@react-pdf/renderer';

let registered = false;

const PRETENDARD_BASE =
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static';

export function registerPdfFonts() {
  if (registered) return;
  Font.register({
    family: 'Pretendard',
    fonts: [
      { src: `${PRETENDARD_BASE}/Pretendard-Regular.otf`, fontWeight: 400 },
      { src: `${PRETENDARD_BASE}/Pretendard-Medium.otf`, fontWeight: 500 },
      { src: `${PRETENDARD_BASE}/Pretendard-SemiBold.otf`, fontWeight: 600 },
      { src: `${PRETENDARD_BASE}/Pretendard-Bold.otf`, fontWeight: 700 },
    ],
  });
  // Disable hyphenation (otherwise long Korean words can wrap mid-character)
  Font.registerHyphenationCallback((word) => [word]);
  registered = true;
}
