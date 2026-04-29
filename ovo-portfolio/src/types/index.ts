export type Locale = 'ko' | 'en';

export type Localized<T> = { ko: T; en: T };

export interface Profile {
  name: Localized<string>;
  tagline: Localized<string>;
  email: string;
  phone: string;
  github: string;
  profileImage: string;
}

export interface Education {
  id?: string;
  school: Localized<string>;
  major: Localized<string>;
  status: 'enrolled' | 'graduated' | 'leave' | 'extra-semester' | 'graduation-deferred';
  startDate: string;
  endDate: string;
  gpa?: { value: string; max: string; hidden: boolean };
}

export type SkillCategory =
  | 'language'
  | 'frontend'
  | 'backend'
  | 'mobile'
  | 'database'
  | 'ai'
  | 'devops'
  | 'tool';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  iconKey?: string;
  isSystem?: boolean;
}

export interface ProjectIssue {
  id: string;
  title: Localized<string>;
  problem: Localized<string>;
  solution: Localized<string>;
  outcome?: Localized<string>;
}

export interface Project {
  id: string;
  slug: string;
  title: Localized<string>;
  oneLiner: Localized<string>;
  startDate: string;
  endDate: string;
  dateGranularity: 'day' | 'month';
  role?: Localized<string>;
  teamSize?: number;
  contribution?: number;
  skillIds: string[];
  description: Localized<string>;
  demoUrl?: string;
  githubUrl?: string;
  thumbnailUrl?: string;
  pinned: boolean;
  visible: boolean;
  order: number;
  issues: ProjectIssue[];
}

export interface Certification {
  id?: string;
  name: Localized<string>;
  issuer: Localized<string>;
  date: string;
  type: 'certification' | 'language' | 'award';
  score?: string;
}

export interface Experience {
  id: string;
  organization: Localized<string>;
  role: Localized<string>;
  startDate: string;
  endDate: string;
  description: Localized<string>;
}

export interface AboutContent {
  paragraphs: Localized<string[]>;
}
