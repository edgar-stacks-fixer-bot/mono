import { type Page, expect } from '@playwright/test';
import { addBiometricAuthenticator } from '@tests/fixtures/biometric-authenticator';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { z } from 'zod';

import { test } from '../../fixtures/fixtures';

const zeroStxBalance = {
  balance: '0',
  total_miner_rewards_received: '0',
  lock_tx_id: '',
  locked: '0',
  lock_height: 0,
  burnchain_lock_height: 0,
  burnchain_unlock_height: 0,
};

const persistedSoftwareKeysSchema = z.looseObject({
  softwareKeys: z.looseObject({
    ids: z.array(z.string()),
    salt: z.string().optional(),
    authenticationMode: z.string().optional(),
    platformUnlock: z
      .looseObject({
        version: z.number(),
        credentialId: z.string(),
        wrappedEncryptionKey: z.string(),
      })
      .optional(),
  }),
});

function readPersistedRoot(page: Page) {
  return page.evaluate(async () => {
    const stored = await chrome.storage.local.get<Record<string, unknown>>(['persist:root']);
    return stored['persist:root'];
  });
}

async function readPersistedSoftwareKeys(page: Page) {
  return persistedSoftwareKeysSchema.parse(await readPersistedRoot(page)).softwareKeys;
}

async function readSessionEncryptionKey(page: Page) {
  const { encryptionKey } = await page.evaluate(() =>
    chrome.storage.session.get(['encryptionKey'])
  );
  return z.string().parse(encryptionKey);
}

async function stopAccountDiscovery(page: Page) {
  await page.route('**hiro.so/extended/v2/addresses/**/balances/stx', route =>
    route.fulfill({ json: zeroStxBalance })
  );
  await page.route('**hiro.so/extended/v2/addresses/**/balances/ft', route =>
    route.fulfill({ json: { limit: 100, offset: 0, total: 0, results: [] } })
  );
}

test.describe('Biometric unlock', () => {
  test.beforeEach(async ({ extensionId, globalPage, page }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await stopAccountDiscovery(page);
    await page.evaluate(async () => {
      await chrome.storage.local.clear();
    });
  });

  test('that an existing password profile stays password-only', async ({
    context,
    extensionId,
    homePage,
    onboardingPage,
    page,
    switchAccountPage,
  }) => {
    await addBiometricAuthenticator(context, page);
    await onboardingPage.signInWithTestAccount(extensionId);

    await homePage.lock();
    await expect(page.getByTestId(SettingsSelectors.EnterPasswordInput)).toBeVisible();
    await expect(page.getByTestId(SettingsSelectors.BiometricUnlockBtn)).toHaveCount(0);
    await homePage.unlock();

    await switchAccountPage.open();
    await switchAccountPage.createNewWallet();
    await page.getByTestId(OnboardingSelectors.BackUpSecretKeyBtn).click();
    await expect(page.getByText('Enter your Password')).toBeVisible();
    await expect(page.getByTestId(OnboardingSelectors.BiometricSetupBtn)).toHaveCount(0);
    await expect(page.getByTestId(SettingsSelectors.BiometricUnlockBtn)).toHaveCount(0);
  });

  test('that a new wallet can be created and unlocked with biometrics', async ({
    context,
    homePage,
    onboardingPage,
    page,
  }) => {
    test.slow();
    await addBiometricAuthenticator(context, page);

    await page.getByTestId(OnboardingSelectors.SignUpBtn).click();
    await page.getByTestId(OnboardingSelectors.BackUpSecretKeyBtn).click();
    await expect(page.getByText('Choose how to unlock Leather')).toBeVisible();
    await expect(
      page.getByText(
        'Choose a password or biometrics. Your choice applies to every software wallet in this browser profile.'
      )
    ).toBeVisible();
    await expect(page.getByTestId(OnboardingSelectors.BiometricSetupBtn)).toHaveText(
      'Use biometrics'
    );
    await onboardingPage.setUpBiometricUnlock();
    await onboardingPage.dismissFeatureIntroducer();

    const softwareKeys = await readPersistedSoftwareKeys(page);
    expect(softwareKeys.authenticationMode).toBe('biometric-only');
    expect(softwareKeys.salt).toBeUndefined();
    expect(softwareKeys.platformUnlock?.version).toBe(1);

    const encryptionKey = await readSessionEncryptionKey(page);
    expect(encryptionKey).toMatch(/^[0-9a-f]{96}$/);
    expect(JSON.stringify(await readPersistedRoot(page))).not.toContain(encryptionKey);

    await homePage.lock();
    await expect(page.getByText('Unlock Leather')).toBeVisible();
    await expect(page.getByText('Use your configured unlock method to continue.')).toBeVisible();
    await expect(page.getByTestId(SettingsSelectors.EnterPasswordInput)).toHaveCount(0);
    await expect(page.getByTestId(SettingsSelectors.BiometricRecoveryLink)).toHaveText(
      "Can't use biometrics?"
    );
    await homePage.unlockWithBiometrics();
    await expect.poll(() => readSessionEncryptionKey(page)).toEqual(encryptionKey);

    await homePage.clickSettingsButton();
    await homePage.signOutSettingsListItem.click();
    await expect(
      page.getByText(
        'I understand that biometric unlock will not give me access to my wallet after I sign out.'
      )
    ).toBeVisible();
    await homePage.signOutConfirmHasBackupCheckbox.check();
    await expect(homePage.signOutDeleteWalletBtn).toBeDisabled();
    await homePage.signOutConfirmPasswordDisable.check();
    await homePage.signOutDeleteWalletBtn.click();

    await page.waitForURL('**/get-started');
    await expect(page.getByTestId(OnboardingSelectors.SignUpBtn)).toBeVisible();
  });

  test('that a restored wallet can choose biometrics', async ({
    context,
    onboardingPage,
    page,
  }) => {
    test.slow();
    await addBiometricAuthenticator(context, page);

    await onboardingPage.signInMnemonicKey();
    await page.getByTestId(OnboardingSelectors.SignInBtn).click();
    await expect(page.getByText('Choose how to unlock Leather')).toBeVisible();
    await expect(page.getByTestId(OnboardingSelectors.BiometricSetupBtn)).toHaveText(
      'Use biometrics instead'
    );
    await onboardingPage.setUpBiometricUnlock();

    const softwareKeys = await readPersistedSoftwareKeys(page);
    expect(softwareKeys.authenticationMode).toBe('biometric-only');
    expect(softwareKeys.salt).toBeUndefined();
    expect(softwareKeys.ids).toHaveLength(1);
  });

  test('that a second wallet can be added with biometrics', async ({
    context,
    onboardingPage,
    page,
    switchAccountPage,
  }) => {
    test.slow();
    await addBiometricAuthenticator(context, page);
    await onboardingPage.signUpNewUserWithBiometrics();
    const { platformUnlock } = await readPersistedSoftwareKeys(page);

    await switchAccountPage.open();
    await switchAccountPage.createNewWallet();
    await page.getByTestId(OnboardingSelectors.BackUpSecretKeyBtn).click();
    await expect(page.getByText("Confirm it's you")).toBeVisible();
    await expect(page.getByTestId(OnboardingSelectors.NewPasswordInput)).toHaveCount(0);
    await switchAccountPage.confirmNewWalletWithBiometrics();

    await expect.poll(() => switchAccountPage.getWalletCount()).toBe(2);
    const softwareKeys = await readPersistedSoftwareKeys(page);
    expect(softwareKeys.ids).toHaveLength(2);
    expect(softwareKeys.platformUnlock).toEqual(platformUnlock);
  });
});
