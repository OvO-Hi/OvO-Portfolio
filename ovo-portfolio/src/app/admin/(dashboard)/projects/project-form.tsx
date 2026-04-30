'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useTranslations } from 'next-intl';
import {
  CheckboxField,
  DateMonthField,
  InputField,
  RadioGroupField,
} from '@/components/admin/form-field';
import { ImageUpload } from '@/components/admin/image-upload';
import { LangTabs } from '@/components/admin/lang-tabs';
import { MarkdownEditor } from '@/components/admin/markdown-editor';
import { MultiSelect, type MultiSelectOption } from '@/components/admin/multi-select';
import { SaveButton } from '@/components/admin/save-button';
import { StatusMessage } from '@/components/admin/status-message';
import { TranslateButton } from '@/components/admin/translate-button';
import { IssueListEditor } from './issue-list-editor';
import { createProject, updateProject } from './actions';
import { createSkillQuick } from '../skills/actions';
import {
  projectInitialState,
  type IssueDraft,
  type ProjectActionState,
} from './types';
import type { AdminSkill } from '@/lib/admin-queries';
import type { Project } from '@/types';

interface ProjectFormProps {
  initial?: Project;
  skills: AdminSkill[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProjectForm({ initial, skills, onSuccess, onCancel }: ProjectFormProps) {
  const t = useTranslations('admin');
  const tSkillCategory = useTranslations('skills.category');

  const [titleKo, setTitleKo] = useState(initial?.title.ko ?? '');
  const [titleEn, setTitleEn] = useState(initial?.title.en ?? '');
  const [oneLinerKo, setOneLinerKo] = useState(initial?.oneLiner.ko ?? '');
  const [oneLinerEn, setOneLinerEn] = useState(initial?.oneLiner.en ?? '');
  const [roleKo, setRoleKo] = useState(initial?.role?.ko ?? '');
  const [roleEn, setRoleEn] = useState(initial?.role?.en ?? '');
  const [descriptionKo, setDescriptionKo] = useState(initial?.description.ko ?? '');
  const [descriptionEn, setDescriptionEn] = useState(initial?.description.en ?? '');
  const [endDate, setEndDate] = useState(initial?.endDate ?? '');
  const [isPresent, setIsPresent] = useState(initial ? initial.endDate === null : false);

  const action =
    initial?.id !== undefined
      ? updateProject.bind(null, initial.id)
      : createProject;
  const [state, formAction] = useFormState<ProjectActionState, FormData>(
    action,
    projectInitialState
  );

  useEffect(() => {
    if (state.status === 'success') onSuccess?.();
  }, [state.status, onSuccess]);

  const errors = state.status === 'error' ? state.errors ?? {} : {};
  const errorFor = (k: string) => (errors[k] ? t(`errors.${errors[k]}`) : undefined);

  const skillOptions: MultiSelectOption[] = skills.map((s) => ({
    value: s.id,
    label: s.name,
    group: tSkillCategory(s.category),
  }));

  const initialIssues: IssueDraft[] = (initial?.issues ?? []).map((i) => ({
    titleKo: i.title.ko,
    titleEn: i.title.en,
    problemKo: i.problem.ko,
    problemEn: i.problem.en,
    solutionKo: i.solution.ko,
    solutionEn: i.solution.en,
    outcomeKo: i.outcome?.ko ?? '',
    outcomeEn: i.outcome?.en ?? '',
  }));

  return (
    <form action={formAction} className="space-y-10" noValidate>
      {state.status === 'error' && state.formError ? (
        <StatusMessage variant="error">{t(`errors.${state.formError}`)}</StatusMessage>
      ) : null}

      {/* Section: basic */}
      <Section title={t('projects.sections.basic')}>
        <InputField
          label={t('projects.fields.slug')}
          name="slug"
          defaultValue={initial?.slug}
          hint={t('projects.hints.slug')}
          error={errorFor('slug')}
          required
        />
        <div className="grid gap-5 md:grid-cols-2">
          <InputField
            label={t('projects.fields.titleKo')}
            name="titleKo"
            value={titleKo}
            onChange={(e) => setTitleKo(e.target.value)}
            error={errorFor('titleKo')}
            required
          />
          <InputField
            label={t('projects.fields.titleEn')}
            name="titleEn"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            error={errorFor('titleEn')}
            required
            translateButton={
              <TranslateButton
                koValue={titleKo}
                existingEnValue={titleEn}
                fieldLabel={t('projects.fields.titleEn')}
                context="Project title (keep proper nouns intact)"
                onTranslated={setTitleEn}
              />
            }
          />
          <InputField
            label={t('projects.fields.oneLinerKo')}
            name="oneLinerKo"
            value={oneLinerKo}
            onChange={(e) => setOneLinerKo(e.target.value)}
            error={errorFor('oneLinerKo')}
            required
          />
          <InputField
            label={t('projects.fields.oneLinerEn')}
            name="oneLinerEn"
            value={oneLinerEn}
            onChange={(e) => setOneLinerEn(e.target.value)}
            error={errorFor('oneLinerEn')}
            required
            translateButton={
              <TranslateButton
                koValue={oneLinerKo}
                existingEnValue={oneLinerEn}
                fieldLabel={t('projects.fields.oneLinerEn')}
                context="One-line project description for the project card"
                onTranslated={setOneLinerEn}
              />
            }
          />
        </div>

        <RadioGroupField
          label={t('projects.fields.dateGranularity')}
          name="dateGranularity"
          defaultValue={initial?.dateGranularity ?? 'month'}
          options={[
            { value: 'month', label: t('projects.fields.granularityMonth') },
            { value: 'day', label: t('projects.fields.granularityDay') },
          ]}
        />

        <div className="grid gap-5 md:grid-cols-2">
          <DateMonthField
            label={t('projects.fields.startDate')}
            name="startDate"
            defaultValue={initial?.startDate}
            error={errorFor('startDate')}
            required
          />
          <div className="space-y-2">
            <DateMonthField
              label={t('projects.fields.endDate')}
              name="endDate"
              value={isPresent ? '' : endDate}
              onChange={(e) => setEndDate(e.target.value)}
              error={errorFor('endDate')}
              required={!isPresent}
              disabled={isPresent}
            />
            <label className="inline-flex cursor-pointer items-center gap-2 text-caption text-foreground-muted">
              <input
                type="checkbox"
                name="isPresent"
                checked={isPresent}
                onChange={(e) => setIsPresent(e.target.checked)}
                className="h-4 w-4 rounded-sm border-border accent-accent"
              />
              {t('common.present')}
            </label>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <InputField
            label={t('projects.fields.roleKo')}
            name="roleKo"
            value={roleKo}
            onChange={(e) => setRoleKo(e.target.value)}
            error={errorFor('roleKo')}
          />
          <InputField
            label={t('projects.fields.roleEn')}
            name="roleEn"
            value={roleEn}
            onChange={(e) => setRoleEn(e.target.value)}
            error={errorFor('roleEn')}
            translateButton={
              <TranslateButton
                koValue={roleKo}
                existingEnValue={roleEn}
                fieldLabel={t('projects.fields.roleEn')}
                context="My role on this project (e.g., Backend Lead)"
                onTranslated={setRoleEn}
              />
            }
          />
          <InputField
            label={t('projects.fields.teamSize')}
            name="teamSize"
            type="number"
            min={1}
            defaultValue={initial?.teamSize ?? ''}
            error={errorFor('teamSize')}
          />
          <InputField
            label={t('projects.fields.contribution')}
            name="contribution"
            type="number"
            min={1}
            max={100}
            defaultValue={initial?.contribution ?? ''}
            error={errorFor('contribution')}
          />
        </div>
      </Section>

      {/* Section: status */}
      <Section title={t('projects.sections.status')}>
        <CheckboxField
          label={t('projects.fields.pinned')}
          name="pinned"
          defaultChecked={initial?.pinned ?? false}
        />
        <CheckboxField
          label={t('projects.fields.visible')}
          name="visible"
          defaultChecked={initial?.visible ?? true}
        />
        <InputField
          label={t('projects.fields.order')}
          name="order"
          type="number"
          defaultValue={initial?.order ?? 0}
          hint={t('projects.hints.order')}
        />
      </Section>

      {/* Section: links */}
      <Section title={t('projects.sections.links')}>
        <InputField
          label={t('projects.fields.demoUrl')}
          name="demoUrl"
          type="url"
          defaultValue={initial?.demoUrl}
          error={errorFor('demoUrl')}
        />
        <InputField
          label={t('projects.fields.githubUrl')}
          name="githubUrl"
          type="url"
          defaultValue={initial?.githubUrl}
          error={errorFor('githubUrl')}
        />
        <div className="space-y-1.5">
          <span className="block text-caption font-medium text-foreground">
            {t('projects.fields.thumbnailUrl')}
          </span>
          <ImageUpload
            name="thumbnailUrl"
            defaultValue={initial?.thumbnailUrl}
            prefix={initial?.slug ? `project-thumb/${initial.slug}` : 'project-thumb'}
            shape="video"
            ariaLabel={t('projects.fields.thumbnailUrl')}
          />
          {errorFor('thumbnailUrl') ? (
            <p role="alert" className="inline-flex items-center gap-1 text-caption text-accent">
              <span aria-hidden>⚠</span>
              <span>{errorFor('thumbnailUrl')}</span>
            </p>
          ) : null}
        </div>
      </Section>

      {/* Section: skills */}
      <Section title={t('projects.sections.skills')}>
        <MultiSelect
          name="skillIds"
          options={skillOptions}
          defaultValue={initial?.skillIds}
          searchPlaceholder={t('projects.skillSearch')}
          emptyMessage={t('projects.skillEmpty')}
          onCreate={async (skillName) => {
            const created = await createSkillQuick(skillName);
            if (!created) return null;
            return {
              value: created.id,
              label: created.name,
              group: tSkillCategory(created.category),
            };
          }}
          createHint={t('multiSelect.createHint')}
        />
      </Section>

      {/* Section: description */}
      <Section title={t('projects.sections.description')}>
        <LangTabs
          koLabel="한국어"
          enLabel="English"
          koContent={
            <DescriptionPane
              ariaLabel={t('projects.fields.descriptionKo')}
              name="descriptionKo"
              value={descriptionKo}
              onChange={setDescriptionKo}
              error={errorFor('descriptionKo')}
            />
          }
          enContent={
            <DescriptionPane
              ariaLabel={t('projects.fields.descriptionEn')}
              name="descriptionEn"
              value={descriptionEn}
              onChange={setDescriptionEn}
              error={errorFor('descriptionEn')}
              translateButton={
                <TranslateButton
                  koValue={descriptionKo}
                  existingEnValue={descriptionEn}
                  fieldLabel={t('projects.fields.descriptionEn')}
                  context="Detailed project description (markdown)"
                  onTranslated={setDescriptionEn}
                />
              }
            />
          }
        />
      </Section>

      {/* Section: issues */}
      <Section title={t('projects.sections.issues')}>
        <IssueListEditor name="issues" initial={initialIssues} />
      </Section>

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5">
      <h3 className="border-b border-border pb-2 text-h3 text-foreground">{title}</h3>
      {children}
    </section>
  );
}

interface DescriptionPaneProps {
  name: string;
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  translateButton?: React.ReactNode;
}

function DescriptionPane({
  name,
  ariaLabel,
  value,
  onChange,
  error,
  translateButton,
}: DescriptionPaneProps) {
  return (
    <div className="space-y-1.5">
      {translateButton ? (
        <div className="flex justify-end">{translateButton}</div>
      ) : null}
      <MarkdownEditor
        name={name}
        value={value}
        onChange={onChange}
        rows={12}
        ariaLabel={ariaLabel}
        required
      />
      {error ? (
        <p role="alert" className="inline-flex items-center gap-1 text-caption text-accent">
          <span aria-hidden>⚠</span>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
