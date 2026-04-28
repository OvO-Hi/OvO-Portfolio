'use client';

import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useTranslations } from 'next-intl';
import {
  DateMonthField,
  InputField,
  SelectField,
} from '@/components/admin/form-field';
import { SaveButton } from '@/components/admin/save-button';
import { StatusMessage } from '@/components/admin/status-message';
import { createCertification, updateCertification } from './actions';
import { certificationInitialState, type CertificationActionState } from './types';
import type { Certification } from '@/types';

interface CertificationFormProps {
  initial?: Certification & { id: string };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TYPE_VALUES: Certification['type'][] = ['certification', 'language', 'award'];

export function CertificationForm({ initial, onSuccess, onCancel }: CertificationFormProps) {
  const t = useTranslations('admin');
  const tType = useTranslations('certifications.type');

  const action = initial
    ? updateCertification.bind(null, initial.id)
    : createCertification;
  const [state, formAction] = useFormState<CertificationActionState, FormData>(
    action,
    certificationInitialState
  );

  useEffect(() => {
    if (state.status === 'success') onSuccess?.();
  }, [state.status, onSuccess]);

  const errors = state.status === 'error' ? state.errors ?? {} : {};
  const errorFor = (k: string) => (errors[k] ? t(`errors.${errors[k]}`) : undefined);

  const typeOptions = TYPE_VALUES.map((v) => ({ value: v, label: tType(v) }));

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.status === 'error' && state.formError ? (
        <StatusMessage variant="error">{t(`errors.${state.formError}`)}</StatusMessage>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <InputField
          label={t('certifications.fields.nameKo')}
          name="nameKo"
          defaultValue={initial?.name.ko}
          error={errorFor('nameKo')}
          required
        />
        <InputField
          label={t('certifications.fields.nameEn')}
          name="nameEn"
          defaultValue={initial?.name.en}
          error={errorFor('nameEn')}
          required
        />
        <InputField
          label={t('certifications.fields.issuerKo')}
          name="issuerKo"
          defaultValue={initial?.issuer.ko}
          error={errorFor('issuerKo')}
          required
        />
        <InputField
          label={t('certifications.fields.issuerEn')}
          name="issuerEn"
          defaultValue={initial?.issuer.en}
          error={errorFor('issuerEn')}
          required
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <SelectField
          label={t('certifications.fields.type')}
          name="type"
          defaultValue={initial?.type ?? 'certification'}
          error={errorFor('type')}
          options={typeOptions}
          required
        />
        <DateMonthField
          label={t('certifications.fields.date')}
          name="date"
          defaultValue={initial?.date}
          error={errorFor('date')}
          required
        />
      </div>

      <InputField
        label={t('certifications.fields.score')}
        name="score"
        defaultValue={initial?.score}
        error={errorFor('score')}
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
