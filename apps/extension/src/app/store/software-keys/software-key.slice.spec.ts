import { resetWallet } from '@leather.io/state';
import { userRemovesWallet } from '@leather.io/state/wallet';

import { encodeBase64Url } from '@shared/crypto/platform-unlock';

import { initialKeysState, keyAdapter, keySlice } from './software-key.slice';

const platformUnlock = {
  version: 1 as const,
  credentialId: encodeBase64Url(new Uint8Array([1, 2, 3, 4])),
  prfInput: encodeBase64Url(new Uint8Array(32).fill(1)),
  registrationTag: encodeBase64Url(new Uint8Array(9).fill(2)),
  iv: encodeBase64Url(new Uint8Array(12).fill(3)),
  wrappedEncryptionKey: encodeBase64Url(new Uint8Array(64).fill(4)),
};

function createKey(id: string) {
  return { type: 'software' as const, id, encryptedSecretKey: `encrypted-${id}` };
}

const { reducer } = keySlice;
const { biometricSoftwareWalletComplete, createSoftwareWalletComplete } = keySlice.actions;

describe('software key slice', () => {
  test('marks a wallet created with a password as a password profile', () => {
    const state = reducer(
      initialKeysState,
      createSoftwareWalletComplete({ salt: 'salt', key: createKey('a') })
    );
    expect(state.authenticationMode).toBe('password');
    expect(state.salt).toBe('salt');
    expect(state.platformUnlock).toBeUndefined();
    expect(state.ids).toEqual(['a']);
  });

  test('marks a wallet created with biometrics as a biometric-only profile without a salt', () => {
    const state = reducer(
      { ...initialKeysState, salt: 'stale-salt' },
      biometricSoftwareWalletComplete({ platformUnlock, key: createKey('a') })
    );
    expect(state.authenticationMode).toBe('biometric-only');
    expect(state.platformUnlock).toEqual(platformUnlock);
    expect(state).not.toHaveProperty('salt');
  });

  test('adds further biometric wallets under the same config', () => {
    const first = reducer(
      initialKeysState,
      biometricSoftwareWalletComplete({ platformUnlock, key: createKey('a') })
    );
    const second = reducer(
      first,
      biometricSoftwareWalletComplete({ platformUnlock, key: createKey('b') })
    );
    expect(second.ids).toEqual(['a', 'b']);
    expect(second.platformUnlock).toEqual(platformUnlock);
  });

  test('keeps the unlock method while software wallets remain', () => {
    const state = reducer(
      {
        ...keyAdapter.addMany(initialKeysState, [createKey('a'), createKey('b')]),
        authenticationMode: 'biometric-only',
        platformUnlock,
      },
      userRemovesWallet({ fingerprint: 'a' })
    );
    expect(state.ids).toEqual(['b']);
    expect(state.authenticationMode).toBe('biometric-only');
    expect(state.platformUnlock).toEqual(platformUnlock);
  });

  test('clears the unlock method when the last software wallet is removed', () => {
    const biometric = reducer(
      {
        ...keyAdapter.addOne(initialKeysState, createKey('a')),
        authenticationMode: 'biometric-only',
        platformUnlock,
      },
      userRemovesWallet({ fingerprint: 'a' })
    );
    expect(biometric).toEqual(initialKeysState);

    const password = reducer(
      {
        ...keyAdapter.addOne(initialKeysState, createKey('a')),
        authenticationMode: 'password',
        salt: 'salt',
      },
      userRemovesWallet({ fingerprint: 'a' })
    );
    expect(password).toEqual(initialKeysState);
  });

  test('clears the unlock method on reset', () => {
    const state = reducer(
      {
        ...keyAdapter.addOne(initialKeysState, createKey('a')),
        authenticationMode: 'biometric-only',
        platformUnlock,
      },
      resetWallet()
    );
    expect(state).toEqual(initialKeysState);
  });
});
