import { afterEach, describe, expect, it, vi } from 'vitest';

import { LEATHER_API_URL_PRODUCTION, LEATHER_API_URL_STAGING } from '@leather.io/constants';

import { createMock } from '../../../test/create-mock';
import type { Environment } from '../../environment';
import { leatherApiPriorities } from '../../rate-limiter/leather-rate-limiter';
import type { RateLimiterService } from '../../rate-limiter/rate-limiter.service';
import { LeatherApiError } from './leather-api.error';
import { LeatherSponsorshipApiClient } from './leather-sponsorship-api.client';

const quote = {
  quoteId: 'quote-1',
  feeRecipientPrincipal: 'SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K',
  expiresAt: '2026-11-13T12:00:00.000Z',
  satsPerStx: '1234.5',
  minFeeSats: 100,
  maxFeeSats: 50_000,
};

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function createHarness(env: Environment, response: Response) {
  const requests: Request[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn((input: string, init?: RequestInit) => {
      requests.push(new Request(input, init));
      return Promise.resolve(response);
    })
  );
  const rateLimiter = createMock<RateLimiterService>({
    add: (_type, fn) => fn(),
  });
  const addSpy = vi.spyOn(rateLimiter, 'add');
  return { client: new LeatherSponsorshipApiClient(env, rateLimiter), requests, addSpy };
}

describe(LeatherSponsorshipApiClient.name, () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('requests a quote from the production API in production', async () => {
    const h = createHarness({ environment: 'production' }, jsonResponse(200, quote));

    const result = await h.client.fetchQuote({ network: 'mainnet', sender: 'SP1', nonce: 3 });

    expect(result).toEqual(quote);
    expect(h.requests[0].url).toBe(`${LEATHER_API_URL_PRODUCTION}/v1/sponsorship/quote`);
    expect(h.requests[0].method).toBe('POST');
    expect(h.requests[0].headers.get('X-Client-ID')).toBeTruthy();
    expect(await h.requests[0].json()).toEqual({ network: 'mainnet', sender: 'SP1', nonce: 3 });
    expect(h.addSpy).toHaveBeenCalledWith(expect.anything(), expect.any(Function), {
      priority: leatherApiPriorities.sponsorship,
      signal: undefined,
    });
  });

  it('uses the staging API outside production', async () => {
    const h = createHarness({ environment: 'development' }, jsonResponse(200, quote));

    await h.client.fetchQuote({ network: 'testnet', sender: 'ST1', nonce: 0 });

    expect(h.requests[0].url).toBe(`${LEATHER_API_URL_STAGING}/v1/sponsorship/quote`);
  });

  it('replaces the base with the sponsorship API override', async () => {
    const h = createHarness(
      { environment: 'production', sponsorshipApiUrl: 'https://sponsor.test/' },
      jsonResponse(200, quote)
    );

    await h.client.fetchQuote({ network: 'mainnet', sender: 'SP1', nonce: 3 });

    expect(h.requests[0].url).toBe('https://sponsor.test/v1/sponsorship/quote');
  });

  it('posts the quote id and transaction to submit', async () => {
    const h = createHarness(
      { environment: 'production' },
      jsonResponse(200, { txid: '0xabc', transaction: '0x00' })
    );

    const result = await h.client.submit({ quoteId: 'quote-1', transaction: '0x0102' });

    expect(result).toEqual({ txid: '0xabc', transaction: '0x00' });
    expect(h.requests[0].url).toBe(`${LEATHER_API_URL_PRODUCTION}/v1/sponsorship/submit`);
    expect(await h.requests[0].json()).toEqual({ quoteId: 'quote-1', transaction: '0x0102' });
  });

  it('throws a typed error carrying the error code and reason', async () => {
    const h = createHarness(
      { environment: 'production' },
      jsonResponse(422, {
        error: 'Not eligible',
        code: 'not_eligible',
        reason: 'fee_too_low',
      })
    );

    const error = await h.client
      .submit({ quoteId: 'quote-1', transaction: '0x0102' })
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(LeatherApiError);
    if (!(error instanceof LeatherApiError)) return;
    expect(error.status).toBe(422);
    expect(error.data).toEqual({
      error: 'Not eligible',
      code: 'not_eligible',
      reason: 'fee_too_low',
    });
  });

  it('rejects a quote that does not match the schema', async () => {
    const h = createHarness(
      { environment: 'production' },
      jsonResponse(200, { ...quote, satsPerStx: undefined })
    );

    await expect(
      h.client.fetchQuote({ network: 'mainnet', sender: 'SP1', nonce: 3 })
    ).rejects.toThrow();
  });
});
