import { PrismaClient, EducationStatus, CertificationType, DateGranularity, SkillCategory } from '@prisma/client';
import {
  profile,
  aboutContent,
  educations,
  certifications,
  experiences,
  projects,
} from '../src/data/dummy';
import { skillsSeed } from '../src/data/skills-seed';

const prisma = new PrismaClient();

const SINGLETON_ID = 'default';

const educationStatusMap: Record<string, EducationStatus> = {
  enrolled: EducationStatus.enrolled,
  graduated: EducationStatus.graduated,
  leave: EducationStatus.leave,
  'extra-semester': EducationStatus.extraSemester,
  'graduation-deferred': EducationStatus.graduationDeferred,
};

async function main() {
  console.log('🌱 seeding...');

  // Clear in dependency order
  await prisma.projectIssue.deleteMany();
  await prisma.projectSkill.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.education.deleteMany();
  await prisma.aboutContent.deleteMany();
  await prisma.profile.deleteMany();

  // Profile (singleton)
  await prisma.profile.create({
    data: {
      id: SINGLETON_ID,
      nameKo: profile.name.ko,
      nameEn: profile.name.en,
      taglineKo: profile.tagline.ko,
      taglineEn: profile.tagline.en,
      email: profile.email,
      phone: profile.phone,
      github: profile.github,
      profileImage: profile.profileImage,
    },
  });
  console.log('  ✓ profile');

  // About (singleton)
  await prisma.aboutContent.create({
    data: {
      id: SINGLETON_ID,
      paragraphsKo: aboutContent.paragraphs.ko,
      paragraphsEn: aboutContent.paragraphs.en,
    },
  });
  console.log('  ✓ about');

  // Educations
  for (let i = 0; i < educations.length; i++) {
    const e = educations[i];
    await prisma.education.create({
      data: {
        schoolKo: e.school.ko,
        schoolEn: e.school.en,
        majorKo: e.major.ko,
        majorEn: e.major.en,
        status: educationStatusMap[e.status],
        startDate: e.startDate,
        endDate: e.endDate,
        gpaValue: e.gpa?.value,
        gpaMax: e.gpa?.max,
        gpaHidden: e.gpa?.hidden,
        order: i,
      },
    });
  }
  console.log(`  ✓ educations (${educations.length})`);

  // Skills
  for (let i = 0; i < skillsSeed.length; i++) {
    const s = skillsSeed[i];
    await prisma.skill.create({
      data: {
        id: s.id,
        name: s.name,
        category: s.category as SkillCategory,
        iconKey: s.iconKey,
        order: i,
      },
    });
  }
  console.log(`  ✓ skills (${skillsSeed.length})`);

  // Certifications
  for (let i = 0; i < certifications.length; i++) {
    const c = certifications[i];
    await prisma.certification.create({
      data: {
        nameKo: c.name.ko,
        nameEn: c.name.en,
        issuerKo: c.issuer.ko,
        issuerEn: c.issuer.en,
        date: c.date,
        type: c.type as CertificationType,
        score: c.score,
        order: i,
      },
    });
  }
  console.log(`  ✓ certifications (${certifications.length})`);

  // Experiences
  for (let i = 0; i < experiences.length; i++) {
    const e = experiences[i];
    await prisma.experience.create({
      data: {
        organizationKo: e.organization.ko,
        organizationEn: e.organization.en,
        roleKo: e.role.ko,
        roleEn: e.role.en,
        startDate: e.startDate,
        endDate: e.endDate,
        descriptionKo: e.description.ko,
        descriptionEn: e.description.en,
        order: i,
      },
    });
  }
  console.log(`  ✓ experiences (${experiences.length})`);

  // Projects + skills (M:N) + issues
  for (const p of projects) {
    await prisma.project.create({
      data: {
        slug: p.slug,
        titleKo: p.title.ko,
        titleEn: p.title.en,
        oneLinerKo: p.oneLiner.ko,
        oneLinerEn: p.oneLiner.en,
        startDate: p.startDate,
        endDate: p.endDate,
        dateGranularity: p.dateGranularity as DateGranularity,
        roleKo: p.role?.ko,
        roleEn: p.role?.en,
        teamSize: p.teamSize,
        contribution: p.contribution,
        descriptionKo: p.description.ko,
        descriptionEn: p.description.en,
        demoUrl: p.demoUrl,
        githubUrl: p.githubUrl,
        thumbnailUrl: p.thumbnailUrl,
        pinned: p.pinned,
        visible: p.visible,
        order: p.order,
        skills: {
          create: p.skillIds.map((skillId, idx) => ({
            skillId,
            order: idx,
          })),
        },
        issues: {
          create: p.issues.map((issue, idx) => ({
            titleKo: issue.title.ko,
            titleEn: issue.title.en,
            problemKo: issue.problem.ko,
            problemEn: issue.problem.en,
            solutionKo: issue.solution.ko,
            solutionEn: issue.solution.en,
            outcomeKo: issue.outcome?.ko,
            outcomeEn: issue.outcome?.en,
            order: idx,
          })),
        },
      },
    });
  }
  console.log(`  ✓ projects (${projects.length}) + skills + issues`);

  console.log('🌱 done.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
