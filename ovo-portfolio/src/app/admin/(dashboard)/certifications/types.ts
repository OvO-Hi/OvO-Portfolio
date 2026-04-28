export type CertificationActionState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; errors?: Record<string, string>; formError?: string };

export const certificationInitialState: CertificationActionState = { status: 'idle' };
