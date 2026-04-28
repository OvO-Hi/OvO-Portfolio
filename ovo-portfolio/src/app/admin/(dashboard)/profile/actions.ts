'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export type ProfileActionState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; errors?: Record<string, string>; formError?: string };

const SINGLETON_ID = 'default';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function updateProfile(
  _prev: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email || !getAdminEmails().includes(email)) {
    return { status: 'error', formError: 'unauthorized' };
  }

  const get = (k: string) => (formData.get(k) ?? '').toString().trim();
  const data = {
    nameKo: get('nameKo'),
    nameEn: get('nameEn'),
    taglineKo: get('taglineKo'),
    taglineEn: get('taglineEn'),
    email: get('email'),
    phone: get('phone'),
    github: get('github'),
    profileImage: get('profileImage'),
  };

  const errors: Record<string, string> = {};
  for (const k of ['nameKo', 'nameEn', 'taglineKo', 'taglineEn', 'email'] as const) {
    if (!data[k]) errors[k] = 'required';
  }
  if (data.email && !EMAIL_RE.test(data.email)) errors.email = 'invalidEmail';
  if (data.github && !URL_RE.test(data.github)) errors.github = 'invalidUrl';
  if (data.profileImage && !URL_RE.test(data.profileImage)) errors.profileImage = 'invalidUrl';

  if (Object.keys(errors).length > 0) {
    return { status: 'error', errors };
  }

  try {
    await prisma.profile.update({
      where: { id: SINGLETON_ID },
      data,
    });
  } catch {
    return { status: 'error', formError: 'saveFailed' };
  }

  revalidatePath('/', 'layout');
  return { status: 'success' };
}
