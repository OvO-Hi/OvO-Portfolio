import { prisma } from './prisma';
import { educationStatusReverse } from './queries';
import type {
  Certification,
  Education,
  Experience,
  Project,
  ProjectIssue,
  Skill,
} from '@/types';

export type AdminEducation = Education & { id: string };
export type AdminCertification = Certification & { id: string };
export type AdminExperience = Experience;
export type AdminSkill = Skill & { usageCount: number };
export type AdminProject = Project;

export async function getEducationsForAdmin(): Promise<AdminEducation[]> {
  const rows = await prisma.education.findMany({
    orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
  });
  return rows.map((r) => ({
    id: r.id,
    school: { ko: r.schoolKo, en: r.schoolEn },
    major: { ko: r.majorKo, en: r.majorEn },
    status: educationStatusReverse[r.status],
    startDate: r.startDate,
    endDate: r.endDate,
    gpa:
      r.gpaValue !== null && r.gpaMax !== null
        ? { value: r.gpaValue, max: r.gpaMax, hidden: r.gpaHidden ?? false }
        : undefined,
  }));
}

export async function getCertificationsForAdmin(): Promise<AdminCertification[]> {
  const rows = await prisma.certification.findMany({
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
  });
  return rows.map((r) => ({
    id: r.id,
    name: { ko: r.nameKo, en: r.nameEn },
    issuer: { ko: r.issuerKo, en: r.issuerEn },
    date: r.date,
    type: r.type,
    score: r.score ?? undefined,
  }));
}

export async function getExperiencesForAdmin(): Promise<AdminExperience[]> {
  const rows = await prisma.experience.findMany({
    orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
  });
  return rows.map((r) => ({
    id: r.id,
    organization: { ko: r.organizationKo, en: r.organizationEn },
    role: { ko: r.roleKo, en: r.roleEn },
    startDate: r.startDate,
    endDate: r.endDate,
    description: { ko: r.descriptionKo, en: r.descriptionEn },
  }));
}

export async function getSkillsForAdmin(): Promise<AdminSkill[]> {
  const rows = await prisma.skill.findMany({
    orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { projects: true } } },
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    iconKey: r.iconKey ?? undefined,
    usageCount: r._count.projects,
  }));
}

export async function getProjectsForAdmin(): Promise<AdminProject[]> {
  const rows = await prisma.project.findMany({
    orderBy: [{ pinned: 'desc' }, { order: 'asc' }, { startDate: 'desc' }],
    include: {
      skills: { orderBy: { order: 'asc' }, select: { skillId: true } },
      issues: { orderBy: { order: 'asc' } },
    },
  });

  return rows.map((r) => {
    const issues: ProjectIssue[] = r.issues.map((i) => ({
      id: i.id,
      title: { ko: i.titleKo, en: i.titleEn },
      problem: { ko: i.problemKo, en: i.problemEn },
      solution: { ko: i.solutionKo, en: i.solutionEn },
      outcome:
        i.outcomeKo !== null && i.outcomeEn !== null
          ? { ko: i.outcomeKo, en: i.outcomeEn }
          : undefined,
    }));

    return {
      id: r.id,
      slug: r.slug,
      title: { ko: r.titleKo, en: r.titleEn },
      oneLiner: { ko: r.oneLinerKo, en: r.oneLinerEn },
      startDate: r.startDate,
      endDate: r.endDate,
      dateGranularity: r.dateGranularity,
      role:
        r.roleKo !== null && r.roleEn !== null
          ? { ko: r.roleKo, en: r.roleEn }
          : undefined,
      teamSize: r.teamSize ?? undefined,
      contribution: r.contribution ?? undefined,
      skillIds: r.skills.map((s) => s.skillId),
      description: { ko: r.descriptionKo, en: r.descriptionEn },
      demoUrl: r.demoUrl ?? undefined,
      githubUrl: r.githubUrl ?? undefined,
      thumbnailUrl: r.thumbnailUrl ?? undefined,
      pinned: r.pinned,
      visible: r.visible,
      order: r.order,
      issues,
    };
  });
}
