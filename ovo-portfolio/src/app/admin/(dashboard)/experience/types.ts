export type ExperienceActionState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; errors?: Record<string, string>; formError?: string };

export const experienceInitialState: ExperienceActionState = { status: 'idle' };
