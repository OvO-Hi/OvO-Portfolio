'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import type { ExperienceActionState } from './types';

const MONTH_RE = /^\d{4}-\d{2}$/;

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

interface ParsedData {
  organizationKo: string;
  organizationEn: string;
  roleKo: string;
  roleEn: string;
  startDate: string;
  endDate: string | null;
  descriptionKo: string;
  descriptionEn: string;
  imageUrl: string | null;
  projectId: string | null;
}

interface ParseResult {
  data?: ParsedData;
  errors?: Record<string, string>;
}

function parseFormData(formData: FormData): ParseResult {
  const get = (k: string) => (formData.get(k) ?? '').toString().trim();
  const errors: Record<string, string> = {};

  const organizationKo = get('organizationKo');
  const organizationEn = get('organizationEn');
  const roleKo = get('roleKo');
  const roleEn = get('roleEn');
  const startDate = get('startDate');
  const endDateRaw = get('endDate');
  const isPresent = formData.get('isPresent') === 'on';
  const descriptionKo = get('descriptionKo');
  const descriptionEn = get('descriptionEn');
  const imageUrl = get('imageUrl') || null;
  const projectId = get('projectId') || null;

  if (!organizationKo) errors.organizationKo = 'required';
  if (!organizationEn) errors.organizationEn = 'required';
  if (!startDate) errors.startDate = 'required';
  else if (!MONTH_RE.test(startDate)) errors.startDate = 'invalidDate';

  let endDate: string | null = null;
  if (!isPresent) {
    if (!endDateRaw) errors.endDate = 'required';
    else if (!MONTH_RE.test(endDateRaw)) errors.endDate = 'invalidDate';
    else endDate = endDateRaw;
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    data: {
      organizationKo,
      organizationEn,
      roleKo,
      roleEn,
      startDate,
      endDate,
      descriptionKo,
      descriptionEn,
      imageUrl,
      projectId,
    },
  };
}

export async function createExperience(
  _prev: ExperienceActionState,
  formData: FormData
): Promise<ExperienceActionState> {
  if (!(await isAdmin())) return { status: 'error', formError: 'unauthorized' };
  const parsed = parseFormData(formData);
  if (parsed.errors) return { status: 'error', errors: parsed.errors };
  try {
    await prisma.experience.create({ data: parsed.data! });
  } catch {
    return { status: 'error', formError: 'saveFailed' };
  }
  revalidatePath('/', 'layout');
  return { status: 'success' };
}

export async function updateExperience(
  id: string,
  _prev: ExperienceActionState,
  formData: FormData
): Promise<ExperienceActionState> {
  if (!(await isAdmin())) return { status: 'error', formError: 'unauthorized' };
  const parsed = parseFormData(formData);
  if (parsed.errors) return { status: 'error', errors: parsed.errors };
  try {
    await prisma.experience.update({ where: { id }, data: parsed.data! });
  } catch {
    return { status: 'error', formError: 'saveFailed' };
  }
  revalidatePath('/', 'layout');
  return { status: 'success' };
}

export async function deleteExperience(id: string): Promise<void> {
  if (!(await isAdmin())) return;
  try {
    await prisma.experience.delete({ where: { id } });
  } catch {
    // swallow
  }
  revalidatePath('/', 'layout');
}
