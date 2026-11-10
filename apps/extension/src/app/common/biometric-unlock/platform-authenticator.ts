import { secondsInMs } from '@leather.io/utils';

import {
  decodeCanonicalBase64Url,
  encodeBase64Url,
  toArrayBuffer,
} from '@shared/crypto/platform-unlock';

import { BiometricUnlockError } from './biometric-unlock-error';

const credentialTimeoutMs = secondsInMs(120);
const es256Algorithm = -7;
const relyingPartyName = 'Leather';
const userLabelPrefix = 'Leather biometric unlock';
const userLabelTagLength = 6;
const userIdByteLength = 16;
const challengeByteLength = 32;
const prfOutputByteLength = 32;

export function isPlatformAuthenticatorApiAvailable() {
  return (
    typeof PublicKeyCredential !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    'credentials' in navigator &&
    !!navigator.credentials
  );
}

export async function isBiometricUnlockAvailable() {
  if (!isPlatformAuthenticatorApiAvailable()) return false;
  try {
    if (!(await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())) return false;
    if (typeof PublicKeyCredential.getClientCapabilities !== 'function') return true;
    const capabilities = await PublicKeyCredential.getClientCapabilities();
    return capabilities['extension:prf'] !== false;
  } catch {
    return false;
  }
}

export function getBiometricUnlockUserLabel(registrationTag: string) {
  return `${userLabelPrefix} · ${registrationTag.slice(0, userLabelTagLength)}`;
}

function randomBuffer(byteLength: number) {
  return toArrayBuffer(crypto.getRandomValues(new Uint8Array(byteLength)));
}

function bufferSourceToBytes(source: BufferSource) {
  if (source instanceof ArrayBuffer) return new Uint8Array(source.slice(0));
  return new Uint8Array(source.buffer, source.byteOffset, source.byteLength).slice();
}

function decodeConfigBytes(value: string) {
  const bytes = decodeCanonicalBase64Url(value);
  if (!bytes || bytes.length === 0)
    throw new BiometricUnlockError('invalid-config', 'Invalid biometric unlock config');
  return bytes;
}

function readPrfOutput(credential: PublicKeyCredential) {
  const first = credential.getClientExtensionResults().prf?.results?.first;
  if (!first) return undefined;
  const prfOutput = bufferSourceToBytes(first);
  if (prfOutput.length !== prfOutputByteLength)
    throw new BiometricUnlockError('no-prf', 'Unexpected PRF output length');
  return prfOutput;
}

function areBytesEqual(a: Uint8Array, b: Uint8Array) {
  return a.length === b.length && a.every((byte, index) => byte === b[index]);
}

interface CreatePlatformCredentialArgs {
  prfInput: string;
  registrationTag: string;
}
export async function createPlatformCredential({
  prfInput,
  registrationTag,
}: CreatePlatformCredentialArgs) {
  if (!isPlatformAuthenticatorApiAvailable())
    throw new BiometricUnlockError('unavailable', 'Platform authenticator unavailable');

  const prfInputBytes = decodeConfigBytes(prfInput);
  const userLabel = getBiometricUnlockUserLabel(registrationTag);

  const credential = await navigator.credentials.create({
    publicKey: {
      rp: { name: relyingPartyName },
      user: { id: randomBuffer(userIdByteLength), name: userLabel, displayName: userLabel },
      challenge: randomBuffer(challengeByteLength),
      pubKeyCredParams: [{ type: 'public-key', alg: es256Algorithm }],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'discouraged',
        requireResidentKey: false,
      },
      attestation: 'none',
      timeout: credentialTimeoutMs,
      extensions: { prf: { eval: { first: toArrayBuffer(prfInputBytes) } } },
    },
  });

  if (!(credential instanceof PublicKeyCredential))
    throw new BiometricUnlockError('unknown', 'No platform credential was created');

  const prf = credential.getClientExtensionResults().prf;
  if (!prf || (prf.enabled !== true && !prf.results))
    throw new BiometricUnlockError('no-prf', 'Platform credential does not support PRF');

  return {
    credentialId: encodeBase64Url(new Uint8Array(credential.rawId)),
    prfOutput: readPrfOutput(credential),
  };
}

interface GetPlatformPrfOutputArgs {
  credentialId: string;
  prfInput: string;
}
export async function getPlatformPrfOutput({ credentialId, prfInput }: GetPlatformPrfOutputArgs) {
  if (!isPlatformAuthenticatorApiAvailable())
    throw new BiometricUnlockError('unavailable', 'Platform authenticator unavailable');

  const credentialIdBytes = decodeConfigBytes(credentialId);
  const prfInputBytes = decodeConfigBytes(prfInput);

  const credential = await navigator.credentials.get({
    publicKey: {
      challenge: randomBuffer(challengeByteLength),
      allowCredentials: [{ type: 'public-key', id: toArrayBuffer(credentialIdBytes) }],
      userVerification: 'required',
      timeout: credentialTimeoutMs,
      extensions: { prf: { eval: { first: toArrayBuffer(prfInputBytes) } } },
    },
  });

  if (!(credential instanceof PublicKeyCredential))
    throw new BiometricUnlockError('unknown', 'No platform credential was returned');

  if (!areBytesEqual(new Uint8Array(credential.rawId), credentialIdBytes))
    throw new BiometricUnlockError('credential-mismatch', 'Unexpected platform credential');

  const prfOutput = readPrfOutput(credential);
  if (!prfOutput) throw new BiometricUnlockError('no-prf', 'Platform credential returned no PRF');

  return prfOutput;
}
