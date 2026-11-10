import type { BrowserContext, CDPSession, Page } from '@playwright/test';

export interface BiometricAuthenticator {
  session: CDPSession;
  authenticatorId: string;
  remove(): Promise<void>;
}

export async function addBiometricAuthenticator(
  context: BrowserContext,
  page: Page
): Promise<BiometricAuthenticator> {
  const session = await context.newCDPSession(page);
  await session.send('WebAuthn.enable', { enableUI: false });
  const { authenticatorId } = await session.send('WebAuthn.addVirtualAuthenticator', {
    options: {
      protocol: 'ctap2',
      ctap2Version: 'ctap2_1',
      transport: 'internal',
      hasResidentKey: true,
      hasUserVerification: true,
      hasPrf: true,
      isUserVerified: true,
      automaticPresenceSimulation: true,
    },
  });

  return {
    session,
    authenticatorId,
    async remove() {
      await session.send('WebAuthn.removeVirtualAuthenticator', { authenticatorId });
      await session.send('WebAuthn.disable');
    },
  };
}
