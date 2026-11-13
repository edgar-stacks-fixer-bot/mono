import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import { LEATHER_API_URL_PRODUCTION, LEATHER_API_URL_STAGING } from '@leather.io/constants';

import { Types } from '../../../inversify.types';
import type { Environment } from '../../environment';
import { leatherApiPriorities } from '../../rate-limiter/leather-rate-limiter';
import { RateLimiterService, RateLimiterType } from '../../rate-limiter/rate-limiter.service';
import type { ApiRequestOptions } from '../types';
import { LeatherApiError, readLeatherApiErrorData } from './leather-api.error';

const sponsorshipQuoteSchema = z.object({
  quoteId: z.string(),
  feeRecipientPrincipal: z.string(),
  expiresAt: z.string(),
  satsPerStx: z.string(),
  minFeeSats: z.coerce.number(),
  maxFeeSats: z.coerce.number(),
});
export type SponsorshipQuote = z.infer<typeof sponsorshipQuoteSchema>;

const sponsorshipSubmitResultSchema = z.object({
  txid: z.string(),
  transaction: z.string(),
});
export type SponsorshipSubmitResult = z.infer<typeof sponsorshipSubmitResultSchema>;

export interface SponsorshipQuoteRequest {
  network: 'mainnet' | 'testnet';
  sender: string;
  nonce: number;
}

export interface SponsorshipSubmitRequest {
  quoteId: string;
  transaction: string;
}

function getSponsorshipApiBaseUrl(env: Environment) {
  if (env.sponsorshipApiUrl) return env.sponsorshipApiUrl;
  return env.environment === 'production'
    ? LEATHER_API_URL_PRODUCTION
    : (env.leatherApiUrl ?? LEATHER_API_URL_STAGING);
}

@injectable()
export class LeatherSponsorshipApiClient {
  private readonly baseUrl: string;
  private readonly clientId = uuidv4();

  constructor(
    @inject(Types.Environment) env: Environment,
    private readonly rateLimiter: RateLimiterService
  ) {
    this.baseUrl = getSponsorshipApiBaseUrl(env).replace(/\/+$/, '');
  }

  async fetchQuote(body: SponsorshipQuoteRequest, { signal }: ApiRequestOptions = {}) {
    const data = await this.post('/v1/sponsorship/quote', body, signal);
    return sponsorshipQuoteSchema.parse(data);
  }

  async submit(body: SponsorshipSubmitRequest, { signal }: ApiRequestOptions = {}) {
    const data = await this.post('/v1/sponsorship/submit', body, signal);
    return sponsorshipSubmitResultSchema.parse(data);
  }

  private async post(path: string, body: object, signal?: AbortSignal): Promise<unknown> {
    return this.rateLimiter.add(
      RateLimiterType.Leather,
      async () => {
        const response = await fetch(`${this.baseUrl}${path}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Client-ID': this.clientId,
          },
          body: JSON.stringify(body),
          signal,
        });
        if (!response.ok) {
          throw new LeatherApiError(
            response.url || `${this.baseUrl}${path}`,
            response.status,
            response.statusText,
            await readLeatherApiErrorData(response)
          );
        }
        const data: unknown = await response.json();
        return data;
      },
      { priority: leatherApiPriorities.sponsorship, signal }
    );
  }
}
