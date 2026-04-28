'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export type AboutActionState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; formError?: string };

const SINGLETON_ID = 'default';

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function readList(formData: FormData, name: string): string[] {
  return formData
    .getAll(name)
    .map((v) => v.toString().trim())
    .filter((v) => v.length > 0);
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

  const paragraphsKo = readList(formData, 'paragraphsKo');
  const paragraphsEn = readList(formData, 'paragraphsEn');

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
