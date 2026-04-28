export type EducationActionState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; errors?: Record<string, string>; formError?: string };

export const educationInitialState: EducationActionState = { status: 'idle' };
