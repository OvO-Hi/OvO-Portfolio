import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/utils';

interface FieldShellProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  translateButton?: React.ReactNode;
  children: React.ReactNode;
}

function FieldShell({
  label,
  htmlFor,
  hint,
  error,
  required,
  translateButton,
  children,
}: FieldShellProps) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor={htmlFor}
          className="block text-caption font-medium text-foreground"
        >
          {label}
          {required ? (
            <span aria-hidden className="ml-1 text-accent">
              *
            </span>
          ) : null}
        </label>
        {translateButton}
      </div>
      {children}
      {hint && !error ? (
        <p id={hintId} className="text-caption text-foreground-subtle">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="inline-flex items-center gap-1 text-caption text-accent"
        >
          <span aria-hidden>⚠</span>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  cn(
    'block w-full rounded-sm border bg-background-subtle px-3 py-2 text-body text-foreground placeholder:text-foreground-subtle',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
    hasError
      ? 'border-accent focus-visible:ring-[var(--accent)]'
      : 'border-border hover:border-border-strong focus-visible:ring-[var(--border-strong)] focus-visible:border-border-strong'
  );

interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'> {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  translateButton?: React.ReactNode;
}

export function InputField({
  label,
  name,
  hint,
  error,
  required,
  type = 'text',
  translateButton,
  ...props
}: InputFieldProps) {
  const id = `field-${name}`;
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      required={required}
      translateButton={translateButton}
    >
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hint && !error ? `${id}-hint` : null, error ? `${id}-error` : null]
          .filter(Boolean)
          .join(' ') || undefined}
        className={inputClass(Boolean(error))}
        {...props}
      />
    </FieldShell>
  );
}

interface TextareaFieldProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'className'> {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  translateButton?: React.ReactNode;
}

export function TextareaField({
  label,
  name,
  hint,
  error,
  required,
  rows = 4,
  translateButton,
  ...props
}: TextareaFieldProps) {
  const id = `field-${name}`;
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      required={required}
      translateButton={translateButton}
    >
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hint && !error ? `${id}-hint` : null, error ? `${id}-error` : null]
          .filter(Boolean)
          .join(' ') || undefined}
        className={cn(inputClass(Boolean(error)), 'resize-y leading-[1.6]')}
        {...props}
      />
    </FieldShell>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'className'> {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
}

export function SelectField({
  label,
  name,
  options,
  hint,
  error,
  required,
  ...props
}: SelectFieldProps) {
  const id = `field-${name}`;
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      required={required}
    >
      <select
        id={id}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hint && !error ? `${id}-hint` : null, error ? `${id}-error` : null]
          .filter(Boolean)
          .join(' ') || undefined}
        className={cn(inputClass(Boolean(error)), 'appearance-none pr-8')}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function DateMonthField({
  label,
  name,
  hint,
  error,
  required,
  ...props
}: Omit<InputFieldProps, 'type'>) {
  return (
    <InputField
      label={label}
      name={name}
      type="month"
      hint={hint}
      error={error}
      required={required}
      placeholder="YYYY-MM"
      {...props}
    />
  );
}

interface CheckboxFieldProps {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}

export function CheckboxField({ label, name, defaultChecked, hint }: CheckboxFieldProps) {
  const id = `field-${name}`;
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="inline-flex cursor-pointer items-center gap-2 text-body text-foreground"
      >
        <input
          type="checkbox"
          id={id}
          name={name}
          defaultChecked={defaultChecked}
          className="h-4 w-4 rounded-sm border-border accent-accent"
        />
        {label}
      </label>
      {hint ? (
        <p className="text-caption text-foreground-subtle">{hint}</p>
      ) : null}
    </div>
  );
}

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupFieldProps {
  label: string;
  name: string;
  options: RadioOption[];
  defaultValue?: string;
  hint?: string;
}

export function RadioGroupField({
  label,
  name,
  options,
  defaultValue,
  hint,
}: RadioGroupFieldProps) {
  const id = `field-${name}`;
  return (
    <FieldShell label={label} htmlFor={id} hint={hint}>
      <div role="radiogroup" aria-labelledby={`${id}-label`} className="flex flex-wrap gap-4">
        {options.map((opt) => {
          const optId = `${id}-${opt.value}`;
          return (
            <label
              key={opt.value}
              htmlFor={optId}
              className="inline-flex cursor-pointer items-center gap-2 text-body text-foreground-muted"
            >
              <input
                type="radio"
                id={optId}
                name={name}
                value={opt.value}
                defaultChecked={defaultValue === opt.value}
                className="h-4 w-4 accent-accent"
              />
              {opt.label}
            </label>
          );
        })}
      </div>
    </FieldShell>
  );
}
