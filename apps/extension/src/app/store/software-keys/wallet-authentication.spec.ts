import { generateMnemonic, getMnemonicRootKeyFingerprint } from '@leather.io/crypto';
import { userAddsWallet } from '@leather.io/state/wallet';

import { encryptMnemonicWithEncryptionKey } from '@shared/crypto/mnemonic-encryption';
import {
  decodeCanonicalBase64Url,
  encodeBase64Url,
  generateWalletEncryptionKey,
  unwrapWalletEncryptionKey,
} from '@shared/crypto/platform-unlock';

import {
  createPlatformCredential,
  getPlatformPrfOutput,
} from '@app/common/biometric-unlock/platform-authenticator';
import { initalizeWalletSession } from '@app/store/session-restore';

import * as inMemoryStore from '../in-memory-key/in-memory-storage';
import { keyActions } from './software-key.actions';
import { keyAdapter, keySlice } from './software-key.slice';
import {
  decryptSoftwareKeysWithEncryptionKey,
  enrollBiometricUnlock,
  getBiometricWalletEncryptionKey,
} from './wallet-authentication';

vi.mock('@app/store/store', () => ({
  persistor: { flush: vi.fn(() => Promise.resolve()) },
  store: { getState: vi.fn(), dispatch: vi.fn() },
}));

vi.mock('@app/store/session-restore', () => ({
  getWalletSessionKey: vi.fn(() => Promise.resolve({ success: false })),
  initalizeWalletSession: vi.fn(() => Promise.resolve()),
}));

vi.mock('@app/common/account-restoration/account-restore', () => ({
  recurseAccountsForActivity: vi.fn(() => Promise.resolve(0)),
}));

vi.mock('@app/common/initial-search-params', () => ({
  initialSearchParams: new URLSearchParams(),
}));

vi.mock('@shared/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}));

vi.mock('@shared/messages', () => ({
  broadcastWalletListChanged: vi.fn(),
  broadcastReplayAction: vi.fn(),
}));

vi.mock('@shared/utils/analytics', () => ({
  identifyUser: vi.fn(),
}));

vi.mock('@leather.io/services', () => ({
  getLeatherApiClient: vi.fn(),
  getHiroStacksApiClient: vi.fn(),
  getBnsV2ApiClient: vi.fn(),
}));

vi.mock('../in-memory-key/in-memory-storage', () => ({
  setKey: vi.fn(),
  getKey: vi.fn(),
  hasKey: vi.fn(),
  removeKey: vi.fn(),
  clearAll: vi.fn(),
  subscribe: vi.fn(),
  getSnapshot: vi.fn(),
}));

vi.mock('@app/common/biometric-unlock/platform-authenticator', () => ({
  createPlatformCredential: vi.fn(),
  getPlatformPrfOutput: vi.fn(),
}));

const credentialId = encodeBase64Url(new Uint8Array([4, 3, 2, 1]));
const prfOutput = new Uint8Array(32).fill(3);

const discoveryClients = {
  leatherApiClient: {
    fetchUtxosByAddress: vi.fn().mockResolvedValue([]),
    fetchBitcoinTransactionsByAddress: vi.fn().mockResolvedValue({ data: [], meta: {} }),
  },
  hiroClient: {
    getAddressStxBalance: vi.fn().mockResolvedValue({ balance: '0' }),
    getAddressTransactions: vi.fn().mockResolvedValue([]),
  },
  bnsClient: { fetchAddressBnsNames: vi.fn().mockResolvedValue({ names: [] }) },
};

function createLockManager() {
  return {
    async request(_name: string, _options: unknown, callback: () => Promise<unknown>) {
      return callback();
    },
  };
}

function createWallet() {
  const mnemonic = generateMnemonic();
  return { mnemonic, fingerprint: getMnemonicRootKeyFingerprint(mnemonic) };
}

type SoftwareKeysState = ReturnType<typeof keySlice.reducer>;

async function seedPersistedSoftwareKeys(softwareKeys: unknown) {
  await chrome.storage.local.set({ 'persist:root': { softwareKeys } });
}

function createThunkHarness(softwareKeys: SoftwareKeysState) {
  let state = { softwareKeys };
  const getState = vi.fn();
  getState.mockImplementation(() => state);
  const dispatch = vi.fn<(action: unknown) => unknown>();
  dispatch.mockImplementation(action => {
    if (keySlice.actions.biometricSoftwareWalletComplete.match(action)) {
      state = { softwareKeys: keySlice.reducer(state.softwareKeys, action) };
    }
    return action;
  });
  return {
    dispatch,
    getState,
    readSoftwareKeys() {
      return state.softwareKeys;
    },
    readDispatchedActions(): unknown[] {
      return dispatch.mock.calls.map(([action]) => action);
    },
  };
}

async function runWith(
  thunk: ReturnType<typeof keyActions.unlockWalletWithBiometricsAction>,
  harness: ReturnType<typeof createThunkHarness>
) {
  return thunk(harness.dispatch, harness.getState, undefined);
}

async function createBiometricProfile(wallets: ReturnType<typeof createWallet>[]) {
  vi.mocked(createPlatformCredential).mockResolvedValue({ credentialId, prfOutput });
  const { encryptionKey, platformUnlock } = await enrollBiometricUnlock();
  vi.mocked(createPlatformCredential).mockReset();

  const keys = await Promise.all(
    wallets.map(async wallet => ({
      type: 'software' as const,
      id: wallet.fingerprint,
      encryptedSecretKey: await encryptMnemonicWithEncryptionKey(wallet.mnemonic, encryptionKey),
    }))
  );
  const softwareKeys = {
    ...keyAdapter.addMany(keyAdapter.getInitialState(), keys),
    authenticationMode: 'biometric-only' as const,
    platformUnlock,
  };
  return { encryptionKey, platformUnlock, softwareKeys };
}

beforeEach(() => {
  vi.mocked(createPlatformCredential).mockReset();
  vi.mocked(getPlatformPrfOutput).mockReset();
  vi.mocked(getPlatformPrfOutput).mockResolvedValue(prfOutput);
  vi.mocked(initalizeWalletSession).mockClear();
  vi.mocked(inMemoryStore.setKey).mockClear();
  vi.stubGlobal('navigator', { locks: createLockManager() });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe(enrollBiometricUnlock.name, () => {
  test('wraps a fresh 96 hex character key under the PRF output from registration', async () => {
    vi.mocked(createPlatformCredential).mockResolvedValue({ credentialId, prfOutput });

    const { encryptionKey, platformUnlock } = await enrollBiometricUnlock();

    expect(encryptionKey).toMatch(/^[0-9a-f]{96}$/);
    expect(platformUnlock.credentialId).toBe(credentialId);
    expect(getPlatformPrfOutput).not.toHaveBeenCalled();
    await expect(unwrapWalletEncryptionKey({ config: platformUnlock, prfOutput })).resolves.toBe(
      encryptionKey
    );
    const { prfInput, registrationTag } = vi.mocked(createPlatformCredential).mock.calls[0][0];
    expect(platformUnlock.prfInput).toBe(prfInput);
    expect(platformUnlock.registrationTag).toBe(registrationTag);
    expect(decodeCanonicalBase64Url(prfInput)).toHaveLength(32);
  });

  test('asserts the new credential when registration returns no PRF output', async () => {
    vi.mocked(createPlatformCredential).mockResolvedValue({ credentialId, prfOutput: undefined });

    const { platformUnlock } = await enrollBiometricUnlock();

    expect(getPlatformPrfOutput).toHaveBeenCalledWith({
      credentialId,
      prfInput: platformUnlock.prfInput,
    });
  });

  test('fails when the credential cannot be created', async () => {
    vi.mocked(createPlatformCredential).mockRejectedValue(new Error('canceled'));
    await expect(enrollBiometricUnlock()).rejects.toThrow('canceled');
  });
});

describe(getBiometricWalletEncryptionKey.name, () => {
  test('unwraps the wallet encryption key with the PRF output of the enrolled credential', async () => {
    const { encryptionKey, platformUnlock } = await createBiometricProfile([]);
    await expect(getBiometricWalletEncryptionKey(platformUnlock)).resolves.toBe(encryptionKey);
    expect(getPlatformPrfOutput).toHaveBeenCalledWith({
      credentialId,
      prfInput: platformUnlock.prfInput,
    });
  });

  test('rejects the wrong PRF output as an invalid config', async () => {
    const { platformUnlock } = await createBiometricProfile([]);
    vi.mocked(getPlatformPrfOutput).mockResolvedValue(new Uint8Array(32).fill(9));
    await expect(getBiometricWalletEncryptionKey(platformUnlock)).rejects.toMatchObject({
      category: 'invalid-config',
    });
  });

  test('rejects a malformed config without prompting', async () => {
    const { platformUnlock } = await createBiometricProfile([]);
    await expect(
      getBiometricWalletEncryptionKey({ ...platformUnlock, iv: 'not canonical' })
    ).rejects.toMatchObject({ category: 'invalid-config' });
    expect(getPlatformPrfOutput).not.toHaveBeenCalled();
  });
});

describe(decryptSoftwareKeysWithEncryptionKey.name, () => {
  test('decrypts every key and checks its fingerprint', async () => {
    const wallet = createWallet();
    const encryptionKey = generateWalletEncryptionKey();
    const encryptedSecretKey = await encryptMnemonicWithEncryptionKey(
      wallet.mnemonic,
      encryptionKey
    );

    await expect(
      decryptSoftwareKeysWithEncryptionKey(
        [{ id: wallet.fingerprint, encryptedSecretKey }],
        encryptionKey
      )
    ).resolves.toEqual([{ fingerprint: wallet.fingerprint, secretKey: wallet.mnemonic }]);

    await expect(
      decryptSoftwareKeysWithEncryptionKey([{ id: 'deadbeef', encryptedSecretKey }], encryptionKey)
    ).rejects.toMatchObject({ category: 'wallet-validation' });

    await expect(
      decryptSoftwareKeysWithEncryptionKey(
        [{ id: wallet.fingerprint, encryptedSecretKey }],
        generateWalletEncryptionKey()
      )
    ).rejects.toMatchObject({ category: 'wallet-validation' });
  });
});

describe('biometric wallet thunks', () => {
  test('creates the first wallet in a biometric-only profile', async () => {
    const wallet = createWallet();
    const emptyState = keyAdapter.getInitialState();
    await seedPersistedSoftwareKeys(emptyState);
    vi.mocked(createPlatformCredential).mockResolvedValue({ credentialId, prfOutput });
    const harness = createThunkHarness(emptyState);

    await runWith(keyActions.setWalletBiometricUnlock({ ...wallet, ...discoveryClients }), harness);

    const softwareKeys = harness.readSoftwareKeys();
    expect(softwareKeys.authenticationMode).toBe('biometric-only');
    expect(softwareKeys.salt).toBeUndefined();
    expect(softwareKeys.platformUnlock).toMatchObject({ version: 1, credentialId });
    expect(softwareKeys.ids).toEqual([wallet.fingerprint]);
    expect(harness.readDispatchedActions().some(action => userAddsWallet.match(action))).toBe(true);

    const [encryptionKey] = vi.mocked(initalizeWalletSession).mock.calls[0];
    expect(encryptionKey).toMatch(/^[0-9a-f]{96}$/);
    expect(JSON.stringify(softwareKeys)).not.toContain(encryptionKey);
    expect(inMemoryStore.setKey).toHaveBeenCalledWith(wallet.fingerprint, wallet.mnemonic);
  });

  test('adds a second wallet with the existing biometric key', async () => {
    const firstWallet = createWallet();
    const secondWallet = createWallet();
    const { encryptionKey, softwareKeys } = await createBiometricProfile([firstWallet]);
    await seedPersistedSoftwareKeys(softwareKeys);
    const harness = createThunkHarness(softwareKeys);

    await runWith(
      keyActions.setWalletBiometricUnlock({ ...secondWallet, ...discoveryClients }),
      harness
    );

    expect(createPlatformCredential).not.toHaveBeenCalled();
    expect(initalizeWalletSession).toHaveBeenCalledWith(encryptionKey);
    expect(harness.readSoftwareKeys().ids).toEqual([
      firstWallet.fingerprint,
      secondWallet.fingerprint,
    ]);
    expect(harness.readSoftwareKeys().platformUnlock).toEqual(softwareKeys.platformUnlock);
  });

  test('refuses to add biometrics to a password profile', async () => {
    const wallet = createWallet();
    const passwordState = {
      ...keyAdapter.addOne(keyAdapter.getInitialState(), {
        type: 'software',
        id: 'abcd1234',
        encryptedSecretKey: 'encrypted',
      }),
      salt: 'salt',
    };
    await seedPersistedSoftwareKeys(passwordState);
    const harness = createThunkHarness(passwordState);

    await expect(
      runWith(keyActions.setWalletBiometricUnlock({ ...wallet, ...discoveryClients }), harness)
    ).rejects.toMatchObject({ category: 'wallet-validation' });
    expect(createPlatformCredential).not.toHaveBeenCalled();
    expect(harness.readDispatchedActions()).toEqual([]);
  });

  test('refuses to commit when persisted state changed during enrollment', async () => {
    const wallet = createWallet();
    const emptyState = keyAdapter.getInitialState();
    await seedPersistedSoftwareKeys(emptyState);
    vi.mocked(createPlatformCredential).mockImplementation(async () => {
      await seedPersistedSoftwareKeys({
        ...keyAdapter.addOne(keyAdapter.getInitialState(), {
          type: 'software',
          id: 'abcd1234',
          encryptedSecretKey: 'encrypted',
        }),
        salt: 'salt',
      });
      return { credentialId, prfOutput };
    });
    const harness = createThunkHarness(emptyState);

    await expect(
      runWith(keyActions.setWalletBiometricUnlock({ ...wallet, ...discoveryClients }), harness)
    ).rejects.toMatchObject({ category: 'invalid-config' });
    expect(initalizeWalletSession).not.toHaveBeenCalled();
    expect(harness.readDispatchedActions()).toEqual([]);
  });

  test('unlocks a biometric-only profile', async () => {
    const wallet = createWallet();
    const { encryptionKey, softwareKeys } = await createBiometricProfile([wallet]);
    await seedPersistedSoftwareKeys(softwareKeys);
    await chrome.storage.session.set({ biometricUnlockAutomaticPromptSuppressed: true });

    await runWith(keyActions.unlockWalletWithBiometricsAction(), createThunkHarness(softwareKeys));

    expect(initalizeWalletSession).toHaveBeenCalledWith(encryptionKey);
    expect(inMemoryStore.setKey).toHaveBeenCalledWith(wallet.fingerprint, wallet.mnemonic);
    await expect(
      chrome.storage.session.get(['biometricUnlockAutomaticPromptSuppressed'])
    ).resolves.toEqual({});
  });

  test('rejects unlock when persisted state is stale or missing', async () => {
    const wallet = createWallet();
    const { softwareKeys } = await createBiometricProfile([wallet]);
    await seedPersistedSoftwareKeys({ ...softwareKeys, ids: [], entities: {} });

    await expect(
      runWith(keyActions.unlockWalletWithBiometricsAction(), createThunkHarness(softwareKeys))
    ).rejects.toMatchObject({ category: 'invalid-config' });
    expect(getPlatformPrfOutput).not.toHaveBeenCalled();

    await chrome.storage.local.clear();
    await expect(
      runWith(keyActions.unlockWalletWithBiometricsAction(), createThunkHarness(softwareKeys))
    ).rejects.toMatchObject({ category: 'invalid-config' });
    expect(initalizeWalletSession).not.toHaveBeenCalled();
  });

  test('rejects unlock when a key does not belong to its wallet', async () => {
    const wallet = createWallet();
    const otherWallet = createWallet();
    const { softwareKeys } = await createBiometricProfile([wallet]);
    const mismatchedState = {
      ...softwareKeys,
      ids: [otherWallet.fingerprint],
      entities: {
        [otherWallet.fingerprint]: {
          ...softwareKeys.entities[wallet.fingerprint],
          id: otherWallet.fingerprint,
        },
      },
    };
    await seedPersistedSoftwareKeys(mismatchedState);

    await expect(
      runWith(keyActions.unlockWalletWithBiometricsAction(), createThunkHarness(mismatchedState))
    ).rejects.toMatchObject({ category: 'wallet-validation' });
    expect(initalizeWalletSession).not.toHaveBeenCalled();
  });

  test('refuses password unlock in a biometric-only profile', async () => {
    const wallet = createWallet();
    const { softwareKeys } = await createBiometricProfile([wallet]);

    await expect(
      runWith(keyActions.unlockWalletAction('password'), createThunkHarness(softwareKeys))
    ).rejects.toThrow('This profile is unlocked with biometrics');
  });
});
