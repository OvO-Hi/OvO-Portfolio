'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import type { SkillCategory } from '@/types';
import type { SkillActionState } from './types';

const ID_RE = /^[a-z0-9-]+$/;
const VALID_CATEGORIES: SkillCategory[] = [
  'language',
  'frontend',
  'backend',
  'mobile',
  'database',
  'ai',
  'devops',
  'tool',
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

function toKebab(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

export async function createSkill(
  _prev: SkillActionState,
  formData: FormData
): Promise<SkillActionState> {
  if (!(await isAdmin())) return { status: 'error', formError: 'unauthorized' };

  const get = (k: string) => (formData.get(k) ?? '').toString().trim();
  const name = get('name');
  const explicitId = get('id');
  const category = get('category') as SkillCategory;
  const iconKey = get('iconKey');

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'required';
  if (!category || !VALID_CATEGORIES.includes(category)) errors.category = 'required';

  const id = explicitId || (name ? toKebab(name) : '');
  if (!id) {
    errors.id = 'required';
  } else if (!ID_RE.test(id)) {
    errors.id = 'idInvalid';
  }

  if (id && ID_RE.test(id) && !errors.id) {
    const existing = await prisma.skill.findUnique({ where: { id } });
    if (existing) errors.id = 'idTaken';
  }

  if (Object.keys(errors).length > 0) return { status: 'error', errors };

  try {
    await prisma.skill.create({
      data: {
        id,
        name,
        category,
        iconKey: iconKey || null,
        order: 999,
      },
    });
  } catch {
    return { status: 'error', formError: 'saveFailed' };
  }

  revalidatePath('/', 'layout');
  return { status: 'success' };
}

export async function updateSkill(
  id: string,
  _prev: SkillActionState,
  formData: FormData
): Promise<SkillActionState> {
  if (!(await isAdmin())) return { status: 'error', formError: 'unauthorized' };

  const existing = await prisma.skill.findUnique({ where: { id } });
  if (!existing) return { status: 'error', formError: 'saveFailed' };
  if (existing.isSystem) {
    return { status: 'error', formError: 'systemSkillProtected' };
  }

  const get = (k: string) => (formData.get(k) ?? '').toString().trim();
  const name = get('name');
  const iconKey = get('iconKey');

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'required';

  if (Object.keys(errors).length > 0) return { status: 'error', errors };

  try {
    await prisma.skill.update({
      where: { id },
      data: { name, iconKey: iconKey || null },
    });
  } catch {
    return { status: 'error', formError: 'saveFailed' };
  }

  revalidatePath('/', 'layout');
  return { status: 'success' };
}

export async function deleteSkill(id: string): Promise<void> {
  if (!(await isAdmin())) return;

  const existing = await prisma.skill.findUnique({ where: { id } });
  if (!existing || existing.isSystem) return;

  try {
    await prisma.$transaction([
      prisma.projectSkill.deleteMany({ where: { skillId: id } }),
      prisma.skill.delete({ where: { id } }),
    ]);
  } catch {
    // swallow — UI re-fetches
  }
  revalidatePath('/', 'layout');
}

export async function createSkillQuick(
  name: string
): Promise<{ id: string; name: string; category: SkillCategory } | null> {
  if (!(await isAdmin())) return null;

  const trimmed = name.trim();
  if (!trimmed) return null;

  let id = toKebab(trimmed);
  if (!id) {
    id = `skill-${Date.now().toString(36)}`;
  }
  if (!ID_RE.test(id)) return null;

  try {
    const skill = await prisma.skill.upsert({
      where: { id },
      update: {},
      create: { id, name: trimmed, category: 'tool', order: 999 },
    });
    revalidatePath('/', 'layout');
    return { id: skill.id, name: skill.name, category: skill.category };
  } catch {
    return null;
  }
}
