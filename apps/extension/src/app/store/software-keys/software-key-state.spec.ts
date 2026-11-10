import { encodeBase64Url } from '@shared/crypto/platform-unlock';

import {
  assertPersistedSoftwareKeyStateMatches,
  parseSoftwareKeyState,
  readPersistedSoftwareKeyState,
  readValidatedSoftwareKeyState,
} from './software-key-state';

const platformUnlock = {
  version: 1,
  credentialId: encodeBase64Url(new Uint8Array([1, 2, 3, 4])),
  prfInput: encodeBase64Url(new Uint8Array(32).fill(1)),
  registrationTag: encodeBase64Url(new Uint8Array(9).fill(2)),
  iv: encodeBase64Url(new Uint8Array(12).fill(3)),
  wrappedEncryptionKey: encodeBase64Url(new Uint8Array(64).fill(4)),
};

const key = { type: 'software', id: 'abcd1234', encryptedSecretKey: 'encrypted' };
const keys = { ids: [key.id], entities: { [key.id]: key } };
const validatedKeys = [{ id: key.id, encryptedSecretKey: key.encryptedSecretKey }];

const biometricState = { ...keys, authenticationMode: 'biometric-only', platformUnlock };

describe(parseSoftwareKeyState.name, () => {
  test('treats a profile without keys as having no unlock method', () => {
    expect(parseSoftwareKeyState({ ids: [], entities: {} })).toEqual({
      authenticationMode: 'none',
      keys: [],
    });
    expect(parseSoftwareKeyState({ ids: [], entities: {}, salt: 'stale-salt' })).toEqual({
      authenticationMode: 'none',
      keys: [],
    });
  });

  test('treats keys without a mode as a legacy password profile', () => {
    expect(parseSoftwareKeyState({ ...keys, salt: 'salt' })).toEqual({
      authenticationMode: 'password',
      keys: validatedKeys,
    });
    expect(parseSoftwareKeyState(keys)).toEqual({
      authenticationMode: 'password',
      keys: validatedKeys,
    });
  });

  test('accepts a password profile', () => {
    expect(
      parseSoftwareKeyState({ ...keys, salt: 'salt', authenticationMode: 'password' })
    ).toEqual({ authenticationMode: 'password', keys: validatedKeys });
  });

  test('accepts a biometric-only profile', () => {
    expect(parseSoftwareKeyState(biometricState)).toEqual({
      authenticationMode: 'biometric-only',
      platformUnlock,
      keys: validatedKeys,
    });
  });

  test('keeps the two unlock methods exclusive', () => {
    expect(parseSoftwareKeyState({ ...biometricState, salt: 'salt' })).toBeNull();
    expect(
      parseSoftwareKeyState({
        ...keys,
        salt: 'salt',
        authenticationMode: 'password',
        platformUnlock,
      })
    ).toBeNull();
    expect(parseSoftwareKeyState({ ...keys, platformUnlock })).toBeNull();
  });

  test('rejects a biometric-only profile with a missing or malformed config', () => {
    expect(parseSoftwareKeyState({ ...keys, authenticationMode: 'biometric-only' })).toBeNull();
    expect(
      parseSoftwareKeyState({
        ...biometricState,
        platformUnlock: { ...platformUnlock, iv: `${platformUnlock.iv}=` },
      })
    ).toBeNull();
    expect(parseSoftwareKeyState({ ...biometricState, ids: [], entities: {} })).toBeNull();
  });

  test('rejects unknown modes and malformed keys', () => {
    expect(parseSoftwareKeyState({ ...keys, authenticationMode: 'pin' })).toBeNull();
    expect(parseSoftwareKeyState({ ...keys, ids: ['other'] })).toBeNull();
    expect(parseSoftwareKeyState({ ...keys, ids: [key.id, key.id] })).toBeNull();
    expect(
      parseSoftwareKeyState({ ids: [key.id], entities: { [key.id]: { ...key, id: 'other' } } })
    ).toBeNull();
    expect(
      parseSoftwareKeyState({ ids: [key.id], entities: { [key.id]: { ...key, type: 'ledger' } } })
    ).toBeNull();
    expect(parseSoftwareKeyState(undefined)).toBeNull();
  });
});

describe(readPersistedSoftwareKeyState.name, () => {
  test('reads and validates the software keys slice from persist:root', async () => {
    await chrome.storage.local.set({ 'persist:root': { softwareKeys: biometricState } });
    await expect(readPersistedSoftwareKeyState()).resolves.toEqual({
      authenticationMode: 'biometric-only',
      platformUnlock,
      keys: validatedKeys,
    });
  });

  test('treats a missing store as a profile without keys', async () => {
    await expect(readPersistedSoftwareKeyState()).resolves.toEqual({
      authenticationMode: 'none',
      keys: [],
    });
  });

  test('rejects a malformed store', async () => {
    await chrome.storage.local.set({ 'persist:root': 'corrupt' });
    await expect(readPersistedSoftwareKeyState()).resolves.toBeNull();
    await chrome.storage.local.set({ 'persist:root': { softwareKeys: { ids: 'x' } } });
    await expect(readPersistedSoftwareKeyState()).resolves.toBeNull();
  });
});

describe(readValidatedSoftwareKeyState.name, () => {
  test('returns the in-memory state when it matches persisted state', async () => {
    await chrome.storage.local.set({ 'persist:root': { softwareKeys: biometricState } });
    await expect(readValidatedSoftwareKeyState(biometricState)).resolves.toMatchObject({
      authenticationMode: 'biometric-only',
    });
  });

  test('fails closed when in-memory state is stale or invalid', async () => {
    await chrome.storage.local.set({
      'persist:root': {
        softwareKeys: {
          ...biometricState,
          platformUnlock: { ...platformUnlock, credentialId: 'AQID' },
        },
      },
    });
    await expect(readValidatedSoftwareKeyState(biometricState)).rejects.toMatchObject({
      category: 'invalid-config',
    });
    await expect(readValidatedSoftwareKeyState({ ids: 'x' })).rejects.toMatchObject({
      category: 'invalid-config',
    });
  });
});

describe(assertPersistedSoftwareKeyStateMatches.name, () => {
  test('rejects a persisted state that changed', async () => {
    const expected = parseSoftwareKeyState(biometricState);
    if (!expected) throw new Error('Invalid fixture');
    await chrome.storage.local.set({ 'persist:root': { softwareKeys: biometricState } });
    await expect(assertPersistedSoftwareKeyStateMatches(expected)).resolves.toBeUndefined();

    await chrome.storage.local.set({ 'persist:root': { softwareKeys: { ids: [], entities: {} } } });
    await expect(assertPersistedSoftwareKeyStateMatches(expected)).rejects.toMatchObject({
      category: 'invalid-config',
    });
  });
});
