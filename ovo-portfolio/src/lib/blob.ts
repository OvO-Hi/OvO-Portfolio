import { put, del } from '@vercel/blob';

export const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export type ImageValidationCode =
  | 'invalidType'
  | 'tooLarge'
  | 'empty'
  | 'unknown';

export interface ImageValidationError {
  code: ImageValidationCode;
}

export function validateImage(file: File): ImageValidationError | null {
  if (!file || file.size === 0) return { code: 'empty' };
  if (file.size > MAX_BYTES) return { code: 'tooLarge' };
  if (!(ALLOWED_MIME as readonly string[]).includes(file.type)) {
    return { code: 'invalidType' };
  }
  return null;
}

function safeName(name: string): string {
  // Strip path separators and weird chars; keep extension
  const cleaned = name.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  return cleaned || 'file';
}

export async function uploadImage(file: File, prefix: string): Promise<string> {
  const random = Math.random().toString(36).slice(2, 10);
  const filename = `${prefix.replace(/^\/+|\/+$/g, '')}/${random}-${safeName(file.name)}`;
  const blob = await put(filename, file, {
    access: 'public',
    contentType: file.type,
    addRandomSuffix: false,
  });
  return blob.url;
}

const BLOB_HOST_RE = /\.public\.blob\.vercel-storage\.com$/;

export async function deleteImageIfBlob(url: string | null | undefined): Promise<void> {
  if (!url) return;
  try {
    const u = new URL(url);
    if (!BLOB_HOST_RE.test(u.hostname)) return;
    await del(url);
  } catch {
    // ignore — best-effort cleanup
  }
}
