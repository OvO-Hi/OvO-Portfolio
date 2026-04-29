'use server';

import { auth } from '@/auth';
import { uploadImage, validateImage } from './blob';

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; code: 'unauthorized' | 'imageInvalidType' | 'imageTooLarge' | 'imageEmpty' | 'uploadFailed' };

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

async function isAdmin(): Promise<boolean> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  return Boolean(email && getAdminEmails().includes(email));
}

const ALLOWED_PREFIXES = /^[a-z0-9][a-z0-9_/-]*$/i;

export async function uploadImageAction(formData: FormData): Promise<UploadResult> {
  if (!(await isAdmin())) return { ok: false, code: 'unauthorized' };

  const file = formData.get('file');
  const prefixRaw = (formData.get('prefix') ?? '').toString().trim();
  const prefix = ALLOWED_PREFIXES.test(prefixRaw) ? prefixRaw : 'misc';

  if (!(file instanceof File)) return { ok: false, code: 'imageEmpty' };

  const validation = validateImage(file);
  if (validation) {
    if (validation.code === 'invalidType') return { ok: false, code: 'imageInvalidType' };
    if (validation.code === 'tooLarge') return { ok: false, code: 'imageTooLarge' };
    if (validation.code === 'empty') return { ok: false, code: 'imageEmpty' };
    return { ok: false, code: 'uploadFailed' };
  }

  try {
    const url = await uploadImage(file, prefix);
    return { ok: true, url };
  } catch {
    return { ok: false, code: 'uploadFailed' };
  }
}
