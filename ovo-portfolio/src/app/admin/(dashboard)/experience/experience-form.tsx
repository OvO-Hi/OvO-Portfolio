'use client';

import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useTranslations } from 'next-intl';
import {
  DateMonthField,
  InputField,
  TextareaField,
} from '@/components/admin/form-field';
import { SaveButton } from '@/components/admin/save-button';
import { StatusMessage } from '@/components/admin/status-message';
import { createExperience, updateExperience } from './actions';
import { experienceInitialState, type ExperienceActionState } from './types';
import type { Experience } from '@/types';

interface ExperienceFormProps {
  initial?: Experience;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ExperienceForm({ initial, onSuccess, onCancel }: ExperienceFormProps) {
  const t = useTranslations('admin');

  const action = initial
    ? updateExperience.bind(null, initial.id)
    : createExperience;
  const [state, formAction] = useFormState<ExperienceActionState, FormData>(
    action,
    experienceInitialState
  );

  useEffect(() => {
    if (state.status === 'success') onSuccess?.();
  }, [state.status, onSuccess]);

  const errors = state.status === 'error' ? state.errors ?? {} : {};
  const errorFor = (k: string) => (errors[k] ? t(`errors.${errors[k]}`) : undefined);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.status === 'error' && state.formError ? (
        <StatusMessage variant="error">{t(`errors.${state.formError}`)}</StatusMessage>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <InputField
          label={t('experience.fields.organizationKo')}
          name="organizationKo"
          defaultValue={initial?.organization.ko}
          error={errorFor('organizationKo')}
          required
        />
        <InputField
          label={t('experience.fields.organizationEn')}
          name="organizationEn"
          defaultValue={initial?.organization.en}
          error={errorFor('organizationEn')}
          required
        />
        <InputField
          label={t('experience.fields.roleKo')}
          name="roleKo"
          defaultValue={initial?.role.ko}
          error={errorFor('roleKo')}
        />
        <InputField
          label={t('experience.fields.roleEn')}
          name="roleEn"
          defaultValue={initial?.role.en}
          error={errorFor('roleEn')}
        />
        <DateMonthField
          label={t('experience.fields.startDate')}
          name="startDate"
          defaultValue={initial?.startDate}
          error={errorFor('startDate')}
          required
        />
        <DateMonthField
          label={t('experience.fields.endDate')}
          name="endDate"
          defaultValue={initial?.endDate}
          error={errorFor('endDate')}
          required
        />
      </div>

      <TextareaField
        label={t('experience.fields.descriptionKo')}
        name="descriptionKo"
        defaultValue={initial?.description.ko}
        error={errorFor('descriptionKo')}
        rows={2}
      />
      <TextareaField
        label={t('experience.fields.descriptionEn')}
        name="descriptionEn"
        defaultValue={initial?.description.en}
        error={errorFor('descriptionEn')}
        rows={2}
      />

      <div className="flex justify-end gap-2 pt-2">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center rounded-sm border border-border bg-transparent px-4 text-body text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
          >
            {t('common.cancel')}
          </button>
        ) : null}
        <SaveButton saved={false} />
      </div>
    </form>
  );
}
