export type AdminNavKey =
  | 'profile'
  | 'about'
  | 'education'
  | 'skills'
  | 'certifications'
  | 'experience'
  | 'projects';

export interface AdminNavItem {
  key: AdminNavKey;
  href: string;
  enabled: boolean;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { key: 'profile', href: '/admin/profile', enabled: true },
  { key: 'about', href: '/admin/about', enabled: true },
  { key: 'education', href: '/admin/education', enabled: false },
  { key: 'skills', href: '/admin/skills', enabled: false },
  { key: 'certifications', href: '/admin/certifications', enabled: false },
  { key: 'experience', href: '/admin/experience', enabled: false },
  { key: 'projects', href: '/admin/projects', enabled: false },
];
