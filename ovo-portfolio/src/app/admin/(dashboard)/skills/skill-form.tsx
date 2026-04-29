'use client';

import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useTranslations } from 'next-intl';
import { SaveButton } from '@/components/admin/save-button';
import { StatusMessage } from '@/components/admin/status-message';
import { createSkill, updateSkill } from './actions';
import { skillInitialState, type SkillActionState } from './types';
import type { Skill, SkillCategory } from '@/types';

interface SkillFormProps {
  mode: 'create' | 'edit';
  initial?: Skill & { id: string };
  defaultCategory?: SkillCategory;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SkillForm({
  mode,
  initial,
  defaultCategory,
  onSuccess,
  onCancel,
}: SkillFormProps) {
  const t = useTranslations('admin');

  const action =
    mode === 'edit' && initial
      ? updateSkill.bind(null, initial.id)
      : createSkill;
  const [state, formAction] = useFormState<SkillActionState, FormData>(
    action,
    skillInitialState
  );

  useEffect(() => {
    if (state.status === 'success') onSuccess?.();
  }, [state.status, onSuccess]);

  const errors = state.status === 'error' ? state.errors ?? {} : {};
  const errorFor = (k: string) => (errors[k] ? t(`errors.${errors[k]}`) : undefined);

  return (
    <form action={formAction} className="space-y-3" noValidate>
      {state.status === 'error' && state.formError ? (
        <StatusMessage variant="error">{t(`errors.${state.formError}`)}</StatusMessage>
      ) : null}

      <div className="space-y-1.5">
        <label
          htmlFor="skill-name"
          className="block text-caption font-medium text-foreground-subtle"
        >
          {t('skills.fields.name')}
          <span aria-hidden className="ml-1 text-accent">
            *
          </span>
        </label>
        <input
          id="skill-name"
          name="name"
          defaultValue={initial?.name}
          required
          autoFocus
          className={inputClass(Boolean(errorFor('name')))}
        />
        {errorFor('name') ? (
          <p role="alert" className="inline-flex items-center gap-1 text-caption text-accent">
            <span aria-hidden>⚠</span>
            <span>{errorFor('name')}</span>
          </p>
        ) : null}
      </div>

      {mode === 'create' ? (
        <>
          <div className="space-y-1.5">
            <label
              htmlFor="skill-id"
              className="block text-caption font-medium text-foreground-subtle"
            >
              {t('skills.fields.id')}
            </label>
            <input
              id="skill-id"
              name="id"
              placeholder="auto"
              className={inputClass(Boolean(errorFor('id')))}
            />
            {errorFor('id') ? (
              <p role="alert" className="inline-flex items-center gap-1 text-caption text-accent">
                <span aria-hidden>⚠</span>
                <span>{errorFor('id')}</span>
              </p>
            ) : (
              <p className="text-caption text-foreground-subtle">
                {t('skills.hints.id')}
              </p>
            )}
          </div>
          {defaultCategory ? (
            <input type="hidden" name="category" value={defaultCategory} />
          ) : null}
        </>
      ) : initial ? (
        <p className="font-mono text-caption text-foreground-subtle">
          id: {initial.id}
        </p>
      ) : null}

      <div className="space-y-1.5">
        <label
          htmlFor="skill-iconKey"
          className="block text-caption font-medium text-foreground-subtle"
        >
          {t('skills.fields.iconKey')}
        </label>
        <input
          id="skill-iconKey"
          name="iconKey"
          defaultValue={initial?.iconKey}
          className={inputClass(false)}
        />
        <p className="text-caption text-foreground-subtle">
          {t('skills.hints.iconKey')}
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-8 items-center rounded-sm border border-border bg-transparent px-3 text-caption text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
          >
            {t('common.cancel')}
          </button>
        ) : null}
        <SaveButton saved={false} />
      </div>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return [
    'block w-full rounded-sm border bg-background px-2.5 py-1.5 text-body text-foreground placeholder:text-foreground-subtle',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
    hasError
      ? 'border-accent focus-visible:ring-[var(--accent)]'
      : 'border-border hover:border-border-strong focus-visible:ring-[var(--border-strong)]',
  ].join(' ');
}
