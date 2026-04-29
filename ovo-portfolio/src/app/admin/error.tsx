'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[admin error boundary]', error);
  }, [error]);

  return (
    <div className="container-prose py-16">
      <div className="space-y-4 rounded-[8px] border border-border bg-background-subtle p-6">
        <h2 className="text-h2 text-foreground">문제가 발생했습니다</h2>
        <p className="text-body text-foreground-muted">
          어드민 페이지 렌더 중 에러가 발생했어요. 아래 메시지를 확인하고 다시 시도해보세요.
        </p>
        <pre className="overflow-auto rounded-sm border border-border bg-background p-3 text-caption text-foreground-subtle">
          {error.message}
          {error.digest ? `\n(digest: ${error.digest})` : ''}
        </pre>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-10 items-center rounded-sm bg-foreground px-4 text-body font-medium text-background transition-opacity duration-150 hover:opacity-90"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
