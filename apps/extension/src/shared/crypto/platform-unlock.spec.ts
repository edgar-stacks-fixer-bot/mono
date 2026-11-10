import {
  decodeCanonicalBase64Url,
  encodeBase64Url,
  generatePrfInput,
  generateRegistrationTag,
  generateWalletEncryptionKey,
  getPlatformUnlockAdditionalData,
  isWalletEncryptionKey,
  parsePlatformUnlockConfig,
  unwrapWalletEncryptionKey,
  wrapWalletEncryptionKey,
} from './platform-unlock';

const credentialId = encodeBase64Url(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));

function createPrfOutput(fill = 7) {
  return new Uint8Array(32).fill(fill);
}

function flipFirstCharacter(value: string) {
  const bytes = decodeCanonicalBase64Url(value);
  if (!bytes) throw new Error('Invalid test value');
  bytes[0] = bytes[0] ^ 0xff;
  return encodeBase64Url(bytes);
}

async function createConfig(encryptionKey = generateWalletEncryptionKey()) {
  const config = await wrapWalletEncryptionKey({
    encryptionKey,
    prfOutput: createPrfOutput(),
    credentialId,
    prfInput: generatePrfInput(),
    registrationTag: generateRegistrationTag(),
  });
  return { config, encryptionKey };
}

describe('platform unlock', () => {
  test('generates a 48-byte wallet encryption key as 96 hex characters', () => {
    const encryptionKey = generateWalletEncryptionKey();
    expect(encryptionKey).toMatch(/^[0-9a-f]{96}$/);
    expect(isWalletEncryptionKey(encryptionKey)).toBe(true);
    expect(generateWalletEncryptionKey()).not.toEqual(encryptionKey);
  });

  test('round trips a wrapped wallet encryption key', async () => {
    const { config, encryptionKey } = await createConfig();

    expect(config.version).toBe(1);
    expect(config.credentialId).toBe(credentialId);
    expect(decodeCanonicalBase64Url(config.iv)).toHaveLength(12);
    expect(JSON.stringify(config)).not.toContain(encryptionKey);
    await expect(
      unwrapWalletEncryptionKey({ config, prfOutput: createPrfOutput() })
    ).resolves.toEqual(encryptionKey);
  });

  test('uses a fresh IV for every wrap', async () => {
    const encryptionKey = generateWalletEncryptionKey();
    const first = await createConfig(encryptionKey);
    const second = await createConfig(encryptionKey);
    expect(first.config.iv).not.toEqual(second.config.iv);
  });

  test('rejects the wrong PRF output', async () => {
    const { config } = await createConfig();
    await expect(
      unwrapWalletEncryptionKey({ config, prfOutput: createPrfOutput(8) })
    ).rejects.toThrow();
  });

  test('rejects a PRF output that is not 32 bytes', async () => {
    const { config } = await createConfig();
    await expect(
      unwrapWalletEncryptionKey({ config, prfOutput: new Uint8Array(16) })
    ).rejects.toThrow('Invalid PRF output length');
  });

  test('rejects a tampered IV', async () => {
    const { config } = await createConfig();
    await expect(
      unwrapWalletEncryptionKey({
        config: { ...config, iv: flipFirstCharacter(config.iv) },
        prfOutput: createPrfOutput(),
      })
    ).rejects.toThrow();
  });

  test('rejects tampered ciphertext', async () => {
    const { config } = await createConfig();
    await expect(
      unwrapWalletEncryptionKey({
        config: {
          ...config,
          wrappedEncryptionKey: flipFirstCharacter(config.wrappedEncryptionKey),
        },
        prfOutput: createPrfOutput(),
      })
    ).rejects.toThrow();
  });

  test('rejects tampered additional data', async () => {
    const { config } = await createConfig();
    await expect(
      unwrapWalletEncryptionKey({
        config: { ...config, credentialId: flipFirstCharacter(config.credentialId) },
        prfOutput: createPrfOutput(),
      })
    ).rejects.toThrow();
    await expect(
      unwrapWalletEncryptionKey({
        config: { ...config, registrationTag: flipFirstCharacter(config.registrationTag) },
        prfOutput: createPrfOutput(),
      })
    ).rejects.toThrow();
  });

  test('binds the additional data to the credential id and registration tag', () => {
    expect(new TextDecoder().decode(getPlatformUnlockAdditionalData('abc', 'def'))).toBe(
      'leather-platform-unlock-v1:abc:def'
    );
  });

  test('refuses to wrap a key that is not 96 hex characters', async () => {
    await expect(
      wrapWalletEncryptionKey({
        encryptionKey: 'abcd',
        prfOutput: createPrfOutput(),
        credentialId,
        prfInput: generatePrfInput(),
        registrationTag: generateRegistrationTag(),
      })
    ).rejects.toThrow('Invalid wallet encryption key');
  });

  describe(decodeCanonicalBase64Url.name, () => {
    test('decodes unpadded base64url', () => {
      expect(decodeCanonicalBase64Url('AQID')).toEqual(new Uint8Array([1, 2, 3]));
      expect(decodeCanonicalBase64Url('-_8')).toEqual(new Uint8Array([251, 255]));
    });

    test('rejects padding, standard base64 characters and non-canonical trailing bits', () => {
      expect(decodeCanonicalBase64Url('AQI=')).toBeNull();
      expect(decodeCanonicalBase64Url('+/8')).toBeNull();
      expect(decodeCanonicalBase64Url('AQJ')).toBeNull();
      expect(decodeCanonicalBase64Url('A')).toBeNull();
      expect(decodeCanonicalBase64Url('AQ ID')).toBeNull();
    });
  });

  describe(parsePlatformUnlockConfig.name, () => {
    test('accepts a valid config', async () => {
      const { config } = await createConfig();
      expect(parsePlatformUnlockConfig(config)).toEqual(config);
    });

    test('rejects non-canonical base64url fields', async () => {
      const { config } = await createConfig();
      expect(parsePlatformUnlockConfig({ ...config, iv: `${config.iv}=` })).toBeNull();
      expect(
        parsePlatformUnlockConfig({ ...config, prfInput: `+${config.prfInput.slice(1)}` })
      ).toBeNull();
      expect(parsePlatformUnlockConfig({ ...config, credentialId: 'AQIDBAUGBwh' })).toBeNull();
    });

    test('rejects fields of the wrong length, unknown versions and extra fields', async () => {
      const { config } = await createConfig();
      expect(
        parsePlatformUnlockConfig({ ...config, iv: encodeBase64Url(new Uint8Array(16)) })
      ).toBeNull();
      expect(
        parsePlatformUnlockConfig({ ...config, prfInput: encodeBase64Url(new Uint8Array(16)) })
      ).toBeNull();
      expect(
        parsePlatformUnlockConfig({
          ...config,
          wrappedEncryptionKey: encodeBase64Url(new Uint8Array(48)),
        })
      ).toBeNull();
      expect(parsePlatformUnlockConfig({ ...config, credentialId: '' })).toBeNull();
      expect(parsePlatformUnlockConfig({ ...config, version: 2 })).toBeNull();
      expect(parsePlatformUnlockConfig({ ...config, encryptionKey: 'abc' })).toBeNull();
      expect(parsePlatformUnlockConfig(undefined)).toBeNull();
    });

    test('rejects a config that fails validation when unwrapping', async () => {
      const { config } = await createConfig();
      await expect(
        unwrapWalletEncryptionKey({
          config: { ...config, iv: `${config.iv}=` },
          prfOutput: createPrfOutput(),
        })
      ).rejects.toThrow('Invalid platform unlock config');
    });
  });
});
