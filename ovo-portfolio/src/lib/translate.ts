import Anthropic from '@anthropic-ai/sdk';

export type TranslateMode = 'fresh' | 'reference' | 'overwrite';

export interface TranslateInput {
  ko: string;
  existingEn?: string;
  mode: TranslateMode;
  context?: string;
}

export type TranslateOutcome =
  | { ok: true; en: string }
  | { ok: false; error: 'noApiKey' | 'koEmpty' | 'translateFailed' };

const BASE_SYSTEM = `You are a professional translator for a developer portfolio website. Translate Korean to natural, professional English suitable for a tech resume / portfolio. Keep technical terms in English (e.g., React, Next.js, OCR). For names of products or services, keep them as-is unless they have an established English name. Be concise and natural — avoid overly literal translation. Match the tone (formal but warm). Return only the translated English text — no quotes, no preface, no explanations.`;

/**
 * Pure helper — no auth check, no Next.js dependencies.
 * Caller must verify admin + supply API key.
 */
export async function callTranslate(
  apiKey: string,
  input: TranslateInput
): Promise<TranslateOutcome> {
  const ko = input.ko.trim();
  if (!ko) return { ok: false, error: 'koEmpty' };
  if (!apiKey) return { ok: false, error: 'noApiKey' };

  let systemPrompt = BASE_SYSTEM;
  if (input.context) {
    systemPrompt += `\n\nContext for this field: ${input.context}`;
  }
  if (input.mode === 'reference' && input.existingEn?.trim()) {
    systemPrompt += `\n\nThere is an existing English version for the same field: """${input.existingEn.trim()}""". Translate the new Korean text in a way that matches the style, tone, and terminology of the existing version. Do not return the existing version — produce a fresh translation that fits the new Korean source.`;
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: ko }],
    });

    const text = response.content
      .map((b) => ('text' in b ? b.text : ''))
      .join('')
      .trim();

    if (!text) return { ok: false, error: 'translateFailed' };
    return { ok: true, en: text };
  } catch (err) {
    const detail =
      err instanceof Error ? `${err.name}: ${err.message}` : JSON.stringify(err);
    console.error('[callTranslate] failed —', detail, err);
    return { ok: false, error: 'translateFailed' };
  }
}
