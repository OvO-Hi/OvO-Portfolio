'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import type { Certification } from '@/types';
import type { CertificationActionState } from './types';

const MONTH_RE = /^\d{4}-\d{2}$/;
const VALID_TYPES: Certification['type'][] = ['certification', 'language', 'award'];

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
  nameKo: string;
  nameEn: string;
  issuerKo: string;
  issuerEn: string;
  type: Certification['type'];
  date: string;
  score: string | null;
}

interface ParseResult {
  data?: ParsedData;
  errors?: Record<string, string>;
}

function parseFormData(formData: FormData): ParseResult {
  const get = (k: string) => (formData.get(k) ?? '').toString().trim();
  const errors: Record<string, string> = {};

  const nameKo = get('nameKo');
  const nameEn = get('nameEn');
  const issuerKo = get('issuerKo');
  const issuerEn = get('issuerEn');
  const type = get('type') as Certification['type'];
  const date = get('date');
  const score = get('score');

  if (!nameKo) errors.nameKo = 'required';
  if (!nameEn) errors.nameEn = 'required';
  if (!issuerKo) errors.issuerKo = 'required';
  if (!issuerEn) errors.issuerEn = 'required';
  if (!type || !VALID_TYPES.includes(type)) errors.type = 'required';
  if (!date) errors.date = 'required';
  else if (!MONTH_RE.test(date)) errors.date = 'invalidDate';

  if (Object.keys(errors).length > 0) return { errors };

  return {
    data: {
      nameKo,
      nameEn,
      issuerKo,
      issuerEn,
      type,
      date,
      score: score || null,
    },
  };
}

export async function createCertification(
  _prev: CertificationActionState,
  formData: FormData
): Promise<CertificationActionState> {
  if (!(await isAdmin())) return { status: 'error', formError: 'unauthorized' };
  const parsed = parseFormData(formData);
  if (parsed.errors) return { status: 'error', errors: parsed.errors };
  try {
    await prisma.certification.create({ data: parsed.data! });
  } catch {
    return { status: 'error', formError: 'saveFailed' };
  }
  revalidatePath('/', 'layout');
  return { status: 'success' };
}

export async function updateCertification(
  id: string,
  _prev: CertificationActionState,
  formData: FormData
): Promise<CertificationActionState> {
  if (!(await isAdmin())) return { status: 'error', formError: 'unauthorized' };
  const parsed = parseFormData(formData);
  if (parsed.errors) return { status: 'error', errors: parsed.errors };
  try {
    await prisma.certification.update({ where: { id }, data: parsed.data! });
  } catch {
    return { status: 'error', formError: 'saveFailed' };
  }
  revalidatePath('/', 'layout');
  return { status: 'success' };
}

export async function deleteCertification(id: string): Promise<void> {
  if (!(await isAdmin())) return;
  try {
    await prisma.certification.delete({ where: { id } });
  } catch {
    // swallow
  }
  revalidatePath('/', 'layout');
}
