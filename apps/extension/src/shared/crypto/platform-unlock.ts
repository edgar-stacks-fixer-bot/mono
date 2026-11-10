import { base64urlnopad } from '@scure/base';
import { bytesToHex, hexToBytes } from '@stacks/common';
import { z } from 'zod';

const platformUnlockConfigVersion = 1;
const platformUnlockAdditionalDataPrefix = 'leather-platform-unlock-v1';
const walletEncryptionKeyByteLength = 48;
const prfOutputByteLength = 32;
const prfInputByteLength = 32;
const registrationTagByteLength = 9;
const ivByteLength = 12;
const aesGcmTagByteLength = 16;
const maxCredentialIdByteLength = 1023;
const walletEncryptionKeyPattern = /^[0-9a-f]{96}$/;

export function encodeBase64Url(bytes: Uint8Array) {
  return base64urlnopad.encode(bytes);
}

export function decodeCanonicalBase64Url(value: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]*$/.test(value)) return null;
  try {
    const bytes = base64urlnopad.decode(value);
    return base64urlnopad.encode(bytes) === value ? bytes : null;
  } catch {
    return null;
  }
}

function canonicalBase64UrlField(isValidLength: (byteLength: number) => boolean) {
  return z.string().refine(value => {
    const bytes = decodeCanonicalBase64Url(value);
    return bytes !== null && isValidLength(bytes.length);
  });
}

const platformUnlockConfigSchema = z.strictObject({
  version: z.literal(platformUnlockConfigVersion),
  credentialId: canonicalBase64UrlField(
    length => length > 0 && length <= maxCredentialIdByteLength
  ),
  prfInput: canonicalBase64UrlField(length => length === prfInputByteLength),
  registrationTag: canonicalBase64UrlField(length => length === registrationTagByteLength),
  iv: canonicalBase64UrlField(length => length === ivByteLength),
  wrappedEncryptionKey: canonicalBase64UrlField(
    length => length === walletEncryptionKeyByteLength + aesGcmTagByteLength
  ),
});

export type PlatformUnlockConfig = z.infer<typeof platformUnlockConfigSchema>;

export function parsePlatformUnlockConfig(value: unknown): PlatformUnlockConfig | null {
  const result = platformUnlockConfigSchema.safeParse(value);
  return result.success ? result.data : null;
}

function decodeConfigField(value: string) {
  const bytes = decodeCanonicalBase64Url(value);
  if (!bytes) throw new Error('Invalid platform unlock config');
  return bytes;
}

export function toArrayBuffer(bytes: Uint8Array) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

export function getPlatformUnlockAdditionalData(credentialId: string, registrationTag: string) {
  return new TextEncoder().encode(
    `${platformUnlockAdditionalDataPrefix}:${credentialId}:${registrationTag}`
  );
}

function generateRandomBytes(byteLength: number) {
  return crypto.getRandomValues(new Uint8Array(byteLength));
}

export function generatePrfInput() {
  return encodeBase64Url(generateRandomBytes(prfInputByteLength));
}

export function generateRegistrationTag() {
  return encodeBase64Url(generateRandomBytes(registrationTagByteLength));
}

export function generateWalletEncryptionKey() {
  return bytesToHex(generateRandomBytes(walletEncryptionKeyByteLength));
}

export function isWalletEncryptionKey(value: string) {
  return walletEncryptionKeyPattern.test(value);
}

async function importPrfOutputKey(prfOutput: Uint8Array, usage: KeyUsage) {
  if (prfOutput.length !== prfOutputByteLength) throw new Error('Invalid PRF output length');
  return crypto.subtle.importKey('raw', toArrayBuffer(prfOutput), { name: 'AES-GCM' }, false, [
    usage,
  ]);
}

interface WrapWalletEncryptionKeyArgs {
  encryptionKey: string;
  prfOutput: Uint8Array;
  credentialId: string;
  prfInput: string;
  registrationTag: string;
}
export async function wrapWalletEncryptionKey({
  encryptionKey,
  prfOutput,
  credentialId,
  prfInput,
  registrationTag,
}: WrapWalletEncryptionKeyArgs): Promise<PlatformUnlockConfig> {
  if (!isWalletEncryptionKey(encryptionKey)) throw new Error('Invalid wallet encryption key');
  const key = await importPrfOutputKey(prfOutput, 'encrypt');
  const iv = generateRandomBytes(ivByteLength);
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: toArrayBuffer(iv),
      additionalData: toArrayBuffer(getPlatformUnlockAdditionalData(credentialId, registrationTag)),
    },
    key,
    toArrayBuffer(hexToBytes(encryptionKey))
  );
  const config = parsePlatformUnlockConfig({
    version: platformUnlockConfigVersion,
    credentialId,
    prfInput,
    registrationTag,
    iv: encodeBase64Url(iv),
    wrappedEncryptionKey: encodeBase64Url(new Uint8Array(ciphertext)),
  });
  if (!config) throw new Error('Invalid platform unlock config');
  return config;
}

interface UnwrapWalletEncryptionKeyArgs {
  config: PlatformUnlockConfig;
  prfOutput: Uint8Array;
}
export async function unwrapWalletEncryptionKey({
  config,
  prfOutput,
}: UnwrapWalletEncryptionKeyArgs): Promise<string> {
  const validConfig = parsePlatformUnlockConfig(config);
  if (!validConfig) throw new Error('Invalid platform unlock config');
  const key = await importPrfOutputKey(prfOutput, 'decrypt');
  const plaintext = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: toArrayBuffer(decodeConfigField(validConfig.iv)),
      additionalData: toArrayBuffer(
        getPlatformUnlockAdditionalData(validConfig.credentialId, validConfig.registrationTag)
      ),
    },
    key,
    toArrayBuffer(decodeConfigField(validConfig.wrappedEncryptionKey))
  );
  const encryptionKey = bytesToHex(new Uint8Array(plaintext));
  if (!isWalletEncryptionKey(encryptionKey)) throw new Error('Invalid wallet encryption key');
  return encryptionKey;
}
