import { useState } from 'react';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box, Stack, styled } from 'leather-styles/jsx';

import { Button, Link, Logo } from '@leather.io/ui';

import { useBiometricAuthentication } from '@app/common/biometric-unlock/use-biometric-authentication';
import { Card, Page } from '@app/components/layout';
import { SignOut } from '@app/features/settings/sign-out/sign-out-confirm';

import { ErrorLabel } from './error-label';

interface BiometricAuthenticationCardProps {
  title: string;
  description?: string;
  authenticate(): unknown;
  onSuccess(): void;
  isAutomaticPromptEnabled?: boolean;
}
export function BiometricAuthenticationCard({
  title,
  description,
  authenticate,
  onSuccess,
  isAutomaticPromptEnabled,
}: BiometricAuthenticationCardProps) {
  const [showSignOut, setShowSignOut] = useState(false);
  const biometricAuthentication = useBiometricAuthentication({
    authenticate,
    onSuccess,
    isAutomaticPromptEnabled,
  });

  return (
    <Page>
      <Card
        contentStyle={{
          p: 'space.00',
        }}
        header={
          <styled.h1 p="space.04" hideBelow="sm">
            <Box px="space.02">
              <Logo />
            </Box>
          </styled.h1>
        }
        footer={
          <Stack gap="space.04" alignItems="center" width="100%">
            <Button
              data-testid={SettingsSelectors.BiometricUnlockBtn}
              disabled={biometricAuthentication.isRunning}
              aria-busy={biometricAuthentication.isRunning}
              onClick={() => void biometricAuthentication.authenticate()}
              variant="solid"
              fullWidth
            >
              {biometricAuthentication.hasFailed
                ? 'Try biometric unlock again'
                : 'Unlock with biometrics'}
            </Button>
            <Link
              data-testid={SettingsSelectors.BiometricRecoveryLink}
              onClick={() => setShowSignOut(true)}
              variant="text"
            >
              Can't use biometrics?
            </Link>
          </Stack>
        }
      >
        <Stack gap="space.05" px="space.05" minHeight="330px">
          <styled.h3 textStyle="heading.03">{title}</styled.h3>
          {description && <styled.p textStyle="label.02">{description}</styled.p>}
          {biometricAuthentication.error && (
            <ErrorLabel width="100%">{biometricAuthentication.error}</ErrorLabel>
          )}
        </Stack>
      </Card>
      {showSignOut && <SignOut onClose={() => setShowSignOut(false)} />}
    </Page>
  );
}
