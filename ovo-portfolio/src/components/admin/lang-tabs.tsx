'use client';

import { useId, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LangTabsProps {
  koLabel: string;
  enLabel: string;
  koContent: ReactNode;
  enContent: ReactNode;
}

type Lang = 'ko' | 'en';

export function LangTabs({ koLabel, enLabel, koContent, enContent }: LangTabsProps) {
  const [active, setActive] = useState<Lang>('ko');
  const id = useId();

  const tabs: Array<{ value: Lang; label: string }> = [
    { value: 'ko', label: koLabel },
    { value: 'en', label: enLabel },
  ];

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Language" className="flex border-b border-border">
        {tabs.map((tab) => {
          const isActive = active === tab.value;
          return (
            <button
              key={tab.value}
              id={`${id}-tab-${tab.value}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${id}-panel-${tab.value}`}
              onClick={() => setActive(tab.value)}
              className={cn(
                '-mb-px border-b-2 px-4 py-2 text-body transition-colors duration-150',
                'focus-visible:outline-none focus-visible:text-foreground',
                isActive
                  ? 'border-accent text-foreground'
                  : 'border-transparent text-foreground-subtle hover:text-foreground-muted'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id={`${id}-panel-ko`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-ko`}
        hidden={active !== 'ko'}
      >
        {koContent}
      </div>
      <div
        id={`${id}-panel-en`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-en`}
        hidden={active !== 'en'}
      >
        {enContent}
      </div>
    </div>
  );
}
