import { decodeCanonicalBase64Url, encodeBase64Url } from '@shared/crypto/platform-unlock';

import { BiometricUnlockError } from './biometric-unlock-error';
import {
  createPlatformCredential,
  getBiometricUnlockUserLabel,
  getPlatformPrfOutput,
  isBiometricUnlockAvailable,
  isPlatformAuthenticatorApiAvailable,
} from './platform-authenticator';

const credentialIdBytes = new Uint8Array([9, 8, 7, 6, 5, 4, 3, 2]);
const credentialId = encodeBase64Url(credentialIdBytes);
const prfInput = encodeBase64Url(new Uint8Array(32).fill(1));
const registrationTag = 'AbCdEfGhIjKl';

interface FakeExtensionResults {
  prf?: { enabled?: boolean; results?: { first: BufferSource } };
}

class FakePublicKeyCredential {
  static isUserVerifyingPlatformAuthenticatorAvailable = vi.fn(() => Promise.resolve(true));
  static getClientCapabilities = vi.fn(() =>
    Promise.resolve<Record<string, boolean>>({ 'extension:prf': true })
  );

  constructor(
    readonly rawId: ArrayBuffer,
    private readonly extensionResults: FakeExtensionResults
  ) {}

  getClientExtensionResults() {
    return this.extensionResults;
  }
}

function toBuffer(bytes: Uint8Array) {
  return bytes.slice().buffer;
}

const credentials = {
  create: vi.fn<(options: CredentialCreationOptions) => Promise<unknown>>(),
  get: vi.fn<(options: CredentialRequestOptions) => Promise<unknown>>(),
};

function readCreateOptions() {
  const [options] = credentials.create.mock.calls[0];
  if (!options.publicKey) throw new Error('Missing public key options');
  return options.publicKey;
}

function readRequestOptions() {
  const [options] = credentials.get.mock.calls[0];
  if (!options.publicKey) throw new Error('Missing public key options');
  return options.publicKey;
}

function readBytes(source: BufferSource | undefined) {
  if (!source) throw new Error('Missing buffer');
  if (source instanceof ArrayBuffer) return new Uint8Array(source);
  return new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
}

beforeEach(() => {
  credentials.create.mockReset();
  credentials.get.mockReset();
  FakePublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable.mockResolvedValue(true);
  FakePublicKeyCredential.getClientCapabilities.mockResolvedValue({ 'extension:prf': true });
  vi.stubGlobal('PublicKeyCredential', FakePublicKeyCredential);
  vi.stubGlobal('navigator', { credentials });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe(isPlatformAuthenticatorApiAvailable.name, () => {
  test('requires PublicKeyCredential and navigator.credentials', () => {
    expect(isPlatformAuthenticatorApiAvailable()).toBe(true);
    vi.stubGlobal('PublicKeyCredential', undefined);
    expect(isPlatformAuthenticatorApiAvailable()).toBe(false);
    vi.stubGlobal('PublicKeyCredential', FakePublicKeyCredential);
    vi.stubGlobal('navigator', {});
    expect(isPlatformAuthenticatorApiAvailable()).toBe(false);
  });
});

describe(isBiometricUnlockAvailable.name, () => {
  test('is available with a user-verifying platform authenticator and PRF', async () => {
    await expect(isBiometricUnlockAvailable()).resolves.toBe(true);
  });

  test('is unavailable without a user-verifying platform authenticator', async () => {
    FakePublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable.mockResolvedValue(false);
    await expect(isBiometricUnlockAvailable()).resolves.toBe(false);
  });

  test('is unavailable when the client reports no PRF support', async () => {
    FakePublicKeyCredential.getClientCapabilities.mockResolvedValue({ 'extension:prf': false });
    await expect(isBiometricUnlockAvailable()).resolves.toBe(false);
  });

  test('is unavailable without the WebAuthn API', async () => {
    vi.stubGlobal('PublicKeyCredential', undefined);
    await expect(isBiometricUnlockAvailable()).resolves.toBe(false);
  });
});

describe(getBiometricUnlockUserLabel.name, () => {
  test('labels the credential with a six character tag', () => {
    expect(getBiometricUnlockUserLabel(registrationTag)).toBe('Leather biometric unlock · AbCdEf');
  });
});

describe(createPlatformCredential.name, () => {
  test('creates a platform credential with the required options', async () => {
    const prfOutput = new Uint8Array(32).fill(4);
    credentials.create.mockResolvedValue(
      new FakePublicKeyCredential(toBuffer(credentialIdBytes), {
        prf: { enabled: true, results: { first: toBuffer(prfOutput) } },
      })
    );

    const result = await createPlatformCredential({ prfInput, registrationTag });

    expect(result).toEqual({ credentialId, prfOutput });
    const options = readCreateOptions();
    expect(options.rp).toEqual({ name: 'Leather' });
    expect(options.user.name).toBe('Leather biometric unlock · AbCdEf');
    expect(options.user.displayName).toBe('Leather biometric unlock · AbCdEf');
    expect(options.pubKeyCredParams).toEqual([{ type: 'public-key', alg: -7 }]);
    expect(options.authenticatorSelection).toEqual({
      authenticatorAttachment: 'platform',
      userVerification: 'required',
      residentKey: 'discouraged',
      requireResidentKey: false,
    });
    expect(options.attestation).toBe('none');
    expect(options.timeout).toBe(120000);
    expect(readBytes(options.extensions?.prf?.eval?.first)).toEqual(
      decodeCanonicalBase64Url(prfInput)
    );
  });

  test('returns no PRF output when the provider only reports PRF as enabled', async () => {
    credentials.create.mockResolvedValue(
      new FakePublicKeyCredential(toBuffer(credentialIdBytes), { prf: { enabled: true } })
    );
    await expect(createPlatformCredential({ prfInput, registrationTag })).resolves.toEqual({
      credentialId,
      prfOutput: undefined,
    });
  });

  test('rejects a provider without PRF', async () => {
    credentials.create.mockResolvedValue(
      new FakePublicKeyCredential(toBuffer(credentialIdBytes), { prf: { enabled: false } })
    );
    await expect(createPlatformCredential({ prfInput, registrationTag })).rejects.toMatchObject({
      category: 'no-prf',
    });

    credentials.create.mockResolvedValue(
      new FakePublicKeyCredential(toBuffer(credentialIdBytes), {})
    );
    await expect(createPlatformCredential({ prfInput, registrationTag })).rejects.toMatchObject({
      category: 'no-prf',
    });
  });

  test('rejects when no credential is created', async () => {
    credentials.create.mockResolvedValue(null);
    await expect(createPlatformCredential({ prfInput, registrationTag })).rejects.toBeInstanceOf(
      BiometricUnlockError
    );
  });

  test('rejects an invalid PRF input before prompting', async () => {
    await expect(
      createPlatformCredential({ prfInput: 'AQI=', registrationTag })
    ).rejects.toMatchObject({ category: 'invalid-config' });
    expect(credentials.create).not.toHaveBeenCalled();
  });
});

describe(getPlatformPrfOutput.name, () => {
  test('pins the assertion to the enrolled credential and returns the PRF output', async () => {
    const prfOutput = new Uint8Array(32).fill(5);
    credentials.get.mockResolvedValue(
      new FakePublicKeyCredential(toBuffer(credentialIdBytes), {
        prf: { results: { first: toBuffer(prfOutput) } },
      })
    );

    await expect(getPlatformPrfOutput({ credentialId, prfInput })).resolves.toEqual(prfOutput);

    const options = readRequestOptions();
    expect(options.allowCredentials).toHaveLength(1);
    expect(options.allowCredentials?.[0]?.type).toBe('public-key');
    expect(readBytes(options.allowCredentials?.[0]?.id)).toEqual(credentialIdBytes);
    expect(options.userVerification).toBe('required');
    expect(options.timeout).toBe(120000);
  });

  test('rejects a different credential id', async () => {
    credentials.get.mockResolvedValue(
      new FakePublicKeyCredential(toBuffer(new Uint8Array([1, 1, 1])), {
        prf: { results: { first: toBuffer(new Uint8Array(32)) } },
      })
    );
    await expect(getPlatformPrfOutput({ credentialId, prfInput })).rejects.toMatchObject({
      category: 'credential-mismatch',
    });
  });

  test('rejects a missing or malformed PRF output', async () => {
    credentials.get.mockResolvedValue(
      new FakePublicKeyCredential(toBuffer(credentialIdBytes), { prf: {} })
    );
    await expect(getPlatformPrfOutput({ credentialId, prfInput })).rejects.toMatchObject({
      category: 'no-prf',
    });

    credentials.get.mockResolvedValue(
      new FakePublicKeyCredential(toBuffer(credentialIdBytes), {
        prf: { results: { first: toBuffer(new Uint8Array(16)) } },
      })
    );
    await expect(getPlatformPrfOutput({ credentialId, prfInput })).rejects.toMatchObject({
      category: 'no-prf',
    });
  });

  test('rejects an invalid credential id before prompting', async () => {
    await expect(getPlatformPrfOutput({ credentialId: '', prfInput })).rejects.toMatchObject({
      category: 'invalid-config',
    });
    expect(credentials.get).not.toHaveBeenCalled();
  });

  test('passes through a canceled prompt', async () => {
    credentials.get.mockRejectedValue(new DOMException('canceled', 'NotAllowedError'));
    await expect(getPlatformPrfOutput({ credentialId, prfInput })).rejects.toMatchObject({
      name: 'NotAllowedError',
    });
  });
});
