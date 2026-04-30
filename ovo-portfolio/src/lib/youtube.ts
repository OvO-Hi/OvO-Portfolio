/**
 * Extract a YouTube video id from any of these URL forms:
 *  - https://www.youtube.com/watch?v=ID(&...)
 *  - https://youtube.com/watch?v=ID
 *  - https://youtu.be/ID(?si=...)
 *  - https://www.youtube.com/embed/ID
 *  - https://(www.)youtube.com/shorts/ID(?si=...)
 *  - https://m.youtube.com/... (mobile)
 *
 * Returns null if the URL is not a recognised YouTube URL.
 */
export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, '').replace(/^m\./, '');

  if (host === 'youtu.be') {
    const id = parsed.pathname.slice(1).split('/')[0];
    return isValidId(id) ? id : null;
  }

  if (host !== 'youtube.com') return null;

  // /watch?v=ID
  if (parsed.pathname === '/watch') {
    const id = parsed.searchParams.get('v') ?? '';
    return isValidId(id) ? id : null;
  }

  // /embed/ID  or  /shorts/ID  or  /v/ID
  const segments = parsed.pathname.split('/').filter(Boolean);
  if (segments.length >= 2 && ['embed', 'shorts', 'v'].includes(segments[0])) {
    const id = segments[1];
    return isValidId(id) ? id : null;
  }

  return null;
}

const ID_RE = /^[A-Za-z0-9_-]{6,}$/;

function isValidId(id: string): boolean {
  return Boolean(id) && ID_RE.test(id);
}

export function toYoutubeEmbedUrl(url: string): string | null {
  const id = extractYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

/** True if the URL points to a YouTube Shorts (9:16). */
export function isYoutubeShorts(url: string): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return /\/shorts\//.test(u.pathname);
  } catch {
    return false;
  }
}
