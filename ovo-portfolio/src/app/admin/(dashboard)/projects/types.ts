export type ProjectActionState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; errors?: Record<string, string>; formError?: string };

export const projectInitialState: ProjectActionState = { status: 'idle' };

export interface IssueDraft {
  titleKo: string;
  titleEn: string;
  problemKo: string;
  problemEn: string;
  solutionKo: string;
  solutionEn: string;
  outcomeKo: string;
  outcomeEn: string;
}
