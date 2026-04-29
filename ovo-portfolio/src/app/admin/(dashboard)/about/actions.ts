'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import type { AboutActionState } from './types';

const SINGLETON_ID = 'default';

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function readListRaw(formData: FormData, name: string): string[] {
  return formData.getAll(name).map((v) => v.toString().trim());
}

export async function updateAbout(
  _prev: AboutActionState,
  formData: FormData
): Promise<AboutActionState> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email || !getAdminEmails().includes(email)) {
    return { status: 'error', formError: 'unauthorized' };
  }

  const koRaw = readListRaw(formData, 'paragraphsKo');
  const enRaw = readListRaw(formData, 'paragraphsEn');
  const len = Math.max(koRaw.length, enRaw.length);

  // Zip + filter: keep paragraphs where at least one side has content (index aligned).
  const pairs: Array<{ ko: string; en: string }> = [];
  for (let i = 0; i < len; i++) {
    const ko = koRaw[i] ?? '';
    const en = enRaw[i] ?? '';
    if (ko || en) pairs.push({ ko, en });
  }
  const paragraphsKo = pairs.map((p) => p.ko);
  const paragraphsEn = pairs.map((p) => p.en);

  try {
    await prisma.aboutContent.upsert({
      where: { id: SINGLETON_ID },
      update: { paragraphsKo, paragraphsEn },
      create: { id: SINGLETON_ID, paragraphsKo, paragraphsEn },
    });
  } catch {
    return { status: 'error', formError: 'saveFailed' };
  }

  revalidatePath('/', 'layout');
  return { status: 'success' };
}
