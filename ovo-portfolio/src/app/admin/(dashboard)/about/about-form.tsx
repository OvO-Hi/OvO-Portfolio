'use client';

import { useFormState } from 'react-dom';
import { useTranslations } from 'next-intl';
import { LangTabs } from '@/components/admin/lang-tabs';
import { ParagraphListEditor } from '@/components/admin/paragraph-list-editor';
import { SaveButton } from '@/components/admin/save-button';
import { StatusMessage } from '@/components/admin/status-message';
import { updateAbout } from './actions';
import type { AboutActionState } from './types';
import type { AboutContent } from '@/types';

interface AboutFormProps {
  initial: AboutContent;
}

const initialState: AboutActionState = { status: 'idle' };

export function AboutForm({ initial }: AboutFormProps) {
  const [state, formAction] = useFormState(updateAbout, initialState);
  const t = useTranslations('admin');

  return (
    <form action={formAction} className="space-y-6">
      {state.status === 'success' ? (
        <StatusMessage variant="success">{t('common.saved')}</StatusMessage>
      ) : null}
      {state.status === 'error' && state.formError ? (
        <StatusMessage variant="error">{t(`errors.${state.formError}`)}</StatusMessage>
      ) : null}

      <LangTabs
        koLabel={t('about.tabKo')}
        enLabel={t('about.tabEn')}
        koContent={
          <ParagraphListEditor name="paragraphsKo" initial={initial.paragraphs.ko} />
        }
        enContent={
          <ParagraphListEditor name="paragraphsEn" initial={initial.paragraphs.en} />
        }
      />

      <div className="flex justify-end pt-2">
        <SaveButton saved={state.status === 'success'} />
      </div>
    </form>
  );
}
