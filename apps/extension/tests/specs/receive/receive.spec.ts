import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';

import { test } from '../../fixtures/fixtures';

test.describe('Receive Dialog', () => {
  test.describe.configure({ retries: 0 });

  test('That the Receive dialog renders and shows the correct assets', async ({
    extensionId,
    globalPage,
    onboardingPage,
    homePage,
  }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await homePage.goToReceiveDialog();

    const dialog = homePage.page.getByRole('dialog');
    await test.expect(dialog.getByText('Choose asset')).toBeVisible();
    await test.expect(dialog.getByText('Tokens')).toBeVisible();
    await test.expect(dialog.getByText('Collectibles')).toBeVisible();
    await test.expect(dialog.getByText('Bitcoin (BTC)')).toBeVisible();
    await test.expect(dialog.getByText('Bitcoin Taproot')).toBeVisible();
    await test.expect(dialog.getByText('Stacks')).toBeVisible();
  });

  test('That the Receive dialog shows the mainnet network in the list and QR sheets', async ({
    extensionId,
    globalPage,
    onboardingPage,
    homePage,
  }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await homePage.goToReceiveDialog();

    const dialog = homePage.page.getByRole('dialog');
    const networkBadge = dialog.getByTestId(HomePageSelectors.ReceiveNetworkBadge);
    await test.expect(networkBadge).toHaveText('Mainnet');

    await dialog.getByTestId(HomePageSelectors.ReceiveBtcNativeSegwitQrCodeBtn).click();
    await test.expect(dialog.getByTestId(SharedComponentsSelectors.AddressDisplayer)).toBeVisible();
    await test.expect(networkBadge).toHaveText('Mainnet');
  });

  test('That the Receive dialog shows the testnet network in the list and QR sheets', async ({
    extensionId,
    globalPage,
    onboardingPage,
    homePage,
    networkPage,
  }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await networkPage.selectTestnet();
    await homePage.goToReceiveDialog();

    const dialog = homePage.page.getByRole('dialog');
    const networkBadge = dialog.getByTestId(HomePageSelectors.ReceiveNetworkBadge);
    await test.expect(networkBadge).toHaveText('Testnet4');

    await dialog.getByTestId(HomePageSelectors.ReceiveStxQrCodeBtn).click();
    await test.expect(dialog.getByTestId(SharedComponentsSelectors.AddressDisplayer)).toBeVisible();
    await test.expect(networkBadge).toHaveText('Testnet4');
  });
});
