export type AdminNavKey =
  | 'profile'
  | 'about'
  | 'education'
  | 'skills'
  | 'certifications'
  | 'experience'
  | 'projects'
  | 'settings';

export interface AdminNavItem {
  key: AdminNavKey;
  href: string;
  enabled: boolean;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { key: 'profile', href: '/admin/profile', enabled: true },
  { key: 'about', href: '/admin/about', enabled: true },
  { key: 'education', href: '/admin/education', enabled: true },
  { key: 'skills', href: '/admin/skills', enabled: true },
  { key: 'certifications', href: '/admin/certifications', enabled: true },
  { key: 'experience', href: '/admin/experience', enabled: true },
  { key: 'projects', href: '/admin/projects', enabled: true },
  { key: 'settings', href: '/admin/settings', enabled: true },
];
