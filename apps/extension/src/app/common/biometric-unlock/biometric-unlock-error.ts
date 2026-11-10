import type { BiometricUnlockFailureCategory } from '@leather.io/analytics';

export class BiometricUnlockError extends Error {
  readonly category: BiometricUnlockFailureCategory;

  constructor(category: BiometricUnlockFailureCategory, message: string) {
    super(message);
    this.name = 'BiometricUnlockError';
    this.category = category;
  }
}

function isDomExceptionNamed(error: unknown, name: string) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    typeof error.name === 'string' &&
    error.name === name
  );
}

export function getBiometricUnlockFailureCategory(error: unknown): BiometricUnlockFailureCategory {
  if (error instanceof BiometricUnlockError) return error.category;
  if (isDomExceptionNamed(error, 'NotAllowedError') || isDomExceptionNamed(error, 'AbortError'))
    return 'canceled';
  if (isDomExceptionNamed(error, 'NotSupportedError')) return 'unavailable';
  return 'unknown';
}

const automaticPromptSuppressingCategories: readonly BiometricUnlockFailureCategory[] = [
  'credential-mismatch',
  'invalid-config',
  'no-prf',
  'wallet-validation',
];

export function shouldSuppressAutomaticPrompt(category: BiometricUnlockFailureCategory) {
  return automaticPromptSuppressingCategories.includes(category);
}
