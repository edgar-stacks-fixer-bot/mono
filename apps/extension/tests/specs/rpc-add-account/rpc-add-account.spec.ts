import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { type BrowserContext, type Page, expect } from '@playwright/test';
import { HDKey } from '@scure/bip32';
import { requestLeatherProvider } from '@tests/leather-provider';
import {
  exampleStacksMultisigPublicKeys,
  exampleWshDescriptor,
  testAccountNativeSegwitXpub,
} from '@tests/mocks/mock-policies';
import { testFingerprint } from '@tests/page-object-models/onboarding.page';
import { readPersistedStore } from '@tests/persisted-store';
import { ConnectAccountSelectors } from '@tests/selectors/requests.selectors';
import { getDisplayerAddress } from '@tests/utils';
import { z } from 'zod';

import {
  getWshDescriptorAddress,
  instantiateBondDescriptor,
  makeNativeSegwitAccountXpub,
  makeNativeSegwitAddressPubkeyHex,
} from '@leather.io/bitcoin';
import { RpcErrorCode, maxBtcDescriptorLength } from '@leather.io/rpc';
import { assertExistence } from '@leather.io/utils';

import { test } from '../../fixtures/fixtures';

// The active test account co-signs this Stacks multisig — its STX public key is
// the first entry, which is what the verify approver checks before enabling.
const testAccountStxPublicKey = exampleStacksMultisigPublicKeys[0];
const cosignerPublicKey = exampleStacksMultisigPublicKeys[1];
// A valid compressed key the active account does not control (its BTC native
// segwit public key), used to build a multisig the account is not a signer of.
const strangerPublicKey = '030347be500a8b2707a00e7576c0c527a247cddc6e8363ee51147b8e43b590baa9';

async function initiateRequest(page: Page, method: string, params: unknown) {
  return page.evaluate(({ method, params }) => window.LeatherProvider?.request(method, params), {
    method,
    params,
  });
}

async function waitForPopup(context: BrowserContext) {
  const popup = await context.waitForEvent('page');
  await popup.waitForLoadState('domcontentloaded');
  return popup;
}

// `window.debug` only exists on the extension origin, so return to it (the dApp
// page navigated away to localhost:3000) before reading the persisted store.
async function getPersistedPolicyIds(page: Page, extensionId: string) {
  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.waitForFunction(() => typeof window.debug?.getPersistedStore === 'function');
  const store = await readPersistedStore(page);
  return store?.policy?.ids ?? [];
}

test.describe('Rpc: add account in verify mode (non-whitelisted origin)', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
  });

  test('verifies a Stacks multisig address without registering it', async ({
    page,
    context,
    extensionId,
  }) => {
    await page.goto('localhost:3000');
    const requestPromise = initiateRequest(page, 'stx_addAccount', {
      name: 'Shared treasury',
      publicKeys: [testAccountStxPublicKey, cosignerPublicKey],
      threshold: 2,
    });

    const popup = await waitForPopup(context);
    await expect(popup.getByText('Verify multisig address')).toBeVisible();
    const verifyButton = popup.getByTestId('stx-add-account-approve-button');
    await expect(verifyButton).toHaveText('Verify');
    await expect(verifyButton).toBeEnabled();
    await verifyButton.click();

    const result = await requestPromise;
    assertExistence(result, 'Expected result');
    expect(result.result).toMatchObject({
      added: false,
      role: 'signer',
      threshold: 2,
      publicKeys: [testAccountStxPublicKey, cosignerPublicKey],
    });
    expect(typeof result.result?.address).toBe('string');
    expect(result.result?.accountId).toBeUndefined();

    // Verify mode must not write anything to the wallet
    expect(await getPersistedPolicyIds(page, extensionId)).toEqual([]);
  });

  test('disables verify when the active account is not a co-signer', async ({ page, context }) => {
    await page.goto('localhost:3000');
    const requestPromise = initiateRequest(page, 'stx_addAccount', {
      name: 'Not my vault',
      publicKeys: [cosignerPublicKey, strangerPublicKey],
      threshold: 2,
    });

    const popup = await waitForPopup(context);
    await expect(popup.getByText('Verify multisig address')).toBeVisible();
    await expect(popup.getByTestId('stx-add-account-approve-button')).toBeDisabled();

    await popup.close();
    await expect(requestPromise).rejects.toThrow();
  });

  test('verifies a Bitcoin multisig address without registering it', async ({
    page,
    context,
    extensionId,
  }) => {
    await page.goto('localhost:3000');
    const requestPromise = initiateRequest(page, 'btc_addAccount', {
      name: 'Shared cold storage',
      descriptor: exampleWshDescriptor,
    });

    const popup = await waitForPopup(context);
    await expect(popup.getByText('Verify multisig address')).toBeVisible();
    const verifyButton = popup.getByTestId('btc-add-account-approve-button');
    await expect(verifyButton).toHaveText('Verify');
    await expect(verifyButton).toBeEnabled();
    await verifyButton.click();

    const result = await requestPromise;
    assertExistence(result, 'Expected result');
    expect(result.result).toMatchObject({
      added: false,
      role: 'signer',
      descriptor: exampleWshDescriptor,
    });
    expect(result.result?.address).toMatch(/^bc1q/);
    expect(result.result?.accountId).toBeUndefined();

    expect(await getPersistedPolicyIds(page, extensionId)).toEqual([]);
  });
});

const whitelistedOrigin = 'https://app.leather.io';

async function stubWhitelistedOriginPage(context: BrowserContext) {
  await context.route(
    url => url.hostname === 'app.leather.io',
    route =>
      route.fulfill({
        contentType: 'text/html',
        body: '<!doctype html><html><head><title>Leather</title></head><body></body></html>',
      })
  );
}

async function waitForProvider(page: Page) {
  await page.waitForFunction(() => Boolean(window.LeatherProvider));
}

async function readPersistedPolicyIds(page: Page) {
  const store = await readPersistedStore(page);
  return store?.policy?.ids ?? [];
}

test.describe('Rpc: add account in add mode (whitelisted origin)', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, context }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await stubWhitelistedOriginPage(context);
    await onboardingPage.signInWithTestAccount(extensionId);
  });

  test('registers a Bitcoin multisig and persists it', async ({ page, context }) => {
    const dappPage = await context.newPage();
    await dappPage.goto(whitelistedOrigin);
    await waitForProvider(dappPage);

    const requestPromise = initiateRequest(dappPage, 'btc_addAccount', {
      name: 'Shared cold storage',
      descriptor: exampleWshDescriptor,
    });

    const popup = await waitForPopup(context);
    await expect(popup.getByText('Add multisig account')).toBeVisible();
    const confirmButton = popup.getByTestId('btc-add-account-approve-button');
    await expect(confirmButton).toHaveText('Confirm');
    await expect(confirmButton).toBeEnabled();
    await confirmButton.click();

    const result = await requestPromise;
    assertExistence(result, 'Expected result');
    expect(result.result).toMatchObject({
      added: true,
      role: 'signer',
      descriptor: exampleWshDescriptor,
    });
    expect(result.result?.address).toMatch(/^bc1q/);
    expect(result.result?.accountId).toBe(result.result?.address);

    const address = z.string().parse(result.result?.address);
    const expectedPolicyId = `${testFingerprint}/0/${address}/mainnet`;
    await expect.poll(() => readPersistedPolicyIds(page)).toEqual([expectedPolicyId]);
  });
});

const bondUnlockHeight = 900_000;
const bondHash = bytesToHex(sha256(new Uint8Array([1, 2, 3])));
const bondCounterpartyKey = makeNativeSegwitAddressPubkeyHex(9);
const testAccountKeyExpression = `${testAccountNativeSegwitXpub}/0/0`;
const cosignerKeyExpression = `${makeNativeSegwitAccountXpub(1)}/0/0`;
const otherCosignerKeyExpression = `${makeNativeSegwitAccountXpub(2)}/0/0`;

function getTestAccountRawPubkeyHex() {
  const { publicKey } = HDKey.fromExtendedKey(testAccountNativeSegwitXpub)
    .deriveChild(0)
    .deriveChild(0);
  assertExistence(publicKey, 'Expected the test account public key');
  return bytesToHex(publicKey);
}

function makeBondDescriptor(vaultExpression: string, counterpartyKey = bondCounterpartyKey) {
  return `wsh(and_v(v:or_i(after(${bondUnlockHeight}),and_v(v:sha256(${bondHash}),pk(${counterpartyKey}))),${vaultExpression}))`;
}

const multisigVaultBondDescriptor = instantiateBondDescriptor({
  unlockHeight: bondUnlockHeight,
  hash: bondHash,
  counterpartyKey: bondCounterpartyKey,
  threshold: 2,
  keyExpressions: [testAccountKeyExpression, cosignerKeyExpression],
});

const unsupportedDescriptorMessage = 'Only multisig or timelocked wsh() descriptors are supported';

test.describe('Rpc: add account with a timelocked descriptor', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, context }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await stubWhitelistedOriginPage(context);
    await onboardingPage.signInWithTestAccount(extensionId);
  });

  test('verifies a bond address without registering it', async ({ page, context, extensionId }) => {
    await page.goto('localhost:3000');
    const requestPromise = initiateRequest(page, 'btc_addAccount', {
      name: 'Bond',
      descriptor: multisigVaultBondDescriptor,
    });

    const popup = await waitForPopup(context);
    await expect(popup.getByText('Verify timelocked address')).toBeVisible();
    await expect(
      popup.getByText(
        "Timelocked addresses can't be added to your wallet. You're only verifying the address."
      )
    ).toBeVisible();
    await expect(popup.getByText('Spending conditions')).toBeVisible();
    await expect(popup.getByText(`From block ${bondUnlockHeight}`)).toBeVisible();
    await expect(popup.getByText(`Before block ${bondUnlockHeight}`)).toBeVisible();
    await expect(
      popup.getByText('Requires 2 of 2 vault co-signers', { exact: true })
    ).toBeVisible();
    await expect(popup.getByText(bondCounterpartyKey, { exact: true })).toBeVisible();
    await expect(popup.getByText(bondHash, { exact: true })).toBeVisible();
    await expect(popup.getByText('Account name')).toHaveCount(0);

    const expectedAddress = getWshDescriptorAddress(multisigVaultBondDescriptor, 'mainnet');
    expect(
      await getDisplayerAddress(popup.getByTestId(ConnectAccountSelectors.BtcAddAccountAddress))
    ).toBe(expectedAddress);

    const verifyButton = popup.getByTestId('btc-add-account-approve-button');
    await expect(verifyButton).toHaveText('Verify');
    await expect(verifyButton).toBeEnabled();
    await verifyButton.click();

    const result = await requestPromise;
    assertExistence(result, 'Expected result');
    expect(result.result).toEqual({
      added: false,
      role: 'signer',
      descriptor: multisigVaultBondDescriptor,
      address: expectedAddress,
    });

    expect(await getPersistedPolicyIds(page, extensionId)).toEqual([]);
  });

  test('only verifies a bond address from a whitelisted origin', async ({
    page,
    context,
    extensionId,
  }) => {
    const dappPage = await context.newPage();
    await dappPage.goto(whitelistedOrigin);
    await waitForProvider(dappPage);

    const requestPromise = initiateRequest(dappPage, 'btc_addAccount', {
      name: 'Bond',
      descriptor: multisigVaultBondDescriptor,
    });

    const popup = await waitForPopup(context);
    await expect(popup.getByText('Verify timelocked address')).toBeVisible();
    const verifyButton = popup.getByTestId('btc-add-account-approve-button');
    await expect(verifyButton).toHaveText('Verify');
    await verifyButton.click();

    const result = await requestPromise;
    assertExistence(result, 'Expected result');
    expect(result.result).toMatchObject({ added: false, role: 'signer' });
    expect(result.result?.accountId).toBeUndefined();

    expect(await getPersistedPolicyIds(page, extensionId)).toEqual([]);
  });

  test('verifies a bond with a single-signer vault', async ({ page, context }) => {
    const descriptor = makeBondDescriptor(`pk(${testAccountKeyExpression})`);
    await page.goto('localhost:3000');
    const requestPromise = initiateRequest(page, 'btc_addAccount', { name: 'Bond', descriptor });

    const popup = await waitForPopup(context);
    await expect(popup.getByText('Requires the owner key', { exact: true })).toBeVisible();
    await expect(popup.getByText('Owner key', { exact: true })).toBeVisible();
    await expect(popup.getByText(testAccountKeyExpression, { exact: true })).toBeVisible();
    const verifyButton = popup.getByTestId('btc-add-account-approve-button');
    await expect(verifyButton).toBeEnabled();
    await verifyButton.click();

    const result = await requestPromise;
    assertExistence(result, 'Expected result');
    expect(result.result).toMatchObject({
      added: false,
      descriptor,
      address: getWshDescriptorAddress(descriptor, 'mainnet'),
    });
  });

  test('verifies a bond with a raw-key vault', async ({ page, context }) => {
    const descriptor = makeBondDescriptor(`pk(${getTestAccountRawPubkeyHex()})`);
    await page.goto('localhost:3000');
    const requestPromise = initiateRequest(page, 'btc_addAccount', { name: 'Bond', descriptor });

    const popup = await waitForPopup(context);
    await expect(popup.getByText('Verify timelocked address')).toBeVisible();
    const verifyButton = popup.getByTestId('btc-add-account-approve-button');
    await expect(verifyButton).toBeEnabled();
    await verifyButton.click();

    const result = await requestPromise;
    assertExistence(result, 'Expected result');
    expect(result.result).toMatchObject({ added: false, descriptor });
  });

  test('disables verify when the active account is not a vault signer', async ({
    page,
    context,
  }) => {
    await page.goto('localhost:3000');
    const requestPromise = initiateRequest(page, 'btc_addAccount', {
      name: 'Bond',
      descriptor: makeBondDescriptor(
        `sortedmulti(2,${cosignerKeyExpression},${otherCosignerKeyExpression})`
      ),
    });

    const popup = await waitForPopup(context);
    await expect(
      popup.getByText("Your active Bitcoin account isn't connected to this vault.")
    ).toBeVisible();
    await expect(popup.getByTestId('btc-add-account-approve-button')).toBeDisabled();

    await popup.close();
    await expect(requestPromise).rejects.toThrow();
  });

  test('disables verify when the active account only holds the counterparty key', async ({
    page,
    context,
  }) => {
    await page.goto('localhost:3000');
    const requestPromise = initiateRequest(page, 'btc_addAccount', {
      name: 'Bond',
      descriptor: makeBondDescriptor(`pk(${cosignerKeyExpression})`, testAccountKeyExpression),
    });

    const popup = await waitForPopup(context);
    await expect(
      popup.getByText("Your active Bitcoin account isn't connected to this timelocked address.")
    ).toBeVisible();
    await expect(popup.getByTestId('btc-add-account-approve-button')).toBeDisabled();

    await popup.close();
    await expect(requestPromise).rejects.toThrow();
  });

  const rejectedDescriptors = [
    {
      name: 'non-bond miniscript',
      descriptor: `wsh(or_d(pk(${testAccountKeyExpression}),pk(${cosignerKeyExpression})))`,
    },
    {
      name: 'miniscript wrapping a multi leaf',
      descriptor: `wsh(and_v(v:pk(${cosignerKeyExpression}),multi(1,${testAccountKeyExpression},${otherCosignerKeyExpression})))`,
    },
    {
      name: 'a ranged bond',
      descriptor: makeBondDescriptor(
        `sortedmulti(2,${testAccountNativeSegwitXpub}/0/*,${makeNativeSegwitAccountXpub(1)}/0/*)`
      ),
    },
  ];

  for (const { name, descriptor } of rejectedDescriptors) {
    test(`rejects ${name}`, async ({ page }) => {
      await page.goto('localhost:3000');
      const response = await page.evaluate(requestLeatherProvider, {
        method: 'btc_addAccount',
        params: { name: 'Bond', descriptor },
      });

      expect(response.error).toEqual({
        code: RpcErrorCode.INVALID_PARAMS,
        message: unsupportedDescriptorMessage,
      });
    });
  }

  test('rejects a descriptor over the maximum length', async ({ page }) => {
    await page.goto('localhost:3000');
    const response = await page.evaluate(requestLeatherProvider, {
      method: 'btc_addAccount',
      params: {
        name: 'Bond',
        descriptor: makeBondDescriptor(`pk(${'a'.repeat(maxBtcDescriptorLength)})`),
      },
    });

    expect(response.error).toMatchObject({ code: RpcErrorCode.INVALID_PARAMS });
  });
});
