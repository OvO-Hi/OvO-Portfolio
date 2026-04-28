import { cache } from 'react';
import { EducationStatus as DbEducationStatus } from '@prisma/client';
import { prisma } from './prisma';
import type {
  AboutContent,
  Certification,
  Education,
  Experience,
  Profile,
  Project,
  ProjectIssue,
  Skill,
} from '@/types';

const SINGLETON_ID = 'default';

const educationStatusReverse: Record<DbEducationStatus, Education['status']> = {
  enrolled: 'enrolled',
  graduated: 'graduated',
  leave: 'leave',
  extraSemester: 'extra-semester',
  graduationDeferred: 'graduation-deferred',
};

export const getProfile = cache(async (): Promise<Profile> => {
  const row = await prisma.profile.findUniqueOrThrow({ where: { id: SINGLETON_ID } });
  return {
    name: { ko: row.nameKo, en: row.nameEn },
    tagline: { ko: row.taglineKo, en: row.taglineEn },
    email: row.email,
    phone: row.phone,
    github: row.github,
    profileImage: row.profileImage,
  };
});

export const getAbout = cache(async (): Promise<AboutContent> => {
  const row = await prisma.aboutContent.findUniqueOrThrow({ where: { id: SINGLETON_ID } });
  return {
    paragraphs: { ko: row.paragraphsKo, en: row.paragraphsEn },
  };
});

export const getEducations = cache(async (): Promise<Education[]> => {
  const rows = await prisma.education.findMany({ orderBy: { order: 'asc' } });
  return rows.map((r) => ({
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
});

export const getSkills = cache(async (): Promise<Skill[]> => {
  const rows = await prisma.skill.findMany({ orderBy: { order: 'asc' } });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    iconKey: r.iconKey ?? undefined,
  }));
});

export const getCertifications = cache(async (): Promise<Certification[]> => {
  const rows = await prisma.certification.findMany({ orderBy: { order: 'asc' } });
  return rows.map((r) => ({
    name: { ko: r.nameKo, en: r.nameEn },
    issuer: { ko: r.issuerKo, en: r.issuerEn },
    date: r.date,
    type: r.type,
    score: r.score ?? undefined,
  }));
});

export const getExperiences = cache(async (): Promise<Experience[]> => {
  const rows = await prisma.experience.findMany({ orderBy: { order: 'asc' } });
  return rows.map((r) => ({
    id: r.id,
    organization: { ko: r.organizationKo, en: r.organizationEn },
    role: { ko: r.roleKo, en: r.roleEn },
    startDate: r.startDate,
    endDate: r.endDate,
    description: { ko: r.descriptionKo, en: r.descriptionEn },
  }));
});

export const getProjects = cache(async (): Promise<Project[]> => {
  const rows = await prisma.project.findMany({
    where: { visible: true },
    orderBy: [{ pinned: 'desc' }, { order: 'asc' }],
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
});
