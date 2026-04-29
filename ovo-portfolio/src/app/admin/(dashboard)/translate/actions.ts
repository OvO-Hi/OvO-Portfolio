'use server';

import { auth } from '@/auth';
import { getApiKey } from '@/lib/admin-queries';
import { callTranslate, type TranslateInput } from '@/lib/translate';

export type TranslateResult =
  | { ok: true; en: string }
  | { ok: false; error: 'unauthorized' | 'noApiKey' | 'koEmpty' | 'translateFailed' };

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

export async function translateKoToEn(input: TranslateInput): Promise<TranslateResult> {
  if (!(await isAdmin())) return { ok: false, error: 'unauthorized' };

  const apiKey = await getApiKey();
  if (!apiKey) return { ok: false, error: 'noApiKey' };

  return callTranslate(apiKey, input);
}
