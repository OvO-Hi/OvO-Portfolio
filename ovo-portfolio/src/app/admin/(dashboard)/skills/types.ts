export type SkillActionState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; errors?: Record<string, string>; formError?: string };

export const skillInitialState: SkillActionState = { status: 'idle' };
