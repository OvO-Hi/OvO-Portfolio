// 이미지 업로드 제약. 서버(blob.ts)와 클라이언트(image-upload.tsx) 양쪽에서 공유.
// blob.ts 는 '@vercel/blob'(Node 전용)을 import 하므로 클라이언트에서 직접 import 할 수 없다.
// 상수만 이 파일로 분리해 양쪽에서 안전하게 재사용한다.
export const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export type ImageValidationCode = 'invalidType' | 'tooLarge' | 'empty';

/** 파일이 제약을 위반하면 코드를, 통과하면 null 을 반환. 서버/클라이언트 공용. */
export function checkImage(file: File): ImageValidationCode | null {
  if (!file || file.size === 0) return 'empty';
  if (file.size > MAX_BYTES) return 'tooLarge';
  if (!(ALLOWED_MIME as readonly string[]).includes(file.type)) return 'invalidType';
  return null;
}
