'use server';

import Anthropic from '@anthropic-ai/sdk';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getApiKey } from '@/lib/admin-queries';
import type { MaskedSettings, SettingsActionState } from './types';

const KEY_PREFIX = 'sk-ant-';
const MIN_KEY_LEN = 30;

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

async function isAdmin(): Promise<boolean> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  return Boolean(email && getAdminEmails().includes(email));
}

function maskKey(key: string): string {
  if (key.length <= 12) return '•'.repeat(key.length);
  const head = key.slice(0, 8);
  const tail = key.slice(-4);
  return `${head}…${tail}`;
}

export async function getMaskedSettings(): Promise<MaskedSettings> {
  if (!(await isAdmin())) return { hasKey: false };
  const key = await getApiKey();
  if (!key) return { hasKey: false };
  return { hasKey: true, maskedKey: maskKey(key) };
}

export async function saveApiKey(
  _prev: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  if (!(await isAdmin())) return { status: 'error', formError: 'unauthorized' };

  const key = (formData.get('apiKey') ?? '').toString().trim();
  if (!key) return { status: 'error', formError: 'required' };
  if (!key.startsWith(KEY_PREFIX) || key.length < MIN_KEY_LEN) {
    return { status: 'error', formError: 'invalidApiKey' };
  }

  try {
    await prisma.settings.upsert({
      where: { id: 1 },
      update: { anthropicApiKey: key },
      create: { id: 1, anthropicApiKey: key },
    });
  } catch {
    return { status: 'error', formError: 'saveFailed' };
  }

  revalidatePath('/admin/settings');
  return { status: 'success' };
}

export async function deleteApiKey(): Promise<void> {
  if (!(await isAdmin())) return;
  try {
    await prisma.settings.update({
      where: { id: 1 },
      data: { anthropicApiKey: null },
    });
  } catch {
    // swallow
  }
  revalidatePath('/admin/settings');
}

export async function testApiKey(): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: 'unauthorized' };
  const apiKey = await getApiKey();
  if (!apiKey) return { ok: false, error: 'noApiKey' };

  try {
    const client = new Anthropic({ apiKey });
    await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 16,
      messages: [{ role: 'user', content: 'ping' }],
    });
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    console.error('[testApiKey] failed —', msg, err);
    return { ok: false, error: msg };
  }
}
