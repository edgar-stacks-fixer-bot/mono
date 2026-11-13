import type { BrowserContext, Page } from '@playwright/test';
import { z } from 'zod';

import { SBTC_EMILY_API_URL, TEST_ACCOUNT_1_STX_ADDRESS_HEX } from './constants';

const sbtcEmilyUrl = `${SBTC_EMILY_API_URL}/deposit*`;
const sbtcSponsorshipQuoteUrl = '**/v1/sponsorship/quote';
const sbtcSponsorshipSubmitUrl = '**/v1/sponsorship/submit';
const oneHourInMs = 60 * 60 * 1000;

export const SBTC_SPONSORED_TXID =
  '0x5b1f4ac6b3d0c1d6c34b6a0d4f9ff1e3e0c1c42c7d6a8f2a2a51e9e6f0bd9e11';

export interface SbtcSponsorshipQuoteFixture {
  quoteId: string;
  feeRecipientPrincipal: string;
  expiresAt: string;
  satsPerStx: string;
  minFeeSats: number;
  maxFeeSats: number;
}

export function createSbtcSponsorshipQuoteFixture(
  overrides: Partial<SbtcSponsorshipQuoteFixture> = {}
): SbtcSponsorshipQuoteFixture {
  return {
    quoteId: 'quote-1',
    feeRecipientPrincipal: 'SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K',
    expiresAt: new Date(Date.now() + oneHourInMs).toISOString(),
    satsPerStx: '1500',
    minFeeSats: 100,
    maxFeeSats: 50_000,
    ...overrides,
  };
}

export type SbtcDepositStatus = 'pending' | 'accepted' | 'confirmed' | 'failed' | 'rbf';

export interface SbtcDepositFixture {
  amount: number;
  bitcoinTxOutputIndex: number;
  bitcoinTxid: string;
  depositScript: string;
  lastUpdateBlockHash: string;
  lastUpdateHeight: number;
  recipient: string;
  reclaimScript: string;
  status: SbtcDepositStatus;
}

interface CreateSbtcDepositFixtureArgs {
  bitcoinTxid: string;
  status: SbtcDepositStatus;
  amount?: number;
  recipient?: string;
}

export function createSbtcDepositFixture({
  bitcoinTxid,
  status,
  amount = 150_000,
  recipient = TEST_ACCOUNT_1_STX_ADDRESS_HEX,
}: CreateSbtcDepositFixtureArgs): SbtcDepositFixture {
  return {
    amount,
    bitcoinTxOutputIndex: 0,
    bitcoinTxid,
    depositScript: '0x00',
    lastUpdateBlockHash: '0x01',
    lastUpdateHeight: 810600,
    recipient,
    reclaimScript: '0x02',
    status,
  };
}

export async function mockMainnetTestAccountSbtcDepositRequests(page: Page | BrowserContext) {
  await page.route(sbtcEmilyUrl, route =>
    route.fulfill({
      json: {
        deposits: [],
      },
    })
  );

  await mockSbtcSponsorshipQuotes(page, [createSbtcSponsorshipQuoteFixture()]);
  await mockSbtcSponsorshipSubmit(page);
}

export async function mockSbtcSponsorshipQuotes(
  page: Page | BrowserContext,
  quotes: SbtcSponsorshipQuoteFixture[]
) {
  const remaining = [...quotes];
  await page.unroute(sbtcSponsorshipQuoteUrl);
  await page.route(sbtcSponsorshipQuoteUrl, route => {
    const quote = remaining.length > 1 ? remaining.shift() : remaining[0];
    return route.fulfill({ json: quote });
  });
}

interface SbtcSponsorshipSubmitError {
  status: number;
  code: string;
  reason?: string;
}

const submittedBodySchema = z.object({ transaction: z.string() });

export async function mockSbtcSponsorshipSubmit(
  page: Page | BrowserContext,
  errors: SbtcSponsorshipSubmitError[] = []
) {
  const submittedBodies: unknown[] = [];
  const remainingErrors = [...errors];
  await page.unroute(sbtcSponsorshipSubmitUrl);
  await page.route(sbtcSponsorshipSubmitUrl, route => {
    const body: unknown = route.request().postDataJSON();
    submittedBodies.push(body);
    const error = remainingErrors.shift();
    if (error) {
      return route.fulfill({
        status: error.status,
        json: { error: error.code, code: error.code, reason: error.reason },
      });
    }
    return route.fulfill({
      json: {
        txid: SBTC_SPONSORED_TXID,
        transaction: submittedBodySchema.safeParse(body).data?.transaction,
      },
    });
  });
  return submittedBodies;
}

export async function mockSbtcDeposits(
  target: Page | BrowserContext,
  depositsByStatus: Partial<Record<SbtcDepositStatus, SbtcDepositFixture[]>>
) {
  await target.route(sbtcEmilyUrl, route => {
    const status = new URL(route.request().url()).searchParams.get('status');
    const deposits = Object.entries(depositsByStatus).find(([key]) => key === status)?.[1] ?? [];
    return route.fulfill({ json: { deposits } });
  });
}
