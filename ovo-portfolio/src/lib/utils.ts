import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateRange(
  start: string,
  end: string | null | undefined,
  granularity: 'day' | 'month' = 'month',
  locale: 'ko' | 'en' = 'ko'
): string {
  const fmt = (s: string) => {
    const [y, m, d] = s.split('-');
    if (locale === 'ko') {
      if (granularity === 'day' && d) return `${y}.${m}.${d}`;
      return `${y}.${m}`;
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[Number(m) - 1] ?? m;
    if (granularity === 'day' && d) return `${monthName} ${Number(d)}, ${y}`;
    return `${monthName} ${y}`;
  };
  const present = locale === 'ko' ? '현재' : 'Present';
  const endStr = end ? fmt(end) : present;
  return `${fmt(start)} – ${endStr}`;
}
