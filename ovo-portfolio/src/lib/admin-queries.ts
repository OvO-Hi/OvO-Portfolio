import { prisma } from './prisma';
import { educationStatusReverse } from './queries';
import type { Certification, Education, Experience } from '@/types';

export type AdminEducation = Education & { id: string };
export type AdminCertification = Certification & { id: string };
export type AdminExperience = Experience;

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
