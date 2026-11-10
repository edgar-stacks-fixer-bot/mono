import {
  clearBiometricAutomaticPromptSuppression,
  isBiometricAutomaticPromptSuppressed,
  recordBiometricUnlockFailure,
  suppressBiometricAutomaticPrompt,
} from './biometric-auto-prompt';
import {
  BiometricUnlockError,
  getBiometricUnlockFailureCategory,
  shouldSuppressAutomaticPrompt,
} from './biometric-unlock-error';

describe('biometric automatic prompt', () => {
  test('claims the automatic prompt only once per page load', async () => {
    vi.resetModules();
    const { claimBiometricAutomaticPrompt } = await import('./biometric-auto-prompt');
    expect(claimBiometricAutomaticPrompt()).toBe(true);
    expect(claimBiometricAutomaticPrompt()).toBe(false);
  });

  test('is not suppressed by default', async () => {
    await expect(isBiometricAutomaticPromptSuppressed()).resolves.toBe(false);
  });

  test('stores suppression in session storage and clears it', async () => {
    await suppressBiometricAutomaticPrompt();
    await expect(isBiometricAutomaticPromptSuppressed()).resolves.toBe(true);
    await expect(
      chrome.storage.session.get(['biometricUnlockAutomaticPromptSuppressed'])
    ).resolves.toEqual({ biometricUnlockAutomaticPromptSuppressed: true });

    await clearBiometricAutomaticPromptSuppression();
    await expect(isBiometricAutomaticPromptSuppressed()).resolves.toBe(false);
  });

  test.each(['credential-mismatch', 'invalid-config', 'no-prf', 'wallet-validation'] as const)(
    'suppresses the automatic prompt after a %s failure',
    async category => {
      await recordBiometricUnlockFailure(category);
      await expect(isBiometricAutomaticPromptSuppressed()).resolves.toBe(true);
    }
  );

  test.each(['canceled', 'unavailable', 'unknown'] as const)(
    'keeps the automatic prompt after a %s failure',
    async category => {
      await recordBiometricUnlockFailure(category);
      await expect(isBiometricAutomaticPromptSuppressed()).resolves.toBe(false);
    }
  );
});

describe(getBiometricUnlockFailureCategory.name, () => {
  test('reads the category of a biometric unlock error', () => {
    expect(
      getBiometricUnlockFailureCategory(new BiometricUnlockError('invalid-config', 'invalid'))
    ).toBe('invalid-config');
  });

  test('treats a dismissed or timed out prompt as canceled', () => {
    expect(getBiometricUnlockFailureCategory(new DOMException('', 'NotAllowedError'))).toBe(
      'canceled'
    );
    expect(getBiometricUnlockFailureCategory(new DOMException('', 'AbortError'))).toBe('canceled');
  });

  test('treats unsupported requests as unavailable and anything else as unknown', () => {
    expect(getBiometricUnlockFailureCategory(new DOMException('', 'NotSupportedError'))).toBe(
      'unavailable'
    );
    expect(getBiometricUnlockFailureCategory(new Error('boom'))).toBe('unknown');
    expect(getBiometricUnlockFailureCategory(undefined)).toBe('unknown');
  });

  test('only suppresses the automatic prompt for failures a retry cannot fix', () => {
    expect(shouldSuppressAutomaticPrompt('no-prf')).toBe(true);
    expect(shouldSuppressAutomaticPrompt('canceled')).toBe(false);
  });
});
