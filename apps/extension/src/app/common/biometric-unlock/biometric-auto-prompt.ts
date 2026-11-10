import type { BiometricUnlockFailureCategory } from '@leather.io/analytics';

import { shouldSuppressAutomaticPrompt } from './biometric-unlock-error';

const automaticPromptSuppressedKey = 'biometricUnlockAutomaticPromptSuppressed';

let hasClaimedAutomaticPrompt = false;

export function claimBiometricAutomaticPrompt() {
  if (hasClaimedAutomaticPrompt) return false;
  hasClaimedAutomaticPrompt = true;
  return true;
}

export async function isBiometricAutomaticPromptSuppressed() {
  try {
    const stored = await chrome.storage.session.get([automaticPromptSuppressedKey]);
    return stored[automaticPromptSuppressedKey] === true;
  } catch {
    return true;
  }
}

export async function suppressBiometricAutomaticPrompt() {
  return chrome.storage.session.set({ [automaticPromptSuppressedKey]: true });
}

export async function clearBiometricAutomaticPromptSuppression() {
  return chrome.storage.session.remove(automaticPromptSuppressedKey);
}

export async function recordBiometricUnlockFailure(category: BiometricUnlockFailureCategory) {
  if (shouldSuppressAutomaticPrompt(category)) await suppressBiometricAutomaticPrompt();
}
