export type SettingsActionState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; formError?: string };

export const settingsInitialState: SettingsActionState = { status: 'idle' };

export interface MaskedSettings {
  hasKey: boolean;
  maskedKey?: string;
}
