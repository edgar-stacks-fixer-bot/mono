import { isDeepEqual } from 'remeda';
import { z } from 'zod';

import {
  type PlatformUnlockConfig,
  parsePlatformUnlockConfig,
} from '@shared/crypto/platform-unlock';
import { isRecord } from '@shared/utils/is-record';

import { BiometricUnlockError } from '@app/common/biometric-unlock/biometric-unlock-error';

const persistedRootKey = 'persist:root';

const softwareKeyEntitySchema = z.looseObject({
  type: z.literal('software'),
  id: z.string().min(1),
  encryptedSecretKey: z.string().min(1),
});

const softwareKeysStateSchema = z.looseObject({
  ids: z.array(z.string()),
  entities: z.record(z.string(), softwareKeyEntitySchema),
  salt: z.string().optional(),
  authenticationMode: z.enum(['biometric-only', 'password']).optional(),
  platformUnlock: z.unknown().optional(),
});

interface ValidatedSoftwareKey {
  id: string;
  encryptedSecretKey: string;
}

type ValidatedSoftwareKeyState =
  | { authenticationMode: 'none' | 'password'; keys: ValidatedSoftwareKey[] }
  | {
      authenticationMode: 'biometric-only';
      platformUnlock: PlatformUnlockConfig;
      keys: ValidatedSoftwareKey[];
    };

function readValidatedKeys(state: z.infer<typeof softwareKeysStateSchema>) {
  const { ids, entities } = state;
  if (new Set(ids).size !== ids.length) return null;
  if (Object.keys(entities).length !== ids.length) return null;

  const keys: ValidatedSoftwareKey[] = [];
  for (const id of ids) {
    const entity = entities[id];
    if (!entity || entity.id !== id) return null;
    keys.push({ id, encryptedSecretKey: entity.encryptedSecretKey });
  }
  return keys;
}

export function parseSoftwareKeyState(value: unknown): ValidatedSoftwareKeyState | null {
  const result = softwareKeysStateSchema.safeParse(value);
  if (!result.success) return null;

  const state = result.data;
  const keys = readValidatedKeys(state);
  if (!keys) return null;

  if (state.authenticationMode === 'biometric-only') {
    const platformUnlock = parsePlatformUnlockConfig(state.platformUnlock);
    if (!platformUnlock || state.salt !== undefined || keys.length === 0) return null;
    return { authenticationMode: 'biometric-only', platformUnlock, keys };
  }

  if (state.platformUnlock !== undefined) return null;

  return { authenticationMode: keys.length > 0 ? 'password' : 'none', keys };
}

export async function readPersistedSoftwareKeyState() {
  const stored = await chrome.storage.local.get<Record<string, unknown>>([persistedRootKey]);
  const persistedRoot = stored[persistedRootKey];
  if (persistedRoot === undefined) return parseSoftwareKeyState({ ids: [], entities: {} });
  if (!isRecord(persistedRoot)) return null;
  if (persistedRoot.softwareKeys === undefined)
    return parseSoftwareKeyState({ ids: [], entities: {} });
  return parseSoftwareKeyState(persistedRoot.softwareKeys);
}

function invalidSoftwareKeyStateError() {
  return new BiometricUnlockError('invalid-config', 'Software key state is invalid or stale');
}

export async function assertPersistedSoftwareKeyStateMatches(expected: ValidatedSoftwareKeyState) {
  const persisted = await readPersistedSoftwareKeyState();
  if (!persisted || !isDeepEqual(persisted, expected)) throw invalidSoftwareKeyStateError();
}

export async function readValidatedSoftwareKeyState(inMemoryState: unknown) {
  const state = parseSoftwareKeyState(inMemoryState);
  if (!state) throw invalidSoftwareKeyStateError();
  await assertPersistedSoftwareKeyStateMatches(state);
  return state;
}
