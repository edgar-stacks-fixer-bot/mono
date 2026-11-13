import { type Page, expect } from '@playwright/test';
import { deserializeTransaction } from '@stacks/transactions';
import { TEST_ACCOUNT_2_STX_ADDRESS } from '@tests/mocks/constants';
import {
  createSbtcSponsorshipQuoteFixture,
  mockSbtcSponsorshipQuotes,
  mockSbtcSponsorshipSubmit,
} from '@tests/mocks/mock-sbtc';
import { mockZeroStxBalanceV2Request } from '@tests/mocks/mock-stacks-balances-v2';
import { MockedTokensSelectors } from '@tests/selectors/mocked-tokens.selectors';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { z } from 'zod';

import { getSbtcSponsoredTransferDetails } from '@leather.io/stacks';
import { assertExistence } from '@leather.io/utils';

import { test } from '../../fixtures/fixtures';

const amount = '0.001';
const sbtcBalance = '0.5';
const sbtcDecimals = 8;

const submittedBodySchema = z.object({ quoteId: z.string(), transaction: z.string() });

function decodeSubmittedTransfer(body: unknown) {
  const { quoteId, transaction } = submittedBodySchema.parse(body);
  const details = getSbtcSponsoredTransferDetails(deserializeTransaction(transaction));
  assertExistence(details, 'Submitted transaction is not a sponsored sBTC transfer');
  return { quoteId, details };
}

function feeLabelToSats(label: string) {
  return BigInt(Math.round(parseFloat(label) * 10 ** sbtcDecimals));
}

function recordHiroBroadcasts(page: Page) {
  const broadcasts: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST' && request.url().includes('hiro.so/v2/transactions')) {
      broadcasts.push(request.url());
    }
  });
  return broadcasts;
}

test.describe('Send sBTC with a sponsored fee', () => {
  test.beforeEach(async ({ extensionId, globalPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
  });

  test('shows STX fee tiers when the account has enough STX', async ({
    extensionId,
    homePage,
    onboardingPage,
    sendPage,
  }) => {
    await onboardingPage.signInWithTestAccount(extensionId);
    await homePage.sendButton.click();
    await sendPage.selectSip10AndGoToSendForm(MockedTokensSelectors.SbtcTokenTestId);

    await expect(sendPage.feeToBePaid).toContainText('STX');
    await expect(sendPage.sponsoredFeeBadge).toHaveCount(0);
  });

  test.describe('with no STX', () => {
    test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, sendPage }) => {
      await mockZeroStxBalanceV2Request(globalPage.page);
      await onboardingPage.signInWithTestAccount(extensionId);
      await homePage.sendButton.click();
      await sendPage.selectSip10AndGoToSendForm(MockedTokensSelectors.SbtcTokenTestId);
    });

    test('shows sBTC fee tiers with the sponsored badge and no custom fee', async ({
      sendPage,
    }) => {
      await expect(sendPage.sponsoredFeeBadge).toBeVisible();
      await expect(sendPage.feeToBePaid).toContainText('sBTC');

      await sendPage.openFeeEstimateSelect();

      await expect(
        sendPage.feeEstimateSelect.getByTestId(SharedComponentsSelectors.LowFeeEstimateItem)
      ).toBeVisible();
      await expect(
        sendPage.feeEstimateSelect.getByTestId(SharedComponentsSelectors.MiddleFeeEstimateItem)
      ).toBeVisible();
      await expect(
        sendPage.feeEstimateSelect.getByTestId(SharedComponentsSelectors.HighFeeEstimateItem)
      ).toBeVisible();
      await expect(
        sendPage.feeEstimateSelect.getByTestId(SharedComponentsSelectors.CustomFeeSelectItem)
      ).toHaveCount(0);
    });

    test('submits the quote with the selected tier fee and never broadcasts through Hiro', async ({
      globalPage,
      sendPage,
    }) => {
      const submittedBodies = await mockSbtcSponsorshipSubmit(globalPage.page);
      const hiroBroadcasts = recordHiroBroadcasts(sendPage.page);

      await sendPage.selectHighFeeEstimate();
      const highFeeLabel = await sendPage.feeToBePaid.textContent();
      assertExistence(highFeeLabel, 'Fee label is empty');

      await sendPage.amountInput.fill(amount);
      await sendPage.recipientInput.fill(TEST_ACCOUNT_2_STX_ADDRESS);
      await sendPage.recipientInput.blur();
      await sendPage.previewSendTxButton.click();

      await expect(sendPage.confirmationDetails).toBeVisible();
      await expect(sendPage.confirmationDetails).toContainText('Total spend');
      await expect(sendPage.feesRow).toContainText('sBTC');

      await sendPage.confirmSendTransaction();
      await expect(sendPage.page.getByText('Sent')).toBeVisible();

      expect(submittedBodies).toHaveLength(1);
      const { quoteId, details } = decodeSubmittedTransfer(submittedBodies[0]);
      expect(quoteId).toEqual('quote-1');
      expect(details.recipient).toEqual(TEST_ACCOUNT_2_STX_ADDRESS);
      expect(details.amount).toEqual(100_000n);
      expect(details.fee).toEqual(feeLabelToSats(highFeeLabel));
      expect(hiroBroadcasts).toHaveLength(0);
    });

    test('shows Insufficient balance when the amount does not cover the fee', async ({
      sendPage,
    }) => {
      await sendPage.amountInput.fill(sbtcBalance);
      await sendPage.recipientInput.fill(TEST_ACCOUNT_2_STX_ADDRESS);
      await sendPage.recipientInput.blur();
      await sendPage.previewSendTxButton.click();

      await expect(sendPage.amountInputErrorLabel).toContainText('Insufficient balance');
    });
  });

  test.describe('with an expiring quote', () => {
    test('re-quotes an expired quote and submits on the second confirm', async ({
      extensionId,
      globalPage,
      homePage,
      onboardingPage,
      sendPage,
    }) => {
      await mockZeroStxBalanceV2Request(globalPage.page);
      await mockSbtcSponsorshipQuotes(globalPage.page, [
        createSbtcSponsorshipQuoteFixture({
          quoteId: 'quote-expired',
          expiresAt: new Date(Date.now() - 1000).toISOString(),
        }),
        createSbtcSponsorshipQuoteFixture({ quoteId: 'quote-fresh' }),
      ]);
      const submittedBodies = await mockSbtcSponsorshipSubmit(globalPage.page);
      await onboardingPage.signInWithTestAccount(extensionId);
      await homePage.sendButton.click();
      await sendPage.selectSip10AndGoToSendForm(MockedTokensSelectors.SbtcTokenTestId);

      await sendPage.amountInput.fill(amount);
      await sendPage.recipientInput.fill(TEST_ACCOUNT_2_STX_ADDRESS);
      await sendPage.recipientInput.blur();
      await sendPage.previewSendTxButton.click();
      await expect(sendPage.confirmationDetails).toBeVisible();

      await sendPage.confirmSendTransaction();
      await expect(sendPage.sbtcFeeRequoteCallout).toBeVisible();
      expect(submittedBodies).toHaveLength(0);

      await sendPage.confirmSendTransaction();
      await expect(sendPage.page.getByText('Sent')).toBeVisible();

      expect(submittedBodies).toHaveLength(1);
      expect(decodeSubmittedTransfer(submittedBodies[0]).quoteId).toEqual('quote-fresh');
    });

    test('re-quotes when the sponsor reports a stale nonce', async ({
      extensionId,
      globalPage,
      homePage,
      onboardingPage,
      sendPage,
    }) => {
      await mockZeroStxBalanceV2Request(globalPage.page);
      const submittedBodies = await mockSbtcSponsorshipSubmit(globalPage.page, [
        { status: 409, code: 'stale_nonce' },
      ]);
      await onboardingPage.signInWithTestAccount(extensionId);
      await homePage.sendButton.click();
      await sendPage.selectSip10AndGoToSendForm(MockedTokensSelectors.SbtcTokenTestId);

      await sendPage.amountInput.fill(amount);
      await sendPage.recipientInput.fill(TEST_ACCOUNT_2_STX_ADDRESS);
      await sendPage.recipientInput.blur();
      await sendPage.previewSendTxButton.click();
      await expect(sendPage.confirmationDetails).toBeVisible();

      await sendPage.confirmSendTransaction();
      await expect(sendPage.sbtcFeeRequoteCallout).toBeVisible();

      await sendPage.confirmSendTransaction();
      await expect(sendPage.page.getByText('Sent')).toBeVisible();
      expect(submittedBodies).toHaveLength(2);
    });
  });
});
