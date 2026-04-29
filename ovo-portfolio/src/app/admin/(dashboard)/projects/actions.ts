'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import type { Project } from '@/types';
import type { IssueDraft, ProjectActionState } from './types';

const SLUG_RE = /^[a-z0-9-]+$/;
const URL_RE = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
const MONTH_RE = /^\d{4}-\d{2}$/;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

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

function toKebab(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function isValidDate(value: string, granularity: Project['dateGranularity']): boolean {
  return granularity === 'day' ? DAY_RE.test(value) : MONTH_RE.test(value);
}

interface ParsedProjectData {
  slug: string;
  titleKo: string;
  titleEn: string;
  oneLinerKo: string;
  oneLinerEn: string;
  startDate: string;
  endDate: string;
  dateGranularity: Project['dateGranularity'];
  roleKo: string | null;
  roleEn: string | null;
  teamSize: number | null;
  contribution: number | null;
  descriptionKo: string;
  descriptionEn: string;
  demoUrl: string | null;
  githubUrl: string | null;
  thumbnailUrl: string | null;
  pinned: boolean;
  visible: boolean;
  order: number;
  skillIds: string[];
  issues: IssueDraft[];
}

interface ParseResult {
  data?: ParsedProjectData;
  errors?: Record<string, string>;
}

function parseFormData(formData: FormData): ParseResult {
  const get = (k: string) => (formData.get(k) ?? '').toString().trim();
  const getRaw = (k: string) => formData.get(k)?.toString();
  const errors: Record<string, string> = {};

  let slug = get('slug');
  const titleKo = get('titleKo');
  const titleEn = get('titleEn');
  const oneLinerKo = get('oneLinerKo');
  const oneLinerEn = get('oneLinerEn');
  const startDate = get('startDate');
  const endDate = get('endDate');
  const dateGranularity = (get('dateGranularity') || 'month') as Project['dateGranularity'];
  const roleKo = get('roleKo');
  const roleEn = get('roleEn');
  const teamSizeRaw = get('teamSize');
  const contributionRaw = get('contribution');
  const descriptionKo = get('descriptionKo');
  const descriptionEn = get('descriptionEn');
  const demoUrl = get('demoUrl');
  const githubUrl = get('githubUrl');
  const thumbnailUrl = get('thumbnailUrl');
  const pinned = formData.get('pinned') === 'on';
  const visible = formData.get('visible') === 'on';
  const orderRaw = get('order');

  if (!slug && titleEn) slug = toKebab(titleEn);
  if (!slug) errors.slug = 'required';
  else if (!SLUG_RE.test(slug)) errors.slug = 'slugInvalid';

  if (!titleKo) errors.titleKo = 'required';
  if (!titleEn) errors.titleEn = 'required';
  if (!oneLinerKo) errors.oneLinerKo = 'required';
  if (!oneLinerEn) errors.oneLinerEn = 'required';
  if (!descriptionKo) errors.descriptionKo = 'required';
  if (!descriptionEn) errors.descriptionEn = 'required';

  if (dateGranularity !== 'month' && dateGranularity !== 'day') {
    errors.dateGranularity = 'required';
  }

  if (!startDate) errors.startDate = 'required';
  else if (!isValidDate(startDate, dateGranularity)) errors.startDate = 'invalidDate';
  if (!endDate) errors.endDate = 'required';
  else if (!isValidDate(endDate, dateGranularity)) errors.endDate = 'invalidDate';

  let teamSize: number | null = null;
  if (teamSizeRaw) {
    const n = Number.parseInt(teamSizeRaw, 10);
    if (Number.isFinite(n) && n > 0) teamSize = n;
    else errors.teamSize = 'rangeInvalid';
  }

  let contribution: number | null = null;
  if (contributionRaw) {
    const n = Number.parseInt(contributionRaw, 10);
    if (Number.isFinite(n) && n >= 1 && n <= 100) contribution = n;
    else errors.contribution = 'rangeInvalid';
  }

  if (demoUrl && !URL_RE.test(demoUrl)) errors.demoUrl = 'invalidUrl';
  if (githubUrl && !URL_RE.test(githubUrl)) errors.githubUrl = 'invalidUrl';
  if (thumbnailUrl && !URL_RE.test(thumbnailUrl)) errors.thumbnailUrl = 'invalidUrl';

  let order = 0;
  if (orderRaw) {
    const n = Number.parseInt(orderRaw, 10);
    if (Number.isFinite(n)) order = n;
  }

  const skillIds = formData
    .getAll('skillIds')
    .map((v) => v.toString().trim())
    .filter(Boolean);

  let issues: IssueDraft[] = [];
  const issuesRaw = getRaw('issues');
  if (issuesRaw) {
    try {
      const parsed = JSON.parse(issuesRaw) as IssueDraft[];
      if (Array.isArray(parsed)) {
        issues = parsed
          .map((i) => ({
            titleKo: (i.titleKo ?? '').trim(),
            titleEn: (i.titleEn ?? '').trim(),
            problemKo: (i.problemKo ?? '').trim(),
            problemEn: (i.problemEn ?? '').trim(),
            solutionKo: (i.solutionKo ?? '').trim(),
            solutionEn: (i.solutionEn ?? '').trim(),
            outcomeKo: (i.outcomeKo ?? '').trim(),
            outcomeEn: (i.outcomeEn ?? '').trim(),
          }))
          .filter(
            (i) =>
              i.titleKo ||
              i.titleEn ||
              i.problemKo ||
              i.problemEn ||
              i.solutionKo ||
              i.solutionEn
          );
      }
    } catch {
      // ignore parse errors — treat as no issues
    }
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    data: {
      slug,
      titleKo,
      titleEn,
      oneLinerKo,
      oneLinerEn,
      startDate,
      endDate,
      dateGranularity,
      roleKo: roleKo || null,
      roleEn: roleEn || null,
      teamSize,
      contribution,
      descriptionKo,
      descriptionEn,
      demoUrl: demoUrl || null,
      githubUrl: githubUrl || null,
      thumbnailUrl: thumbnailUrl || null,
      pinned,
      visible,
      order,
      skillIds,
      issues,
    },
  };
}

function projectScalars(d: ParsedProjectData) {
  return {
    slug: d.slug,
    titleKo: d.titleKo,
    titleEn: d.titleEn,
    oneLinerKo: d.oneLinerKo,
    oneLinerEn: d.oneLinerEn,
    startDate: d.startDate,
    endDate: d.endDate,
    dateGranularity: d.dateGranularity,
    roleKo: d.roleKo,
    roleEn: d.roleEn,
    teamSize: d.teamSize,
    contribution: d.contribution,
    descriptionKo: d.descriptionKo,
    descriptionEn: d.descriptionEn,
    demoUrl: d.demoUrl,
    githubUrl: d.githubUrl,
    thumbnailUrl: d.thumbnailUrl,
    pinned: d.pinned,
    visible: d.visible,
    order: d.order,
  };
}

function nestedNew(d: ParsedProjectData) {
  return {
    skills: {
      create: d.skillIds.map((skillId, idx) => ({ skillId, order: idx })),
    },
    issues: {
      create: d.issues.map((i, idx) => ({
        titleKo: i.titleKo,
        titleEn: i.titleEn,
        problemKo: i.problemKo,
        problemEn: i.problemEn,
        solutionKo: i.solutionKo,
        solutionEn: i.solutionEn,
        outcomeKo: i.outcomeKo || null,
        outcomeEn: i.outcomeEn || null,
        order: idx,
      })),
    },
  };
}

export async function createProject(
  _prev: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  if (!(await isAdmin())) return { status: 'error', formError: 'unauthorized' };
  const parsed = parseFormData(formData);
  if (parsed.errors) return { status: 'error', errors: parsed.errors };
  const d = parsed.data!;

  try {
    await prisma.project.create({
      data: {
        ...projectScalars(d),
        ...nestedNew(d),
      },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      return { status: 'error', errors: { slug: 'slugTaken' } };
    }
    return { status: 'error', formError: 'saveFailed' };
  }

  revalidatePath('/', 'layout');
  return { status: 'success' };
}

export async function updateProject(
  id: string,
  _prev: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  if (!(await isAdmin())) return { status: 'error', formError: 'unauthorized' };
  const parsed = parseFormData(formData);
  if (parsed.errors) return { status: 'error', errors: parsed.errors };
  const d = parsed.data!;

  try {
    await prisma.$transaction([
      prisma.projectIssue.deleteMany({ where: { projectId: id } }),
      prisma.projectSkill.deleteMany({ where: { projectId: id } }),
      prisma.project.update({
        where: { id },
        data: {
          ...projectScalars(d),
          ...nestedNew(d),
        },
      }),
    ]);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      return { status: 'error', errors: { slug: 'slugTaken' } };
    }
    return { status: 'error', formError: 'saveFailed' };
  }

  revalidatePath('/', 'layout');
  return { status: 'success' };
}

export async function deleteProject(id: string): Promise<void> {
  if (!(await isAdmin())) return;
  try {
    await prisma.project.delete({ where: { id } });
  } catch {
    // swallow
  }
  revalidatePath('/', 'layout');
}
