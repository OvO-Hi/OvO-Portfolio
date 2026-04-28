import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LocaleToggle } from '@/components/ui/locale-toggle';

export function SiteHeader() {
  return (
    <div className="container-prose flex h-14 items-center justify-end gap-2 pt-4">
      <LocaleToggle />
      <ThemeToggle />
    </div>
  );
}
