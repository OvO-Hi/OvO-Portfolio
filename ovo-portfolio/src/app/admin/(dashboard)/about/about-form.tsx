'use client';

import { useFormState } from 'react-dom';
import { useTranslations } from 'next-intl';
import { SaveButton } from '@/components/admin/save-button';
import { StatusMessage } from '@/components/admin/status-message';
import { AboutParagraphsEditor } from './about-paragraphs-editor';
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

      <AboutParagraphsEditor
        initialKo={initial.paragraphs.ko}
        initialEn={initial.paragraphs.en}
      />

      <div className="flex justify-end pt-2">
        <SaveButton saved={state.status === 'success'} />
      </div>
    </form>
  );
}
