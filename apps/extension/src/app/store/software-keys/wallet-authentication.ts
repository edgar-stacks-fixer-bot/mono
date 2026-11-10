import { decryptMnemonic as decrypt } from '@stacks/encryption';

import { getMnemonicRootKeyFingerprint } from '@leather.io/crypto';

import {
  type PlatformUnlockConfig,
  generatePrfInput,
  generateRegistrationTag,
  generateWalletEncryptionKey,
  parsePlatformUnlockConfig,
  unwrapWalletEncryptionKey,
  wrapWalletEncryptionKey,
} from '@shared/crypto/platform-unlock';

import { BiometricUnlockError } from '@app/common/biometric-unlock/biometric-unlock-error';
import {
  createPlatformCredential,
  getPlatformPrfOutput,
} from '@app/common/biometric-unlock/platform-authenticator';

export async function enrollBiometricUnlock() {
  const prfInput = generatePrfInput();
  const registrationTag = generateRegistrationTag();

  const credential = await createPlatformCredential({ prfInput, registrationTag });
  const prfOutput =
    credential.prfOutput ??
    (await getPlatformPrfOutput({ credentialId: credential.credentialId, prfInput }));

  const encryptionKey = generateWalletEncryptionKey();
  const platformUnlock = await wrapWalletEncryptionKey({
    encryptionKey,
    prfOutput,
    credentialId: credential.credentialId,
    prfInput,
    registrationTag,
  });

  const unwrappedEncryptionKey = await unwrapWalletEncryptionKey({
    config: platformUnlock,
    prfOutput,
  });
  if (unwrappedEncryptionKey !== encryptionKey)
    throw new BiometricUnlockError('invalid-config', 'Biometric unlock enrollment did not verify');

  return { encryptionKey, platformUnlock };
}

export async function getBiometricWalletEncryptionKey(platformUnlock: PlatformUnlockConfig) {
  const config = parsePlatformUnlockConfig(platformUnlock);
  if (!config) throw new BiometricUnlockError('invalid-config', 'Invalid biometric unlock config');

  const prfOutput = await getPlatformPrfOutput({
    credentialId: config.credentialId,
    prfInput: config.prfInput,
  });

  try {
    return await unwrapWalletEncryptionKey({ config, prfOutput });
  } catch {
    throw new BiometricUnlockError('invalid-config', 'Could not unwrap wallet encryption key');
  }
}

interface EncryptedSoftwareKey {
  id: string;
  encryptedSecretKey: string;
}

async function decryptSoftwareKey(key: EncryptedSoftwareKey, encryptionKey: string) {
  try {
    const secretKey = await decrypt(key.encryptedSecretKey, encryptionKey);
    return { secretKey, fingerprint: getMnemonicRootKeyFingerprint(secretKey) };
  } catch {
    throw new BiometricUnlockError('wallet-validation', 'Could not decrypt a software key');
  }
}

export async function decryptSoftwareKeysWithEncryptionKey(
  keys: readonly EncryptedSoftwareKey[],
  encryptionKey: string
) {
  return Promise.all(
    keys.map(async key => {
      const { secretKey, fingerprint } = await decryptSoftwareKey(key, encryptionKey);
      if (fingerprint !== key.id)
        throw new BiometricUnlockError('wallet-validation', 'Software key fingerprint mismatch');
      return { fingerprint, secretKey };
    })
  );
}
