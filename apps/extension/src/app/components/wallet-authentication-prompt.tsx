import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { useIsBiometricOnlyProfile } from '@app/store/software-keys/software-key.selectors';

import { BiometricAuthenticationCard } from './biometric-authentication-card';
import { RequestPassword } from './request-password';

interface WalletAuthenticationPromptProps {
  biometricTitle: string;
  biometricDescription?: string;
  onSuccess(): void;
  isAutomaticPromptEnabled?: boolean;
}
export function WalletAuthenticationPrompt({
  biometricTitle,
  biometricDescription,
  onSuccess,
  isAutomaticPromptEnabled,
}: WalletAuthenticationPromptProps) {
  const isBiometricOnlyProfile = useIsBiometricOnlyProfile();
  const { unlockWalletWithBiometrics } = useKeyActions();

  if (!isBiometricOnlyProfile) return <RequestPassword onSuccess={onSuccess} />;

  return (
    <BiometricAuthenticationCard
      title={biometricTitle}
      description={biometricDescription}
      authenticate={unlockWalletWithBiometrics}
      onSuccess={onSuccess}
      isAutomaticPromptEnabled={isAutomaticPromptEnabled}
    />
  );
}
