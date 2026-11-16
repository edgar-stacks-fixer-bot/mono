import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { restoreWalletSession } from './session-restore';

const mocks = vi.hoisted(() => {
  const listeners = new Set<() => void>();
  const state = { _persist: { version: -1, rehydrated: false } };
  return {
    listeners,
    state,
    store: {
      getState() {
        return state;
      },
      subscribe(listener: () => void) {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
    },
    selectSoftwareKeys: vi.fn(),
    decryptMnemonic: vi.fn(),
    setKey: vi.fn(),
    sessionGet: vi.fn(),
  };
});

vi.mock('@app/store/store', () => ({ store: mocks.store }));

vi.mock('@app/store/software-keys/software-key.selectors', () => ({
  selectSoftwareKeys: mocks.selectSoftwareKeys,
}));

vi.mock('@stacks/encryption', () => ({ decryptMnemonic: mocks.decryptMnemonic }));

vi.mock('./in-memory-key/in-memory-storage', () => ({ setKey: mocks.setKey }));

const sessionKey = 'session-encryption-key';
const softwareKey = { id: 'fingerprint-1', encryptedSecretKey: 'encrypted-secret' };
const decryptedSecretKey = 'decrypted secret key';

function rehydrateStore() {
  mocks.state._persist.rehydrated = true;
  mocks.listeners.forEach(listener => listener());
}

async function flushPromises() {
  for (let tick = 0; tick < 5; tick++) await new Promise(resolve => setTimeout(resolve, 0));
}

beforeEach(() => {
  mocks.state._persist.rehydrated = false;
  mocks.listeners.clear();
  mocks.selectSoftwareKeys.mockReturnValue([softwareKey]);
  mocks.decryptMnemonic.mockResolvedValue(decryptedSecretKey);
  mocks.sessionGet.mockResolvedValue({ encryptionKey: sessionKey });
  vi.stubGlobal('chrome', {
    storage: {
      session: {
        get: mocks.sessionGet,
      },
    },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe(restoreWalletSession.name, () => {
  test('waits for the store to rehydrate before restoring the keys', async () => {
    const restoring = restoreWalletSession();
    await flushPromises();

    expect(mocks.selectSoftwareKeys).not.toHaveBeenCalled();
    expect(mocks.setKey).not.toHaveBeenCalled();

    rehydrateStore();
    await restoring;

    expect(mocks.decryptMnemonic).toHaveBeenCalledWith('encrypted-secret', sessionKey);
    expect(mocks.setKey).toHaveBeenCalledWith('fingerprint-1', decryptedSecretKey);
    expect(mocks.listeners.size).toBe(0);
  });

  test('restores the keys at once when the store is already rehydrated', async () => {
    mocks.state._persist.rehydrated = true;

    await restoreWalletSession();

    expect(mocks.setKey).toHaveBeenCalledWith('fingerprint-1', decryptedSecretKey);
    expect(mocks.listeners.size).toBe(0);
  });

  test('returns without waiting when there is no session key', async () => {
    mocks.sessionGet.mockResolvedValue({});

    await restoreWalletSession();

    expect(mocks.listeners.size).toBe(0);
    expect(mocks.selectSoftwareKeys).not.toHaveBeenCalled();
    expect(mocks.setKey).not.toHaveBeenCalled();
  });
});
