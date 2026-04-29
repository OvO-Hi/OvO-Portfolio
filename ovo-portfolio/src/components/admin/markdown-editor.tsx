'use client';

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Bold, Code, Heading, Italic, Link as LinkIcon, List, Square } from 'lucide-react';
import { Markdown } from '@/components/ui/markdown';
import { cn } from '@/lib/utils';

interface MarkdownEditorProps {
  name?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  required?: boolean;
  placeholder?: string;
  ariaLabel?: string;
}

type MobileTab = 'edit' | 'preview';

export function MarkdownEditor({
  name,
  defaultValue,
  value: valueProp,
  onChange,
  rows = 10,
  required,
  placeholder,
  ariaLabel,
}: MarkdownEditorProps) {
  const t = useTranslations('admin.markdown');
  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? '');
  const value = isControlled ? valueProp : internal;

  const [previewValue, setPreviewValue] = useState(value);
  const [tab, setTab] = useState<MobileTab>('edit');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const tabIdBase = useId();

  // Debounced preview update
  useEffect(() => {
    const handle = window.setTimeout(() => setPreviewValue(value), 150);
    return () => window.clearTimeout(handle);
  }, [value]);

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const wrapSelection = useCallback(
    (before: string, after: string = before) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = value.slice(start, end);
      const next = value.slice(0, start) + before + selected + after + value.slice(end);
      setValue(next);
      requestAnimationFrame(() => {
        ta.focus();
        const cursorStart = start + before.length;
        const cursorEnd = end + before.length;
        ta.setSelectionRange(cursorStart, cursorEnd);
      });
    },
    [setValue, value]
  );

  const insertAtLineStart = useCallback(
    (prefix: string) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const before = value.slice(0, start);
      const lineStart = before.lastIndexOf('\n') + 1;
      const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
      setValue(next);
      requestAnimationFrame(() => {
        ta.focus();
        const pos = start + prefix.length;
        ta.setSelectionRange(pos, pos);
      });
    },
    [setValue, value]
  );

  const insertLink = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end) || 'text';
    const insertion = `[${selected}](https://)`;
    const next = value.slice(0, start) + insertion + value.slice(end);
    setValue(next);
    requestAnimationFrame(() => {
      ta.focus();
      // Cursor inside the URL part for quick paste
      const urlStart = start + selected.length + 3;
      const urlEnd = urlStart + 'https://'.length;
      ta.setSelectionRange(urlStart, urlEnd);
    });
  }, [setValue, value]);

  const insertCodeBlock = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const before = value.slice(0, start);
    const needsLeadingNewline = before.length > 0 && !before.endsWith('\n');
    const insertion = `${needsLeadingNewline ? '\n' : ''}\`\`\`\n${selected}\n\`\`\`\n`;
    const next = before + insertion + value.slice(end);
    setValue(next);
    requestAnimationFrame(() => {
      ta.focus();
      const innerStart = start + (needsLeadingNewline ? 1 : 0) + 4;
      const innerEnd = innerStart + selected.length;
      ta.setSelectionRange(innerStart, innerEnd);
    });
  }, [setValue, value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.metaKey || e.ctrlKey)) return;
    if (e.key === 'b' || e.key === 'B') {
      e.preventDefault();
      wrapSelection('**');
    } else if (e.key === 'i' || e.key === 'I') {
      e.preventDefault();
      wrapSelection('*');
    } else if (e.key === 'k' || e.key === 'K') {
      e.preventDefault();
      insertLink();
    }
  };

  const toolBtn = cn(
    'inline-flex h-8 w-8 items-center justify-center rounded-sm text-foreground-muted transition-colors duration-150',
    'hover:bg-background-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]'
  );

  const textareaClass = cn(
    'block w-full resize-y rounded-sm border border-border bg-background-subtle px-3 py-2 font-mono text-[13px] leading-[1.6] text-foreground placeholder:text-foreground-subtle',
    'transition-colors duration-150 hover:border-border-strong',
    'focus-visible:outline-none focus-visible:border-border-strong focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]'
  );

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div
        role="toolbar"
        aria-label="Markdown tools"
        className="flex flex-wrap items-center gap-0.5 rounded-sm border border-border bg-background-subtle p-1"
      >
        <button
          type="button"
          aria-label={t('tools.bold')}
          title={t('tools.bold')}
          onClick={() => wrapSelection('**')}
          className={toolBtn}
        >
          <Bold className="h-3.5 w-3.5" aria-hidden />
        </button>
        <button
          type="button"
          aria-label={t('tools.italic')}
          title={t('tools.italic')}
          onClick={() => wrapSelection('*')}
          className={toolBtn}
        >
          <Italic className="h-3.5 w-3.5" aria-hidden />
        </button>
        <button
          type="button"
          aria-label={t('tools.link')}
          title={t('tools.link')}
          onClick={insertLink}
          className={toolBtn}
        >
          <LinkIcon className="h-3.5 w-3.5" aria-hidden />
        </button>
        <button
          type="button"
          aria-label={t('tools.code')}
          title={t('tools.code')}
          onClick={() => wrapSelection('`')}
          className={toolBtn}
        >
          <Code className="h-3.5 w-3.5" aria-hidden />
        </button>
        <button
          type="button"
          aria-label={t('tools.codeBlock')}
          title={t('tools.codeBlock')}
          onClick={insertCodeBlock}
          className={toolBtn}
        >
          <Square className="h-3.5 w-3.5" aria-hidden />
        </button>
        <button
          type="button"
          aria-label={t('tools.heading')}
          title={t('tools.heading')}
          onClick={() => insertAtLineStart('## ')}
          className={toolBtn}
        >
          <Heading className="h-3.5 w-3.5" aria-hidden />
        </button>
        <button
          type="button"
          aria-label={t('tools.list')}
          title={t('tools.list')}
          onClick={() => insertAtLineStart('- ')}
          className={toolBtn}
        >
          <List className="h-3.5 w-3.5" aria-hidden />
        </button>

        {/* Mobile-only tabs (right-aligned) */}
        <div role="tablist" aria-label="View" className="ml-auto flex md:hidden">
          {(['edit', 'preview'] as MobileTab[]).map((mode) => {
            const isActive = tab === mode;
            return (
              <button
                key={mode}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tabIdBase}-${mode}`}
                onClick={() => setTab(mode)}
                className={cn(
                  'h-7 px-2.5 text-caption transition-colors duration-150',
                  isActive ? 'text-foreground' : 'text-foreground-subtle hover:text-foreground-muted'
                )}
              >
                {t(mode === 'edit' ? 'tabEdit' : 'tabPreview')}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {/* Editor pane */}
        <div
          id={`${tabIdBase}-edit`}
          role="tabpanel"
          className={cn('md:block', tab === 'edit' ? 'block' : 'hidden')}
        >
          <textarea
            ref={textareaRef}
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={rows}
            required={required}
            placeholder={placeholder}
            aria-label={ariaLabel}
            className={textareaClass}
          />
        </div>

        {/* Preview pane */}
        <div
          id={`${tabIdBase}-preview`}
          role="tabpanel"
          aria-live="polite"
          className={cn(
            'min-h-[120px] overflow-auto rounded-sm border border-border bg-background px-3 py-2',
            'md:block',
            tab === 'preview' ? 'block' : 'hidden'
          )}
        >
          {previewValue.trim() ? (
            <Markdown>{previewValue}</Markdown>
          ) : (
            <p className="text-caption text-foreground-subtle">{t('previewEmpty')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
