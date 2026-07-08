'use client';

import { useEffect, useState, useTransition } from 'react';
import { useFormState } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Check, ExternalLink, Pencil, Trash2, Zap } from 'lucide-react';
import { InputField } from '@/components/admin/form-field';
import { SaveButton } from '@/components/admin/save-button';
import { StatusMessage } from '@/components/admin/status-message';
import { deleteApiKey, saveApiKey, testApiKey } from './actions';
import { settingsInitialState, type MaskedSettings, type SettingsActionState } from './types';

interface SettingsFormProps {
  initial: MaskedSettings;
}

type TestState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export function SettingsForm({ initial }: SettingsFormProps) {
  const t = useTranslations('admin');
  const [editing, setEditing] = useState(!initial.hasKey);
  const [state, formAction] = useFormState<SettingsActionState, FormData>(
    saveApiKey,
    settingsInitialState
  );
  const [testState, setTestState] = useState<TestState>({ status: 'idle' });
  const [pending, startTransition] = useTransition();

  const handleTest = () => {
    setTestState({ status: 'idle' });
    startTransition(async () => {
      const result = await testApiKey();
      if (!result) {
        console.error('[SettingsForm] testApiKey 결과가 비어 있습니다.', result);
        setTestState({ status: 'error', message: 'unknown' });
        return;
      }
      if (result.ok) setTestState({ status: 'success' });
      else setTestState({ status: 'error', message: result.error ?? 'unknown' });
    });
  };

  const handleDelete = () => {
    if (!window.confirm(t('settings.deleteConfirm'))) return;
    startTransition(async () => {
      await deleteApiKey();
      setEditing(true);
      setTestState({ status: 'idle' });
    });
  };

  // Switch from editing → view after a successful save
  useEffect(() => {
    if (state.status === 'success') setEditing(false);
  }, [state.status]);

  if (!editing) {
    return (
      <div className="space-y-4">
        <div className="rounded-sm border border-border bg-background-subtle p-4">
          <div className="space-y-1.5">
            <p className="text-caption font-medium text-foreground-subtle">
              {t('settings.currentKeyLabel')}
            </p>
            <p className="font-mono text-body text-foreground">
              {initial.maskedKey ?? '—'}
            </p>
          </div>
        </div>

        {testState.status === 'success' ? (
          <StatusMessage variant="success">
            {t('settings.messages.testSuccess')}
          </StatusMessage>
        ) : null}
        {testState.status === 'error' ? (
          <StatusMessage variant="error">
            {t('settings.messages.testFailed', { error: testState.message })}
          </StatusMessage>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleTest}
            disabled={pending}
            className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-border bg-transparent px-3 text-caption text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] disabled:opacity-60"
          >
            <Zap className="h-3.5 w-3.5" aria-hidden />
            <span>{pending ? t('settings.actions.testing') : t('settings.actions.test')}</span>
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-border bg-transparent px-3 text-caption text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            <span>{t('settings.actions.edit')}</span>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-border bg-transparent px-3 text-caption text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] disabled:opacity-60"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            <span>{t('settings.actions.delete')}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.status === 'success' ? (
        <StatusMessage variant="success">{t('settings.messages.saved')}</StatusMessage>
      ) : null}
      {state.status === 'error' && state.formError ? (
        <StatusMessage variant="error">
          {t(`errors.${state.formError}`)}
        </StatusMessage>
      ) : null}

      <InputField
        label={t('settings.fields.apiKey')}
        name="apiKey"
        type="password"
        autoComplete="off"
        placeholder="sk-ant-…"
        required
      />

      <a
        href="https://console.anthropic.com/settings/keys"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-caption text-accent transition-opacity duration-150 hover:opacity-80 focus-visible:outline-none focus-visible:underline"
      >
        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        <span>{t('settings.consoleLink')}</span>
      </a>

      <div className="flex justify-end gap-2 pt-2">
        {initial.hasKey ? (
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="inline-flex h-10 items-center rounded-sm border border-border bg-transparent px-4 text-body text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
          >
            {t('settings.actions.cancel')}
          </button>
        ) : null}
        <SaveButton saved={state.status === 'success'} />
      </div>

      {state.status === 'success' ? (
        <p className="inline-flex items-center gap-1 text-caption text-accent">
          <Check className="h-3.5 w-3.5" aria-hidden />
          <span>{t('settings.messages.saved')}</span>
        </p>
      ) : null}
    </form>
  );
}
