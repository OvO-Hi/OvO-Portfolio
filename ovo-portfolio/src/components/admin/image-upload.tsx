'use client';

import {
  useId,
  useRef,
  useState,
  useTransition,
  type DragEvent,
} from 'react';
import { useTranslations } from 'next-intl';
import { ImagePlus, Trash2, Upload } from 'lucide-react';
import { uploadImageAction } from '@/lib/upload-action';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
  prefix: string;
  shape?: 'square' | 'circle' | 'video';
  ariaLabel?: string;
}

export function ImageUpload({
  name,
  defaultValue = '',
  prefix,
  shape = 'square',
  ariaLabel,
}: ImageUploadProps) {
  const [url, setUrl] = useState<string>(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const t = useTranslations('admin');
  const inputId = useId();

  const upload = (file: File) => {
    setError(null);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('prefix', prefix);
    startTransition(async () => {
      const result = await uploadImageAction(fd);
      if (!result) {
        // 서버 액션이 값 없이 종료된 경우(예상치 못한 예외 등) 방어.
        console.error('[ImageUpload] uploadImageAction 결과가 비어 있습니다.', result);
        setError(t('errors.uploadFailed'));
        return;
      }
      if (result.ok) {
        setUrl(result.url);
      } else {
        setError(t(`errors.${result.code === 'unauthorized' ? 'unauthorized' : result.code}`));
      }
    });
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    upload(file);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    onFile(file);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const remove = () => {
    setUrl('');
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const aspect =
    shape === 'circle' ? 'aspect-square' : shape === 'video' ? 'aspect-video' : 'aspect-square';
  const round = shape === 'circle' ? 'rounded-full' : 'rounded-sm';
  const previewSize = shape === 'circle' ? 'max-w-[160px]' : 'max-w-[420px]';

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="space-y-2">
          <div
            className={cn(
              'relative overflow-hidden border border-border bg-background-muted',
              aspect,
              round,
              previewSize,
              'w-full'
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={ariaLabel ?? ''}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={pending}
              className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-border bg-transparent px-2.5 text-caption text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] disabled:opacity-60"
            >
              <Upload className="h-3.5 w-3.5" aria-hidden />
              <span>{pending ? t('imageUpload.uploading') : t('imageUpload.choose')}</span>
            </button>
            <button
              type="button"
              onClick={remove}
              disabled={pending}
              className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-border bg-transparent px-2.5 text-caption text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] disabled:opacity-60"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
              <span>{t('imageUpload.remove')}</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={cn(
            'flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed bg-background-subtle px-4 py-8 text-center transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]',
            isDragging
              ? 'border-accent bg-accent-subtle text-accent'
              : 'border-border text-foreground-muted hover:border-border-strong hover:text-foreground'
          )}
        >
          <ImagePlus className="h-5 w-5" aria-hidden />
          <p className="text-body">{pending ? t('imageUpload.uploading') : t('imageUpload.drop')}</p>
          <p className="text-caption text-foreground-subtle">{t('imageUpload.constraints')}</p>
        </div>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => onFile(e.target.files?.[0])}
        className="hidden"
        aria-label={ariaLabel}
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
