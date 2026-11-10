import { useCallback, useEffect, useState } from 'react';

import { analytics } from '@shared/utils/analytics';

import { isActionPopupWindow } from './action-popup-classifier';
import {
  claimBiometricAutomaticPrompt,
  isBiometricAutomaticPromptSuppressed,
  recordBiometricUnlockFailure,
} from './biometric-auto-prompt';
import { getBiometricUnlockFailureCategory } from './biometric-unlock-error';

const biometricUnlockFailedMessage = "Biometric unlock didn't work. Try again.";

interface UseBiometricAuthenticationArgs {
  authenticate(): unknown;
  onSuccess(): void;
  isAutomaticPromptEnabled?: boolean;
}
export function useBiometricAuthentication({
  authenticate,
  onSuccess,
  isAutomaticPromptEnabled = false,
}: UseBiometricAuthenticationArgs) {
  const [isRunning, setIsRunning] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [error, setError] = useState('');

  const runAuthentication = useCallback(async () => {
    setIsRunning(true);
    setError('');
    analytics.track('biometric_unlock_attempt_started');
    try {
      await authenticate();
      analytics.track('biometric_unlock_attempt_completed');
      setIsRunning(false);
      onSuccess();
    } catch (e) {
      const category = getBiometricUnlockFailureCategory(e);
      if (category === 'canceled') {
        analytics.track('biometric_unlock_attempt_canceled');
      } else {
        analytics.track('biometric_unlock_attempt_failed', { category });
        setError(biometricUnlockFailedMessage);
      }
      await recordBiometricUnlockFailure(category);
      setHasFailed(true);
      setIsRunning(false);
    }
  }, [authenticate, onSuccess]);

  useEffect(() => {
    if (!isAutomaticPromptEnabled) return;
    let isCancelled = false;

    async function promptAutomatically() {
      if (!isActionPopupWindow(window)) return;
      if (await isBiometricAutomaticPromptSuppressed()) return;
      if (isCancelled || !claimBiometricAutomaticPrompt()) return;
      await runAuthentication();
    }

    void promptAutomatically();
    return () => {
      isCancelled = true;
    };
  }, [isAutomaticPromptEnabled, runAuthentication]);

  return { isRunning, hasFailed, error, authenticate: runAuthentication };
}
