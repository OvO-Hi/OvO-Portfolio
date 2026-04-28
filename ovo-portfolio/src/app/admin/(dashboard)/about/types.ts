export type AboutActionState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; formError?: string };
