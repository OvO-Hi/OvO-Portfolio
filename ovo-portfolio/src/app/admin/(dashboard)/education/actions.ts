'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { educationStatusForward } from '@/lib/queries';
import type { Education } from '@/types';
import type { EducationActionState } from './types';

const MONTH_RE = /^\d{4}-\d{2}$/;
const VALID_STATUSES: Education['status'][] = [
  'enrolled',
  'graduated',
  'leave',
  'extra-semester',
  'graduation-deferred',
];

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
  schoolKo: string;
  schoolEn: string;
  majorKo: string;
  majorEn: string;
  status: Education['status'];
  startDate: string;
  endDate: string;
  gpaValue: string | null;
  gpaMax: string | null;
  gpaHidden: boolean | null;
}

interface ParseResult {
  data?: ParsedData;
  errors?: Record<string, string>;
}

function parseFormData(formData: FormData): ParseResult {
  const get = (k: string) => (formData.get(k) ?? '').toString().trim();
  const errors: Record<string, string> = {};

  const schoolKo = get('schoolKo');
  const schoolEn = get('schoolEn');
  const majorKo = get('majorKo');
  const majorEn = get('majorEn');
  const status = get('status') as Education['status'];
  const startDate = get('startDate');
  const endDate = get('endDate');
  const gpaValue = get('gpaValue');
  const gpaMax = get('gpaMax');
  const gpaHidden = formData.get('gpaHidden') === 'on';

  if (!schoolKo) errors.schoolKo = 'required';
  if (!schoolEn) errors.schoolEn = 'required';
  if (!majorKo) errors.majorKo = 'required';
  if (!majorEn) errors.majorEn = 'required';
  if (!status || !VALID_STATUSES.includes(status)) errors.status = 'required';
  if (!startDate) errors.startDate = 'required';
  else if (!MONTH_RE.test(startDate)) errors.startDate = 'invalidDate';
  if (!endDate) errors.endDate = 'required';
  else if (!MONTH_RE.test(endDate)) errors.endDate = 'invalidDate';

  let gpaFields: { gpaValue: string | null; gpaMax: string | null; gpaHidden: boolean | null };
  if (!gpaValue && !gpaMax) {
    gpaFields = { gpaValue: null, gpaMax: null, gpaHidden: null };
  } else if (gpaValue && gpaMax) {
    gpaFields = { gpaValue, gpaMax, gpaHidden };
  } else {
    if (!gpaValue) errors.gpaValue = 'required';
    if (!gpaMax) errors.gpaMax = 'required';
    gpaFields = { gpaValue: null, gpaMax: null, gpaHidden: null };
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    data: {
      schoolKo,
      schoolEn,
      majorKo,
      majorEn,
      status,
      startDate,
      endDate,
      ...gpaFields,
    },
  };
}

function toPrismaData(d: ParsedData) {
  return {
    schoolKo: d.schoolKo,
    schoolEn: d.schoolEn,
    majorKo: d.majorKo,
    majorEn: d.majorEn,
    status: educationStatusForward[d.status],
    startDate: d.startDate,
    endDate: d.endDate,
    gpaValue: d.gpaValue,
    gpaMax: d.gpaMax,
    gpaHidden: d.gpaHidden,
  };
}

export async function createEducation(
  _prev: EducationActionState,
  formData: FormData
): Promise<EducationActionState> {
  if (!(await isAdmin())) return { status: 'error', formError: 'unauthorized' };
  const parsed = parseFormData(formData);
  if (parsed.errors) return { status: 'error', errors: parsed.errors };
  try {
    await prisma.education.create({ data: toPrismaData(parsed.data!) });
  } catch {
    return { status: 'error', formError: 'saveFailed' };
  }
  revalidatePath('/', 'layout');
  return { status: 'success' };
}

export async function updateEducation(
  id: string,
  _prev: EducationActionState,
  formData: FormData
): Promise<EducationActionState> {
  if (!(await isAdmin())) return { status: 'error', formError: 'unauthorized' };
  const parsed = parseFormData(formData);
  if (parsed.errors) return { status: 'error', errors: parsed.errors };
  try {
    await prisma.education.update({ where: { id }, data: toPrismaData(parsed.data!) });
  } catch {
    return { status: 'error', formError: 'saveFailed' };
  }
  revalidatePath('/', 'layout');
  return { status: 'success' };
}

export async function deleteEducation(id: string): Promise<void> {
  if (!(await isAdmin())) return;
  try {
    await prisma.education.delete({ where: { id } });
  } catch {
    // swallow — UI would re-fetch and show no-op
  }
  revalidatePath('/', 'layout');
}
