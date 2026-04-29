'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useTranslations } from 'next-intl';
import {
  DateMonthField,
  InputField,
  TextareaField,
} from '@/components/admin/form-field';
import { SaveButton } from '@/components/admin/save-button';
import { StatusMessage } from '@/components/admin/status-message';
import { TranslateButton } from '@/components/admin/translate-button';
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

  const [organizationKo, setOrganizationKo] = useState(initial?.organization.ko ?? '');
  const [organizationEn, setOrganizationEn] = useState(initial?.organization.en ?? '');
  const [roleKo, setRoleKo] = useState(initial?.role.ko ?? '');
  const [roleEn, setRoleEn] = useState(initial?.role.en ?? '');
  const [descriptionKo, setDescriptionKo] = useState(initial?.description.ko ?? '');
  const [descriptionEn, setDescriptionEn] = useState(initial?.description.en ?? '');

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
          value={organizationKo}
          onChange={(e) => setOrganizationKo(e.target.value)}
          error={errorFor('organizationKo')}
          required
        />
        <InputField
          label={t('experience.fields.organizationEn')}
          name="organizationEn"
          value={organizationEn}
          onChange={(e) => setOrganizationEn(e.target.value)}
          error={errorFor('organizationEn')}
          required
          translateButton={
            <TranslateButton
              koValue={organizationKo}
              existingEnValue={organizationEn}
              fieldLabel={t('experience.fields.organizationEn')}
              context="Company / club / crew name"
              onTranslated={setOrganizationEn}
            />
          }
        />
        <InputField
          label={t('experience.fields.roleKo')}
          name="roleKo"
          value={roleKo}
          onChange={(e) => setRoleKo(e.target.value)}
          error={errorFor('roleKo')}
        />
        <InputField
          label={t('experience.fields.roleEn')}
          name="roleEn"
          value={roleEn}
          onChange={(e) => setRoleEn(e.target.value)}
          error={errorFor('roleEn')}
          translateButton={
            <TranslateButton
              koValue={roleKo}
              existingEnValue={roleEn}
              fieldLabel={t('experience.fields.roleEn')}
              context="Role / position title"
              onTranslated={setRoleEn}
            />
          }
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
        value={descriptionKo}
        onChange={(e) => setDescriptionKo(e.target.value)}
        error={errorFor('descriptionKo')}
        rows={2}
      />
      <TextareaField
        label={t('experience.fields.descriptionEn')}
        name="descriptionEn"
        value={descriptionEn}
        onChange={(e) => setDescriptionEn(e.target.value)}
        error={errorFor('descriptionEn')}
        rows={2}
        translateButton={
          <TranslateButton
            koValue={descriptionKo}
            existingEnValue={descriptionEn}
            fieldLabel={t('experience.fields.descriptionEn')}
            context="One-line description of the experience"
            onTranslated={setDescriptionEn}
          />
        }
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
