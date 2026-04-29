'use client';

import { useFormState } from 'react-dom';
import { useTranslations } from 'next-intl';
import { InputField } from '@/components/admin/form-field';
import { ImageUpload } from '@/components/admin/image-upload';
import { SaveButton } from '@/components/admin/save-button';
import { StatusMessage } from '@/components/admin/status-message';
import { updateProfile } from './actions';
import type { ProfileActionState } from './types';
import type { Profile } from '@/types';

interface ProfileFormProps {
  initial: Profile;
}

const initialState: ProfileActionState = { status: 'idle' };

export function ProfileForm({ initial }: ProfileFormProps) {
  const [state, formAction] = useFormState(updateProfile, initialState);
  const t = useTranslations('admin');

  const errors = state.status === 'error' ? state.errors ?? {} : {};
  const errorFor = (key: string): string | undefined => {
    const code = errors[key];
    return code ? t(`errors.${code}`) : undefined;
  };

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.status === 'success' ? (
        <StatusMessage variant="success">{t('common.saved')}</StatusMessage>
      ) : null}
      {state.status === 'error' && state.formError ? (
        <StatusMessage variant="error">{t(`errors.${state.formError}`)}</StatusMessage>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label={t('profile.fields.nameKo')}
          name="nameKo"
          defaultValue={initial.name.ko}
          error={errorFor('nameKo')}
          required
        />
        <InputField
          label={t('profile.fields.nameEn')}
          name="nameEn"
          defaultValue={initial.name.en}
          error={errorFor('nameEn')}
          required
        />
        <InputField
          label={t('profile.fields.taglineKo')}
          name="taglineKo"
          defaultValue={initial.tagline.ko}
          error={errorFor('taglineKo')}
          required
        />
        <InputField
          label={t('profile.fields.taglineEn')}
          name="taglineEn"
          defaultValue={initial.tagline.en}
          error={errorFor('taglineEn')}
          required
        />
        <InputField
          label={t('profile.fields.email')}
          name="email"
          type="email"
          defaultValue={initial.email}
          error={errorFor('email')}
          required
        />
        <InputField
          label={t('profile.fields.phone')}
          name="phone"
          defaultValue={initial.phone}
          error={errorFor('phone')}
        />
      </div>
      <InputField
        label={t('profile.fields.github')}
        name="github"
        type="url"
        defaultValue={initial.github}
        hint={t('profile.hints.github')}
        error={errorFor('github')}
      />
      <div className="space-y-1.5">
        <span className="block text-caption font-medium text-foreground">
          {t('profile.fields.profileImage')}
        </span>
        <ImageUpload
          name="profileImage"
          defaultValue={initial.profileImage}
          prefix="profile"
          shape="circle"
          ariaLabel={t('profile.fields.profileImage')}
        />
        <p className="text-caption text-foreground-subtle">
          {t('profile.hints.profileImage')}
        </p>
        {errorFor('profileImage') ? (
          <p role="alert" className="inline-flex items-center gap-1 text-caption text-accent">
            <span aria-hidden>⚠</span>
            <span>{errorFor('profileImage')}</span>
          </p>
        ) : null}
      </div>

      <div className="flex justify-end pt-2">
        <SaveButton saved={state.status === 'success'} />
      </div>
    </form>
  );
}
