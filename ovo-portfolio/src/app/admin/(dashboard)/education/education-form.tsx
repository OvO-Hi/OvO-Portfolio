'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useTranslations } from 'next-intl';
import {
  DateMonthField,
  InputField,
  SelectField,
} from '@/components/admin/form-field';
import { SaveButton } from '@/components/admin/save-button';
import { StatusMessage } from '@/components/admin/status-message';
import { TranslateButton } from '@/components/admin/translate-button';
import { createEducation, updateEducation } from './actions';
import { educationInitialState, type EducationActionState } from './types';
import type { Education } from '@/types';

interface EducationFormProps {
  initial?: Education & { id: string };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const STATUS_VALUES: Education['status'][] = [
  'enrolled',
  'graduated',
  'leave',
  'extra-semester',
  'graduation-deferred',
];

export function EducationForm({ initial, onSuccess, onCancel }: EducationFormProps) {
  const t = useTranslations('admin');
  const tStatus = useTranslations('education.status');

  const [schoolKo, setSchoolKo] = useState(initial?.school.ko ?? '');
  const [schoolEn, setSchoolEn] = useState(initial?.school.en ?? '');
  const [majorKo, setMajorKo] = useState(initial?.major.ko ?? '');
  const [majorEn, setMajorEn] = useState(initial?.major.en ?? '');

  const action = initial
    ? updateEducation.bind(null, initial.id)
    : createEducation;
  const [state, formAction] = useFormState<EducationActionState, FormData>(
    action,
    educationInitialState
  );

  useEffect(() => {
    if (state.status === 'success') onSuccess?.();
  }, [state.status, onSuccess]);

  const errors = state.status === 'error' ? state.errors ?? {} : {};
  const errorFor = (k: string) => (errors[k] ? t(`errors.${errors[k]}`) : undefined);

  const statusOptions = STATUS_VALUES.map((v) => ({
    value: v,
    label: tStatus(v),
  }));

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.status === 'error' && state.formError ? (
        <StatusMessage variant="error">{t(`errors.${state.formError}`)}</StatusMessage>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <InputField
          label={t('education.fields.schoolKo')}
          name="schoolKo"
          value={schoolKo}
          onChange={(e) => setSchoolKo(e.target.value)}
          error={errorFor('schoolKo')}
          required
        />
        <InputField
          label={t('education.fields.schoolEn')}
          name="schoolEn"
          value={schoolEn}
          onChange={(e) => setSchoolEn(e.target.value)}
          error={errorFor('schoolEn')}
          required
          translateButton={
            <TranslateButton
              koValue={schoolKo}
              existingEnValue={schoolEn}
              fieldLabel={t('education.fields.schoolEn')}
              context="School name"
              onTranslated={setSchoolEn}
            />
          }
        />
        <InputField
          label={t('education.fields.majorKo')}
          name="majorKo"
          value={majorKo}
          onChange={(e) => setMajorKo(e.target.value)}
          error={errorFor('majorKo')}
          required
        />
        <InputField
          label={t('education.fields.majorEn')}
          name="majorEn"
          value={majorEn}
          onChange={(e) => setMajorEn(e.target.value)}
          error={errorFor('majorEn')}
          required
          translateButton={
            <TranslateButton
              koValue={majorKo}
              existingEnValue={majorEn}
              fieldLabel={t('education.fields.majorEn')}
              context="Academic major / department"
              onTranslated={setMajorEn}
            />
          }
        />
      </div>

      <SelectField
        label={t('education.fields.status')}
        name="status"
        defaultValue={initial?.status ?? 'enrolled'}
        error={errorFor('status')}
        options={statusOptions}
        required
      />

      <div className="grid gap-5 md:grid-cols-2">
        <DateMonthField
          label={t('education.fields.startDate')}
          name="startDate"
          defaultValue={initial?.startDate}
          error={errorFor('startDate')}
          required
        />
        <DateMonthField
          label={t('education.fields.endDate')}
          name="endDate"
          defaultValue={initial?.endDate}
          error={errorFor('endDate')}
          required
        />
      </div>

      <fieldset className="space-y-3 rounded-sm border border-border bg-background p-4">
        <legend className="px-1 text-caption font-medium text-foreground-subtle">
          {t('education.fields.gpa')}
        </legend>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label={t('education.fields.gpaValue')}
            name="gpaValue"
            defaultValue={initial?.gpa?.value}
            error={errorFor('gpaValue')}
          />
          <InputField
            label={t('education.fields.gpaMax')}
            name="gpaMax"
            defaultValue={initial?.gpa?.max}
            error={errorFor('gpaMax')}
          />
        </div>
        <label className="flex items-center gap-2 px-1 text-caption text-foreground-muted">
          <input
            type="checkbox"
            name="gpaHidden"
            defaultChecked={initial?.gpa?.hidden}
            className="h-4 w-4 rounded-sm border-border accent-accent"
          />
          {t('education.fields.gpaHidden')}
        </label>
      </fieldset>

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
