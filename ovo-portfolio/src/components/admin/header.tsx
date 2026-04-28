'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ExternalLink, LogOut, Menu, X } from 'lucide-react';
import { signOutAction } from '@/app/admin/(dashboard)/actions';

interface HeaderProps {
  userName: string;
  onToggleMenu: () => void;
  isMenuOpen: boolean;
}

export function Header({ userName, onToggleMenu, isMenuOpen }: HeaderProps) {
  const t = useTranslations('admin');

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background-subtle px-4 md:px-6">
      <button
        type="button"
        onClick={onToggleMenu}
        aria-label={isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
        aria-expanded={isMenuOpen}
        className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-foreground-muted transition-colors duration-150 hover:bg-background-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] md:hidden"
      >
        {isMenuOpen ? (
          <X className="h-4 w-4" aria-hidden />
        ) : (
          <Menu className="h-4 w-4" aria-hidden />
        )}
      </button>

      <span className="font-mono text-caption text-foreground-subtle">
        {t('siteTitle')}
      </span>

      <div className="ml-auto flex items-center gap-2 md:gap-4">
        <Link
          href="/ko"
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-1.5 text-caption text-foreground-muted transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:text-accent sm:inline-flex"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          <span>{t('header.viewSite')}</span>
        </Link>

        <span
          className="hidden font-mono text-caption text-foreground-subtle md:inline"
          aria-label={t('header.signedInAs', { name: userName })}
        >
          {userName}
        </span>

        <form action={signOutAction}>
          <button
            type="submit"
            className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-border bg-transparent px-3 text-caption text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            <span>{t('header.signOut')}</span>
          </button>
        </form>
      </div>
    </header>
  );
}
